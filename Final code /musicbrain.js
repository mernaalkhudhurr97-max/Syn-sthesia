// --------------------------------------------------
// MUSIC BRAIN / MAIN CONTROLLER
// Creative Coding Final Project
//
// This file is the main controller.
// It should be the LAST script loaded in index.html.
//
// Correct loading order:
//
// Bass.js
// Drum.js
// Guitar.js
// strings.js
// pianoFFT.js
// vocalpitch.js
// synth.js
// wholefft.js
// full.js
// switchcode.js
// musicbrain.js
//
// This file:
// 1. loads all audio files
// 2. sets up all audio/FFT/visual systems
// 3. starts/pauses music with mouse click or space
// 4. updates FFT and MIDI outputs
// 5. draws full.js visual layer
// 6. draws switchcode.js bouncing control objects
// --------------------------------------------------

// --------------------------------------------------
// AI ACKNOWLEDGEMENT
//
// ChatGPT was used to help improve code comments, add safer checks,
// and explain the MIDI timing/synchronisation structure.
// The bass audio logic and final implementation were reviewed
// and adapted for this project.
// --------------------------------------------------

// --------------------------------------------------
// GLOBAL MUSIC STATE
// --------------------------------------------------

let musicIsPlaying = false;


// --------------------------------------------------
// PRELOAD
// p5.js calls this before setup().
// --------------------------------------------------

function preload() {
  if (typeof preloadBassInputs === "function") {
    preloadBassInputs();
  }

  if (typeof preloadDrumInputs === "function") {
    preloadDrumInputs();
  }

  if (typeof preloadGuitarInputs === "function") {
    preloadGuitarInputs();
  }

  if (typeof preloadStringsInputs === "function") {
    preloadStringsInputs();
  }

  if (typeof preloadSynthFFTInputs === "function") {
    preloadSynthFFTInputs();
  }

  if (typeof preloadVocalPitchInputs === "function") {
    preloadVocalPitchInputs();
  }
}


// --------------------------------------------------
// SETUP
// p5.js calls this once.
// --------------------------------------------------

function setup() {
  console.log("musicbrain setup running");

  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  colorMode(RGB);
  textAlign(CENTER, CENTER);

  // -----------------------------
  // SETUP AUDIO BACKENDS
  // -----------------------------

  if (typeof setupBassInputs === "function") {
    setupBassInputs();
  }

  if (typeof setupDrumInputs === "function") {
    setupDrumInputs();
  }

  if (typeof setupGuitarInputs === "function") {
    setupGuitarInputs();
  }

  if (typeof setupStringsInputs === "function") {
    setupStringsInputs();
  }

  // -----------------------------
  // SETUP FFT BACKENDS
  // -----------------------------

  if (typeof setupSynthFFTInputs === "function") {
    setupSynthFFTInputs();
  }

  if (typeof setupWholeFFTInputs === "function") {
    setupWholeFFTInputs();
  } else {
    console.log("setupWholeFFTInputs() not found. Check wholefft.js is loaded before musicbrain.js.");
  }

  // -----------------------------
  // SETUP VOCAL PITCH BACKEND
  // -----------------------------

  if (typeof setupVocalPitchInputs === "function") {
    setupVocalPitchInputs();
  }

  // -----------------------------
  // SETUP SYNTH BACKEND
  // -----------------------------

  if (typeof setupSynth === "function") {
    setupSynth();
  } else {
    console.log("setupSynth() not found. Check synth.js is loaded before musicbrain.js.");
  }

  // -----------------------------
  // SETUP FINAL VISUAL LAYER
  // full.js should provide:
  // mv_setup()
  // mv_hookHits()
  // mv_draw()
  // -----------------------------

  if (typeof mv_setup === "function") {
    mv_setup();
  } else {
    console.log("mv_setup() not found. Check full.js is loaded before musicbrain.js.");
  }

  if (typeof mv_hookHits === "function") {
    mv_hookHits();
  }

  // -----------------------------
  // SETUP BOUNCING SWITCHERS
  // switchcode.js should provide:
  // setupBounceSwitchers()
  // updateBounceSwitchers()
  // drawBounceSwitchers()
  // -----------------------------

  console.log("setupBounceSwitchers exists?", typeof setupBounceSwitchers);

  if (typeof setupBounceSwitchers === "function") {
    setupBounceSwitchers();
    console.log("bounce switchers setup called");
  } else {
    console.log("setupBounceSwitchers() not found. Check switchcode.js is loaded before musicbrain.js.");
  }
}


// --------------------------------------------------
// DRAW
// p5.js calls this continuously.
// --------------------------------------------------

function draw() {
  background(4, 6, 22);

  // -----------------------------
  // UPDATE AUDIO OUTPUTS
  // -----------------------------

  if (musicIsPlaying) {
    checkAllMusicHits();

    if (typeof updateSynthFFTOutputs === "function") {
      updateSynthFFTOutputs();
    }

    if (typeof updateWholeFFTOutputs === "function") {
      updateWholeFFTOutputs();
    }
  } else {
    if (typeof resetWholeFFTOutputs === "function") {
      resetWholeFFTOutputs();
    }

    if (typeof resetSynthFFTOutputs === "function") {
      resetSynthFFTOutputs();
    }
  }

  // -----------------------------
  // DRAW FINAL VISUAL FIRST
  // -----------------------------

  if (typeof mv_draw === "function") {
    if (
      typeof mv_ready !== "undefined" &&
      !mv_ready &&
      typeof mv_setup === "function"
    ) {
      mv_setup();
    }

    mv_draw();
  } else {
    drawMissingVisualMessage();
  }

  // -----------------------------
  // UPDATE + DRAW BOUNCING SWITCHERS AFTER FULL VISUAL
  //
  // This makes the bouncers appear on top of the main visual.
  // -----------------------------

  if (typeof updateBounceSwitchers === "function") {
    updateBounceSwitchers();
  }

  if (typeof drawBounceSwitchers === "function") {
    drawBounceSwitchers();
  } else {
    push();
    fill(255, 0, 0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(22);
    text("drawBounceSwitchers missing", width / 2, height / 2);
    pop();
  }

  drawMusicStatus();
}


// --------------------------------------------------
// CHECK MIDI HITS
//
// These functions read note events from:
// Bass.js
// Drum.js
// Guitar.js
// strings.js
//
// full.js uses mv_hookHits() to turn these into visual effects.
// --------------------------------------------------

function checkAllMusicHits() {
  if (typeof getActiveBassHits === "function") {
    let bassHits = getActiveBassHits();

    for (let note of bassHits) {
      createBassVisual(note);
    }
  }

  if (typeof getActiveDrumHits === "function") {
    let drumHits = getActiveDrumHits();

    for (let note of drumHits) {
      createDrumVisual(note);
    }
  }

  if (typeof getGuitarHits === "function") {
    let guitarHits = getGuitarHits();

    for (let note of guitarHits) {
      createGuitarVisual(note);
    }
  }

  if (typeof getActiveStringsHits === "function") {
    let stringsHits = getActiveStringsHits();

    for (let note of stringsHits) {
      createStringsVisual(note);
    }
  }
}


// --------------------------------------------------
// FALLBACK VISUAL CALLBACKS
// full.js replaces these through mv_hookHits().
// --------------------------------------------------

function createBassVisual(note) {
  // Replaced by mv_hookHits() in full.js.
}

function createDrumVisual(note) {
  // Replaced by mv_hookHits() in full.js.
}

function createGuitarVisual(note) {
  // Replaced by mv_hookHits() in full.js.
}

function createStringsVisual(note) {
  // Replaced by mv_hookHits() in full.js.
}


// --------------------------------------------------
// MOUSE INPUT
// Browser audio needs a click before it can play.
// --------------------------------------------------

function mousePressed() {
  userStartAudio();

  if (typeof handleBounceClick === "function" && handleBounceClick(mouseX, mouseY)) {
    return;
  }

  if (musicIsPlaying) {
    pauseAllMusic();
  } else {
    playAllMusic();
  }
}


// --------------------------------------------------
// PLAY ALL AUDIO LAYERS
// --------------------------------------------------

function playAllMusic() {
  if (typeof playBass === "function") {
    playBass();
  }

  if (typeof playDrum === "function") {
    playDrum();
  }

  if (typeof playGuitar === "function") {
    playGuitar();
  }

  if (typeof playStrings === "function") {
    playStrings();
  }

  if (typeof playSynthFFT === "function") {
    playSynthFFT();
  }

  if (typeof playVocals === "function") {
    playVocals();
  }

  musicIsPlaying = true;
}


// --------------------------------------------------
// PAUSE ALL AUDIO LAYERS
// --------------------------------------------------

function pauseAllMusic() {
  if (typeof pauseBass === "function") {
    pauseBass();
  }

  if (typeof pauseDrum === "function") {
    pauseDrum();
  }

  if (typeof pauseGuitar === "function") {
    pauseGuitar();
  }

  if (typeof pauseStrings === "function") {
    pauseStrings();
  }

  if (typeof pauseSynthFFT === "function") {
    pauseSynthFFT();
  }

  if (typeof pauseVocals === "function") {
    pauseVocals();
  }

  musicIsPlaying = false;
}


// --------------------------------------------------
// OPTIONAL KEYBOARD CONTROL
// Track switching is handled by bouncing objects.
// Space is only a backup play/pause shortcut.
// --------------------------------------------------

function keyPressed() {
  if (key === " ") {
    userStartAudio();

    if (musicIsPlaying) {
      pauseAllMusic();
    } else {
      playAllMusic();
    }
  }
}


// --------------------------------------------------
// STATUS TEXT
// --------------------------------------------------

function drawMusicStatus() {
  push();

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(18);

  if (musicIsPlaying) {
    text("PLAYING — bouncing objects are controlling the mix", width / 2, 30);
  } else {
    text("CLICK TO PLAY", width / 2, 30);
  }

 // textSize(12);
 // fill(255, 220);
 // text(
 //   "Moving triggers control instrument when clicked (to mute/unmute) or when they hit the wall (to switch track). Wall boundaries are adjustable with slider. Left/Right postion = Pan| Distance from Centre = Reverb Amount.",
 //   width / 2,
 //   height - 24
 // );
  textSize(12);
  fill(255, 220);
  textAlign(CENTER, CENTER);

  text(
    "Moving triggers control instrument when clicked (to mute/unmute) or when they hit the wall (to switch track).",
    width / 2,
    height - 40
  );
  text(
    "Wall boundaries are adjustable with slider. Left/Right position = Pan | Distance from Centre = Reverb Amount.",
    width / 2,
    height - 20
  );
  pop();
}


// --------------------------------------------------
// ERROR MESSAGE IF FULL VISUAL IS MISSING
// --------------------------------------------------

function drawMissingVisualMessage() {
  push();

  fill(255);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(24);
  text(
    "mv_draw not found — check full.js is loaded before musicbrain.js",
    width / 2,
    height / 2
  );

  pop();
}


// --------------------------------------------------
// RESPONSIVE CANVAS
// --------------------------------------------------

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (typeof mv_setup === "function") {
    mv_setup();
  }

  if (typeof setupBounceSwitchers === "function") {
    setupBounceSwitchers();
  }
}