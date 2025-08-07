import os

from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, url_for, jsonify
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash

from datetime import datetime

# Configure application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Database configuration - use PostgreSQL on Vercel, SQLite locally
if os.environ.get('VERCEL'):
    # Use PostgreSQL on Vercel
    database_url = os.environ.get('DATABASE_URL')
    if database_url:
        db = SQL(database_url)
    else:
        # Fallback to SQLite if no DATABASE_URL
        db = SQL("sqlite:///database.db")
else:
    # Use SQLite locally
    db = SQL("sqlite:///database.db")

@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in"""

    # Forget any user_id
    session.clear()

    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        # Ensure username was submitted
        if not username:
            return redirect("/")

        # Ensure password was submitted
        elif not password:
            return redirect("/")

        # Query database for username
        rows = db.execute("SELECT * FROM passwords WHERE id == (SELECT id FROM id WHERE username = ?)", username)

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(rows[0]["password"], password):
            return redirect("/")

        # Remember which user has logged in
        id = db.execute("SELECT id FROM id WHERE username = ?", username)
        session["id"] = id[0]["id"]
        session["user_name"] = username
        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "GET":
        user_name = session.get("user_name")
        return render_template("main.html", user_id=user_name)
    else:
        user_id = session.get("id")
        if user_id:
            user_name = session.get("user_name")
            data = request.get_json()
            xp_gained = int(data['xp_gain'])
            level_xps = [30, 120, 240, 360, 480, 600, 840, 1080, 1500, 2000]
            stats = db.execute("SELECT * FROM xp WHERE id == ?", user_id)
            level = int(stats[0]['level'])
            xp = int(stats[0]['xp'])
            total_xp = xp + xp_gained
            if level != 10:
                if total_xp > level_xps[level]:
                    new_xp = level_xps[level] - total_xp
                    db.execute("UPDATE xp SET xp = ?, level = ? WHERE id = (SELECT id FROM id WHERE username = ?);", new_xp, level + 1, user_name)
                    return jsonify({'condition': 0, 'level': level + 1, 'xp': new_xp, 'progress': level_xps[level]})
                else:
                    db.execute("UPDATE xp SET xp = ?, level = ? WHERE id = (SELECT id FROM id WHERE username = ?);", total_xp, level, user_name)
                    return jsonify({'condition': 1, 'level': level, 'xp': total_xp, 'progress': level_xps[level]})
            else:
                db.execute("UPDATE xp SET xp = ?, level = ? WHERE id = (SELECT id FROM id WHERE username = ?);", total_xp, level, user_name)
                return jsonify({'condition': 2, 'level': level, 'xp': total_xp, 'progress': level_xps[level]})
        else:
            return jsonify({'condition': 3, 'level': 0, 'xp': 0, 'progress': 0})

@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user"""
    if request.method == "GET":
        return render_template("register.html")
    else:
        username = request.form.get("username")
        password = request.form.get("password")
        confirmation = request.form.get("confirmation")
        previous = db.execute("SELECT * FROM id WHERE username == ?", username)
        if not username or len(previous) != 0:
            return redirect("/")
        if not password:
            return redirect("/")
        if not confirmation or password != confirmation:
            return redirect("/")
        hashed_password = generate_password_hash(password)
        db.execute("INSERT INTO id (username) VALUES (?)", username)
        db.execute("INSERT INTO passwords (id, password) SELECT id, ? FROM id WHERE username = ?;", hashed_password, username)
        db.execute("INSERT INTO xp (id, xp, level) SELECT id, 0, 0 FROM id WHERE username = ?;", username)
        return redirect("/")

@app.route("/profile", methods=["GET", "POST"])
def profile():
    """Register user"""
    user_id = session.get("id")
    user_name = session.get("user_name")
    if request.method == "POST":
        data = request.get_json()
        print(data)
        level = db.execute("SELECT * FROM xp WHERE id == ?", user_id)
        level_xps = [30, 120, 240, 360, 480, 600, 840, 1080, 1500, 2000]
        return jsonify({'condition': 2, 'level': level[0]["level"], 'xp': level[0]["xp"], 'progress': level_xps[level[0]["level"]]})
    if user_id:
        level = db.execute("SELECT * FROM xp WHERE id == ?", user_id)
        level_xps = [30, 120, 240, 360, 480, 600, 840, 1080, 1500, 2000]
        return render_template("profile.html", level=level[0]["level"], xp = level[0]["xp"], user_id=user_name)
    else:
        return redirect("login")

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
