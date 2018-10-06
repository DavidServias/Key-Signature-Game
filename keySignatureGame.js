$(document).ready(function(){

  var correct = new Audio();
  correct.src="https://www.soundjay.com/button/sounds/button-09.mp3";
  var wrong = new Audio();
  wrong.src="https://www.soundjay.com/button/sounds/button-10.mp3";
  var timeUp = new Audio();
  timeUp.src ="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3";
  var heightWidth=360;
  var radius=110;
  var points=0;
  var correctAnswer=[];
  var input="";
  var count=10;
  var mode="major";
  let keySigArr=[//last number of each array represents id
                    ["0 sharps/flats", "C major", "a minor", "#key0", "C", "a"],
                    ["1 sharp", "G major", "a minor", "#key1", "G", "e"],
                    ["2 sharps", "D major", "a minor", "#key2", "D", "b"],
                    ["3 sharps", "A major", "a minor", "#key3", "A", "f#"],
                    ["4 sharps", "E major", "a minor", "#key4", "E", "c#"],
                    ["5 sharps", "B major", "a minor", "#key5", "B", "g#"],
                    ["6 sharps", "F# major", "a minor", "#key6", "F#", "d#"],
                    ["7 sharps", "C# major", "a minor", "#key7", "C#", "a#"],
                    ["1 flat", "F major", "a minor", "#key8", "F", "d"],
                    ["2 flats", "Bb major", "a minor", "#key9", "Bb", "g"],
                    ["3 flats", "Eb major", "a minor", "#key10", "Eb", "c"],
                    ["4 flats", "Ab major", "a minor", "#key11", "Ab", "f"],
                    ["5 flats", "Db major", "a minor", "#key12", "Db", "bb"],
                    ["6 flats", "Gb major", "a minor", "#key13", "Gb", "eb"],
                    ["7 flats", "Cb major", "a minor", "#key14", "Cb", "ab"]
                  ];

  function makeCircle(heightWidth, radius){
    $("#boundaries").attr("height", heightWidth.toString() );
    $("#boundaries").attr("width", heightWidth.toString() );
    $("#circle").attr("cx", (heightWidth/2).toString());
    $("#circle").attr("cy", (heightWidth/2).toString());
    $("#circle").attr("r", radius.toString() );
  };

  function setCoordinates(angle, r, centerPoint, ID){
       var radians=(angle*Math.PI)/180;
        var X=Math.round(Math.cos(radians)*r + centerPoint);
        var Y=Math.round(centerPoint-Math.sin(radians)*r);
        $(ID).attr("x", X.toString() );
        $(ID).attr("y", Y.toString() );
  };

  function addKeyNames(heightWidth, radius){
    var centerPoint=heightWidth/2;
    var r=radius + 20;//add distance to make keys appear outside of the circle
    var position=0;//position on the circle
    var modeIndex;
    if (mode==="major"){
      modeIndex=4;
    } else {
      modeIndex=5;
    }
    for (x=90; x>=-120;x -=30){//sets sharp keys coordiantes
      var ID="#key"+position;
      setCoordinates(x, r, centerPoint, ID);
      $(ID).html(keySigArr[position][modeIndex]);//
      position++;
    };
    position=8;
    for (x=-240; x<=-150; x+=30){//sets coordinates for F-Ab
      ID="#key"+position;
      setCoordinates(x, r, centerPoint, ID);
      $(ID).html(keySigArr[position][modeIndex]);//
      position++;
    };
    position=14
    r=r+40
    for (x=-60; x>=-120; x-=30){//sets coordinates for Db, Gb and Cb
      ID="#key"+position;
      setCoordinates(x, r, centerPoint, ID);
      $(ID).html(keySigArr[position][modeIndex]);//
      position--;
    };
  };

  function generateKeySig() {
    let num=Math.floor(Math.random() * 15);
    let keySig=keySigArr[num];
    return keySig;
  };

  function addStartPrompt(){
    $("#key-sig").attr("x", (heightWidth/2).toString() );
    $("#key-sig").attr("y", (heightWidth/2).toString() );
    $("#key-sig").html("Click Start to Begin");
  };

  function addKeySig(keySig){
    $("#key-sig").attr("x", (heightWidth/2).toString() );
    $("#key-sig").attr("y", (heightWidth/2).toString() );
    $("#key-sig").html(function(){
      return keySig[0];
    });
  };

  function handleClick(){
    if( event.target.matches(".key") ){
      input=("#"+event.target.id);
      if (input===correctAnswer[3]){
        correct.play();
        points++;
        document.getElementById("score").innerHTML="Score: "+points;
        document.removeEventListener("click",handleClick);
        displayResult(true);
      } else {
        wrong.play();
        points--;
        document.getElementById("score").innerHTML="Score: "+points;
        document.removeEventListener("click",handleClick);
        displayResult(false);
      }
     };
  };

  function displayResult(isCorrect){
    if (isCorrect){
      var colorChange="green";
      var message="CORRECT! +1"
    } else {
      var colorChange="red";
      var message="WRONG! -1";
    };
    document.getElementById("circle").setAttribute("fill", colorChange);
    document.getElementById("key-sig").innerHTML = message;
    setTimeout(function(){
      document.getElementById("circle").setAttribute("fill","yellow");
      cycle();
    },500);
  };

  function startTimer(){
    $("#start-game").off();
    points=0;
    $("#score").html("Score: "+points);
    var count=30;
    var go= setInterval(function(){
        if (count<=0){
        document.getElementById("timer").innerHTML = "Time: "+count;
        timeIsUp();
        clearInterval(go);
        } else {
        document.getElementById("timer").innerHTML = "Time: "+count;
        }
        count--;
      }, 1000);
  };

  function cycle() {
      let num=Math.floor(Math.random() * 15);
      correctAnswer=keySigArr[num];
      addKeySig(correctAnswer);
      document.addEventListener("click", handleClick);
  };

  function toggleOn(){
      $("#major_minor_toggle").click(function(){
        if (mode==="major"){
          mode="minor";
        } else {
          mode="major";
        };
        addKeyNames(heightWidth, radius);
      })
  }

  function toggleOff(){
      $("#major_minor_toggle").off();
  };

  function startGame(){
    $("#start-game").click(function() {
    toggleOff();
    cycle();
    startTimer();
    });
  };

  function timeIsUp(){
    timeUp.play();
    document.removeEventListener("click",handleClick);
    document.getElementById("key-sig").innerHTML = "Time Is Up!";
    setTimeout(function(){
      document.getElementById("key-sig").innerHTML = "Your Score: "+points;
    },2000);
    setTimeout(function(){
      addStartPrompt();
    },4000);
    toggleOn();
    startGame();
  };

  makeCircle(heightWidth, radius);
  addStartPrompt();
  toggleOn();
  addKeyNames(heightWidth,radius);
  startGame();

});
