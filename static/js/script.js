document.addEventListener('DOMContentLoaded', function() {
document.querySelectorAll('.custom-num').forEach(function(container) {
  const numInput = container.querySelector('.num-input');
  const arrUp = container.querySelector('.fa.fa-angle-up');
  const arrDown = container.querySelector('.fa.fa-angle-down');
  const labels = container.querySelector('.labels');
  numInput.style.color = numInput.dataset.color;
  arrUp.addEventListener('click', () => {
    numInput.stepUp();
    checkMaxMin();
  });

  arrDown.addEventListener('click', () => {
    numInput.stepDown();
    checkMaxMin();
  });

  numInput.addEventListener('input', checkMaxMin);

  function checkMaxMin() {
    const numInputValue = parseInt(numInput.value);
    const numInputMax = parseInt(numInput.max);
    const numInputMin = parseInt(numInput.min);

    if(numInputValue == numInputMax) {
      numInput.style.paddingTop = "0.3em";
      numInput.style.height = "5em";
      arrUp.style.display = "none";
      numInput.style.paddingBottom = "0";
      arrDown.style.display = "block";
      container.style.height = "5em";
      labels.style.paddingBottom = "1em";
    }
    else if (numInputValue == numInputMin){
      numInput.style.paddingBottom = "0.8em";
      //labels.style.paddingBottom = "3em";
      numInput.style.height = "5em";
      arrDown.style.display = "none";
      numInput.style.paddingTop = "0";
      arrUp.style.display = "block";
      container.style.height = "5em";
    }
    else {
      numInput.style.padding = "0";
      numInput.style.height = "7em";
      arrUp.style.display = "block";
      arrDown.style.display = "block";
      container.style.height = "7.5em";
      labels.style.paddingBottom = "0em";
    }
  }
});
});

function startCountdown() {
  $('#question').css('display', 'none');
  $('#time').css('display', 'flex');
  $('#xp').css('display', 'none');
  var h = parseInt(document.getElementById("hs").value);
  var m = parseInt(document.getElementById("ms").value);
  var s = 0
  var xp = h * 60 + m
  let hours = document.getElementById('hours');
  let minutes = document.getElementById('minutes');
  let seconds = document.getElementById('seconds');
  let isPaused = false;

  let hh = document.getElementById('hh');
  let mm = document.getElementById('mm');
  let ss = document.getElementById('ss');

  let min_dot = document.querySelector('.min_dot');
  let hr_dot = document.querySelector('.hr_dot');
  let sec_dot = document.querySelector('.sec_dot');

  document.getElementById('stopBtn').addEventListener('click', function() {
    if(isPaused){
      isPaused = false;
    }
    else{
      isPaused = true;
    }
    });
  let x = setInterval(function(){
    if (isPaused) {
      return;
    }
    if (m == 0 && h != 0)
    {
      m = 60
      h = h-1
    }
    if  (s == 0 && m != 0){
        m = m - 1
        s = 60
    }
    s = s-1
    //output the result in element with id
    hours.innerHTML = h + "<br><span>Hours<span>"
    minutes.innerHTML = m + "<br><span>Minutes<span>"
    seconds.innerHTML = s + "<br><span>Seconds<span>"

    // animate stroke
    hh.style.strokeDashoffset = 440 - (440 * h) / 24;
    // 24 hours in a day
    mm.style.strokeDashoffset = 440 - (440 * m) / 60;
    // 60 minutes in an hour
    ss.style.strokeDashoffset = 440 - (440 * s) / 60;
    // 60 seconds in a minute

    //animate circle dots
    hr_dot.style.transform = `rotateZ(${h * 15}deg)`;
    // 360 deg / 24 hours = 15 deg
    min_dot.style.transform = `rotateZ(${m * 6}deg)`;
    // 360 deg / 60 minutes = 6 deg
    sec_dot.style.transform = `rotateZ(${s * 6}deg)`;
    // 360 deg / 60 seconds = 6 deg

    // if the countdown is over...
    if (s == 0 && m == 0 && h == 0)
    {
      const data = {
        xp_gain: xp
     };
      fetch('/', {method: 'POST', headers: {
        'Content-Type': 'application/json'}, body: JSON.stringify(data)}) .then(response => response.json())
    .then(responseData => {
        console.log(responseData)
        var condition = responseData.condition;
        var level = responseData.level;
        var xp_total = responseData.xp;
        var progress = responseData.progress;
        var procentage = parseInt(xp_total / progress * 100);
        console.log(procentage)
        $('.skill').css('display', 'block');
        $('.xp').css('width', `${procentage}%`);
        let sheet = document.styleSheets[0]; // Directly select the first stylesheet
        if (sheet) {
            for (let rule of sheet.cssRules) {
                if (rule.type === CSSRule.KEYFRAMES_RULE && rule.name === 'xp') {
                    for (let keyframe of rule.cssRules) {
                        if (keyframe.keyText === '100%') {
                            keyframe.style.width = `${procentage}%`;
                        }
                    }
                }
            }
        }
         $('#xp').css('display', 'flex');
         if (condition==0)
         {
          $('#xp').html(`Congrats, you leveled up to level ${level}! You've gained ${xp} xp in this session.`);
         }
         else if (condition==1 || condition==2)
         {
          $('#xp').html(`Congrats, you've completed your study session and earned `+xp+' xp in this session.');
         }
         else
         {
          $('.skill li').css('display', 'None');
          $('.bar').css('display', 'None');
          $('#xp').html('Please login to save your xp.');
         }
    })
    .catch(error => {
        console.error('Error:', error);
    });
      clearInterval(x);
    }
  }, 1000)
  document.getElementById('resetBtn').addEventListener('click', function() {
    $('#question').css('display', 'flex');
    $('#time').css('display', 'none');
    clearInterval(x);
    m = parseInt(document.getElementById("ms").value) - 1;
    s = 60;
    $('.skill').css('display', 'none');
      });
}


