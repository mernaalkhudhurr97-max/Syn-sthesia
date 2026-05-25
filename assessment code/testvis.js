// --------------------------------------------------
// BASS VISUAL TEST
// --------------------------------------------------

let activeBassNote = "Click to play";
let activeBassMidi = "-";
let activeBassVelocity = "off";

let circleSize = 120;
let targetCircleSize = 120;
let visualHoldFrames = 0;

let bgValue = 20;


// --------------------------------------------------
// P5 PRELOAD AND SETUP
// --------------------------------------------------

function preload() {
  preloadBassInputs();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  setupBassInputs();
}


// --------------------------------------------------
// DRAW VISUAL
// --------------------------------------------------

function draw() {
  background(bgValue);

  if (bassIsPlaying) {
    let hits = getActiveBassHits();

    for (let note of hits) {
      triggerBassVisual(note);
    }
  }

  if (visualHoldFrames > 0) {
    visualHoldFrames--;
  } else {
    targetCircleSize = 120;
    bgValue = lerp(bgValue, 20, 0.15);
  }

  circleSize = lerp(circleSize, targetCircleSize, 0.18);

  noStroke();
  fill(255);
  ellipse(width / 2, height / 2, circleSize, circleSize);

  textSize(32);
  text(activeBassNote, width / 2, height / 2 - 190);

  textSize(18);
  text(
    "Active Bass Track: " + (activeBassTrack + 1),
    width / 2,
    height / 2 - 145
  );

  text(
    "MIDI number: " + activeBassMidi,
    width / 2,
    height / 2 + 175
  );

  text(
    "Velocity: " + activeBassVelocity,
    width / 2,
    height / 2 + 205
  );

  textSize(15);
  text(
    "Click = play / pause   |   Keys 1–4 = switch bass track",
    width / 2,
    height - 42
  );
}


// --------------------------------------------------
// CLICK TO PLAY OR PAUSE
// --------------------------------------------------

function mousePressed() {
  userStartAudio();

  if (bassIsPlaying) {
    pauseBass();
    activeBassNote = "Paused";
  } else {
    playBass();
    activeBassNote = "Playing Bass Track " + (activeBassTrack + 1);
  }
}


// --------------------------------------------------
// SWITCH BETWEEN BASS TRACKS
// --------------------------------------------------

function keyPressed() {
  if (key === "1") {
    switchBassTrack(0);
    activeBassNote = "Bass Track 1";
  }

  if (key === "2") {
    switchBassTrack(1);
    activeBassNote = "Bass Track 2";
  }

  if (key === "3") {
    switchBassTrack(2);
    activeBassNote = "Bass Track 3";
  }

  if (key === "4") {
    switchBassTrack(3);
    activeBassNote = "Bass Track 4";
  }


  if (key === "5") {
    muteBass();
    activeBassNote = "No Bass";
    activeBassMidi = "-";
    activeBassVelocity = "off";
  }
}


// --------------------------------------------------
// VISUAL REACTION TO EACH BASS NOTE
// --------------------------------------------------

function triggerBassVisual(note) {
  activeBassNote = note.name;
  activeBassMidi = note.midi;

  if (note.velocity < 0.33) {
    activeBassVelocity = "low";
    targetCircleSize = 220;
    bgValue = 55;
  } else {
    activeBassVelocity = "high";
    targetCircleSize = 380;
    bgValue = 95;
  }

  visualHoldFrames = 12;
}


// --------------------------------------------------
// RESPONSIVE CANVAS
// --------------------------------------------------

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}