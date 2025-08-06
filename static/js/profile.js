{const data = {
      'message': 'Hi'
   };
fetch('/profile', {method: 'POST', headers: {
    'Content-Type': 'application/json'}, body: JSON.stringify(data)}) .then(response => response.json())
.then(responseData => {
    console.log(responseData)
    var condition = responseData.condition;
    var level = responseData.level;
    var xp_total = responseData.xp;
    var progress = responseData.progress;
    var procentage = parseInt(xp_total / progress * 100);
    $('.skill').css('display', 'block');
    $('.xp').css('width', `${procentage}%`);
    for (let sheet of document.styleSheets) {
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
})
.catch(error => {
    console.error('Error:', error);
});
}
