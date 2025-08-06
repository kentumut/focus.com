function startRGBColorEffect() {
    var h1Element = document.querySelector("h1");
    var interval = 10; // Time interval in milliseconds
    var hue = 0;

    setInterval(function() {
        // Use HSL color model for more vibrant colors
        var hueValue = hue % 360; // Hue value between 0 and 359
        var saturation = "100%"; // Full saturation
        var lightness = "50%"; // Medium lightness

        var color = "hsl(" + hueValue + ", " + saturation + ", " + lightness + ")";
        h1Element.style.color = color;

        hue = (hue + 1) % 360;
    }, interval);
  }

  function startCountdown() {
    startRGBColorEffect()
  var hoursInput = parseInt(document.getElementById("hours").value);
  var minutesInput = parseInt(document.getElementById("minutes").value);

  if (isNaN(hoursInput) || isNaN(minutesInput) || hoursInput < 0 || minutesInput < 0) {
      alert("Please enter valid hours and minutes.");
      return;
  }

  var totalDuration = (hoursInput * 60 * 60 + minutesInput * 60) * 1000;
  var targetTime = new Date().getTime() + totalDuration;

  document.getElementById("progress").style.display = "block";

  var countdownInterval = setInterval(function() {
      var currentTime = new Date().getTime();
      var timeDifference = targetTime - currentTime;

      var hours = Math.floor(timeDifference / (1000 * 60 * 60));
      var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      var countdownText = "";

      if (hours > 0) {
          countdownText += hours + "h ";
      }
      if (minutes > 0 || hours > 0) { // Include minutes only if hours are non-zero
          countdownText += minutes + "m ";
      }
      countdownText += seconds + "s";

      document.getElementById("countdown").innerHTML = countdownText;

      var remainingTime = timeDifference;
      var progressPercent = Math.max(((totalDuration - remainingTime) / totalDuration) * 100, 0);
      document.getElementById("progress-bar").style.width = progressPercent + "%";
      document.getElementById("progress-text").textContent = Math.floor(progressPercent) + "%";

      if (timeDifference <= 0) {
          clearInterval(countdownInterval);
          document.getElementById("countdown").innerHTML = "Time's up!";
      }
  }, 1000); // Update every 1 second
}
