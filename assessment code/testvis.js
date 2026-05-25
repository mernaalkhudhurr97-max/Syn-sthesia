// --------------------------------------------------
// BASS VISUAL TEST
// --------------------------------------------------

let activeBassNote = "Click to play";
let activeBassLevel = "off";

let circleSize = 100;
let circleTargetSize = 100;
let visualHoldFrames = 0;

let bassStarted = false;


// --------------------------------------------------
// P5 LOAD AND SETUP
// --------------------------------------------------

function preload() {
  BassSounds();
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);

  setupBassInputs();
}


// --------------------------------------------------
// DRAW VISUAL
// --------------------------------------------------

function draw() {
  background(20);

  if (bassStarted && BassSounds[0].isPlaying()) {
    updateBassOutputs(BassSounds[0].currentTime());
    checkBassVisualOutput();
  }

  if (visualHoldFrames > 0) {
    visualHoldFrames--;
  } else {
    circleTargetSize = 100;
  }

  circleSize = lerp(circleSize, circleTargetSize, 0.18);

  noStroke();
  fill(255);
  ellipse(width / 2, height / 2, circleSize, circleSize);

  fill(255);

  textSize(30);
  text(activeBassNote, width / 2, 120);

  textSize(18);
  text("Velocity: " + activeBassLevel, width / 2, 160);

  textSize(16);
  text("Click anywhere to play Bass 1", width / 2, height - 45);
}


// --------------------------------------------------
// PLAY BASS TRACK ON CLICK
// --------------------------------------------------

function mousePressed() {
  userStartAudio();

  for (let note of allBassMidiNotes) {
    note.triggered = false;
  }

  resetBassOutputs();

  activeBassNote = "Listening...";
  activeBassLevel = "off";

  circleSize = 100;
  circleTargetSize = 100;

  BassSounds[0].stop();
  BassSounds[0].play();

  bassStarted = true;
}


// --------------------------------------------------
// CONNECT BASS OUTPUTS TO VISUAL
// --------------------------------------------------

function checkBassVisualOutput() {
  for (let noteName in bassNotes) {
    if (bassNotes[noteName] !== "off") {
      activeBassNote = noteName;
      activeBassLevel = bassNotes[noteName];

      if (bassNotes[noteName] === "high") {
        circleTargetSize = 300;
      } else {
        circleTargetSize = 190;
      }

      visualHoldFrames = 12;
    }
  }
}