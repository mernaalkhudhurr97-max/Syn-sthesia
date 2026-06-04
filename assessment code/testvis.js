// --------------------------------------------------
// FULL MUSIC VISUAL TEST
//
// CONTROLS:
// Bass    = 1 2 3 4 / 5 off
// Drums   = Q W E R / T off
// Guitar  = A on / S off
// Strings = Z X C V / B off
// Synths  = always play with the full track
//
// Vocals:
// U = Vocal 1 ON
// I = Vocal 2 ON
// O = Vocal 3 ON
//
// J = Vocal 1 OFF
// K = Vocal 2 OFF
// L = Vocal 3 OFF
//
// P = all vocals ON/OFF
//
// Bouncing Synth:
// Left wall   = sine
// Right wall  = sine
// Top wall    = sine
// Bottom wall = sine
//
// Mouse   = play / pause all instruments
// --------------------------------------------------


// --------------------------------------------------
// MUSIC STATE
// --------------------------------------------------

let musicIsPlaying = false;

let bassDisplay = "Bass 1";
let drumDisplay = "Drums 1";
let guitarDisplay = "Guitar On";
let stringsDisplay = "Strings 1";


// --------------------------------------------------
// VISUAL STATE
// --------------------------------------------------

let visualHits = [];

let bgValue = 15;
let bgTarget = 15;
let shakeAmount = 0;

let synth1RingRotation = 0;
let synth2RingRotation = 0;

let wholeFFTRotation = 0;


// --------------------------------------------------
// BOUNCING SQUARE STATE
// This only controls the visual square.
// The sound comes from your separate synth backend.
// --------------------------------------------------

let bounceSquareX;
let bounceSquareY;

let bounceSquareSize = 48;

let bounceSquareSpeedX = 1.2;
let bounceSquareSpeedY = 0.9;

let bounceSquareFlash = 0;
let bounceSquareText = "Bouncing synth ready";
let bounceSquareCurrentSynthType = "sine";


// --------------------------------------------------
// P5 PRELOAD
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
// P5 SETUP
// --------------------------------------------------

function setup() {
  createCanvas(windowWidth, windowHeight);

  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  angleMode(RADIANS);

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

  if (typeof setupSynthFFTInputs === "function") {
    setupSynthFFTInputs();
  }

  if (typeof setupWholeFFTInputs === "function") {
    setupWholeFFTInputs();
  } else {
    console.log("setupWholeFFTInputs() not found. Check wholeFFT.js loads before testvis.js");
  }

  if (typeof setupVocalPitchInputs === "function") {
    setupVocalPitchInputs();
  }

  // IMPORTANT:
  // This calls your separate synth backend file.
  // Your synth file must contain setupSynth().
  if (typeof setupSynth === "function") {
    setupSynth();
  } else {
    console.log("setupSynth() not found. Check that synth.js loads before testvis.js");
  }

  bounceSquareX = width / 2;
  bounceSquareY = height / 2;
}


// --------------------------------------------------
// MAIN DRAW LOOP
// --------------------------------------------------

function draw() {
  background(bgValue);

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
  }

  bgValue = lerp(bgValue, bgTarget, 0.18);
  bgTarget = lerp(bgTarget, 15, 0.1);

  shakeAmount *= 0.82;

  push();

  translate(
    random(-shakeAmount, shakeAmount),
    random(-shakeAmount, shakeAmount)
  );

  drawWholeFFTVisual();

  drawSynthOuterVisual();
  drawVocalPitchVisual();

  updateBouncingSynthSquare();
  drawBouncingSynthSquare();

  drawCentreGuide();
  drawVisualHits();

  pop();

  drawInterface();
}


// --------------------------------------------------
// CHECK MIDI HITS FROM EXISTING INSTRUMENTS
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
// CLICK TO PLAY OR PAUSE EVERYTHING
// --------------------------------------------------

function mousePressed() {
  userStartAudio();

  if (musicIsPlaying) {
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
  } else {
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
}


// --------------------------------------------------
// BOUNCING SQUARE MOVEMENT
// This calls your separate synth backend.
// --------------------------------------------------

function updateBouncingSynthSquare() {
  bounceSquareX += bounceSquareSpeedX;
  bounceSquareY += bounceSquareSpeedY;


  // -----------------------------
  // LEFT WALL = SINE
  // -----------------------------

  if (bounceSquareX - bounceSquareSize / 2 <= 0) {
    bounceSquareX = bounceSquareSize / 2;
    bounceSquareSpeedX *= -1;

    triggerBouncingSynth(0, "Left wall: sine", "sine");
  }


  // -----------------------------
  // RIGHT WALL = SINE
  // -----------------------------

  if (bounceSquareX + bounceSquareSize / 2 >= width) {
    bounceSquareX = width - bounceSquareSize / 2;
    bounceSquareSpeedX *= -1;

    triggerBouncingSynth(0, "Right wall: sine", "sine");
  }


  // -----------------------------
  // TOP WALL = SINE
  // -----------------------------

  if (bounceSquareY - bounceSquareSize / 2 <= 0) {
    bounceSquareY = bounceSquareSize / 2;
    bounceSquareSpeedY *= -1;

    triggerBouncingSynth(0, "Top wall: sine", "sine");
  }


  // -----------------------------
  // BOTTOM WALL = SINE
  // -----------------------------

  if (bounceSquareY + bounceSquareSize / 2 >= height) {
    bounceSquareY = height - bounceSquareSize / 2;
    bounceSquareSpeedY *= -1;

    triggerBouncingSynth(0, "Bottom wall: sine", "sine");
  }

  bounceSquareFlash *= 0.88;
}


// --------------------------------------------------
// TRIGGER SEPARATE SYNTH BACKEND
// --------------------------------------------------

function triggerBouncingSynth(typeIndex, displayText, fallbackTypeName) {
  if (typeof setSynthType === "function") {
    setSynthType(typeIndex);
  } else {
    console.log("setSynthType() not found. Check synth.js is loaded.");
  }

  if (typeof playSynthNote === "function") {
    playSynthNote();
  } else {
    console.log("playSynthNote() not found. Check synth.js is loaded.");
  }

  if (typeof getCurrentSynthType === "function") {
    bounceSquareCurrentSynthType = getCurrentSynthType();
  } else {
    bounceSquareCurrentSynthType = fallbackTypeName;
  }

  bounceSquareText = displayText;
  bounceSquareFlash = 80;
  bgTarget = max(bgTarget, 55);
}


// --------------------------------------------------
// DRAW BOUNCING SQUARE
// --------------------------------------------------

function drawBouncingSynthSquare() {
  push();

  translate(bounceSquareX, bounceSquareY);

  noStroke();

  fill(80, 240, 255, 210);
  rect(0, 0, bounceSquareSize, bounceSquareSize);

  noFill();
  stroke(255, 180 + bounceSquareFlash);
  strokeWeight(3);
  rect(
    0,
    0,
    bounceSquareSize + 12 + bounceSquareFlash * 0.2,
    bounceSquareSize + 12 + bounceSquareFlash * 0.2
  );

  pop();
}


// --------------------------------------------------
// WHOLE FFT VISUAL
// Reacts to the full music output
// --------------------------------------------------

function drawWholeFFTVisual() {
  if (
    typeof wholeSpectrum === "undefined" ||
    typeof wholeBassEnergy === "undefined" ||
    typeof wholeHighEnergy === "undefined"
  ) {
    return;
  }

  let centreX = width / 2;
  let centreY = height / 2;

  let bassPulse = map(wholeBassEnergy, 0, 255, 0, 130, true);
  let subPulse = map(wholeSubBassEnergy, 0, 255, 0, 90, true);
  let lowMidPulse = map(wholeLowMidEnergy, 0, 255, 0, 80, true);
  let midPulse = map(wholeMidEnergy, 0, 255, 0, 65, true);
  let presencePulse = map(wholePresenceEnergy, 0, 255, 0, 70, true);
  let highPulse = map(wholeHighEnergy, 0, 255, 0, 100, true);

  let centroidAmount = map(
    constrain(wholeCentroidFreq, 200, 6000),
    200,
    6000,
    0,
    1
  );

  wholeFFTRotation += 0.003 + centroidAmount * 0.012;

  push();

  translate(centreX, centreY);


  // -----------------------------
  // BIG SOFT BREATHING AURA
  // -----------------------------

  noStroke();

  fill(40, 90, 180, 18 + bassPulse * 0.25);
  ellipse(0, 0, 360 + bassPulse * 2.4, 360 + bassPulse * 2.4);

  fill(120, 70, 210, 14 + midPulse * 0.2);
  ellipse(0, 0, 270 + midPulse * 2.2, 270 + midPulse * 2.2);

  fill(220, 80, 200, 10 + highPulse * 0.18);
  ellipse(0, 0, 190 + highPulse * 2.0, 190 + highPulse * 2.0);


  // -----------------------------
  // SUB/BASS OUTER RINGS
  // -----------------------------

  noFill();

  stroke(70, 145, 255, 80 + bassPulse);
  strokeWeight(3 + subPulse * 0.05);
  ellipse(0, 0, 290 + bassPulse, 290 + bassPulse);

  stroke(120, 200, 255, 55 + subPulse);
  strokeWeight(2);
  ellipse(0, 0, 230 + subPulse, 230 + subPulse);


  // -----------------------------
  // MID ROTATING DIAMOND
  // -----------------------------

  push();

  rotate(wholeFFTRotation);

  stroke(255, 210, 80, 65 + midPulse);
  strokeWeight(2);
  rect(0, 0, 150 + lowMidPulse * 1.4, 150 + lowMidPulse * 1.4);

  stroke(255, 120, 190, 45 + presencePulse);
  strokeWeight(1.5);
  rect(0, 0, 95 + presencePulse * 1.6, 95 + presencePulse * 1.6);

  pop();


  // -----------------------------
  // WHOLE SPECTRUM SPIKY RING
  // -----------------------------

  if (wholeSpectrum && wholeSpectrum.length > 0) {
    noFill();

    let redValue = map(centroidAmount, 0, 1, 80, 255);
    let blueValue = map(centroidAmount, 0, 1, 255, 120);

    stroke(redValue, 190, blueValue, 160);
    strokeWeight(2);

    beginShape();

    let usableBins = min(wholeSpectrum.length, 512);
    let step = max(1, floor(usableBins / 150));

    for (let i = 0; i < usableBins; i += step) {
      let angle = map(i, 0, usableBins, 0, TWO_PI);

      let amp = wholeSpectrum[i];

      let baseRadius = 185;
      let extraRadius = map(amp, 0, 255, 0, 150);

      let radius = baseRadius + extraRadius + bassPulse * 0.2;

      let x = cos(angle + wholeFFTRotation * 0.4) * radius;
      let y = sin(angle + wholeFFTRotation * 0.4) * radius;

      curveVertex(x, y);
    }

    endShape(CLOSE);
  }


  // -----------------------------
  // HIGH FREQUENCY SPARKLES
  // -----------------------------

  let sparkleCount = floor(map(wholeHighEnergy, 0, 255, 0, 16, true));

  noStroke();

  for (let i = 0; i < sparkleCount; i++) {
    let angle = random(TWO_PI);
    let radius = random(190, 300 + highPulse);

    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    fill(255, random(80, 220));
    ellipse(x, y, random(2, 6), random(2, 6));
  }


  // -----------------------------
  // CENTRE CORE
  // -----------------------------

  let coreSize = 35 + midPulse * 0.4 + highPulse * 0.25;

  fill(255, 210);
  ellipse(0, 0, coreSize, coreSize);

  fill(80, 180, 255, 120);
  ellipse(0, 0, coreSize * 1.8, coreSize * 1.8);

  pop();
}


// --------------------------------------------------
// KEY CONTROLS
// --------------------------------------------------

function keyPressed() {

  // -----------------------------
  // BASS: 1 2 3 4 / 5 OFF
  // -----------------------------

  if (key === "1" && typeof switchBassTrack === "function") {
    switchBassTrack(0);
    bassDisplay = "Bass 1";
  }

  if (key === "2" && typeof switchBassTrack === "function") {
    switchBassTrack(1);
    bassDisplay = "Bass 2";
  }

  if (key === "3" && typeof switchBassTrack === "function") {
    switchBassTrack(2);
    bassDisplay = "Bass 3";
  }

  if (key === "4" && typeof switchBassTrack === "function") {
    switchBassTrack(3);
    bassDisplay = "Bass 4";
  }

  if (key === "5" && typeof muteBass === "function") {
    muteBass();
    bassDisplay = "Bass Off";
  }


  // -----------------------------
  // DRUMS: Q W E R / T OFF
  // -----------------------------

  if ((key === "q" || key === "Q") && typeof switchDrumTrack === "function") {
    switchDrumTrack(0);
    drumDisplay = "Drums 1";
  }

  if ((key === "w" || key === "W") && typeof switchDrumTrack === "function") {
    switchDrumTrack(1);
    drumDisplay = "Drums 2";
  }

  if ((key === "e" || key === "E") && typeof switchDrumTrack === "function") {
    switchDrumTrack(2);
    drumDisplay = "Drums 3";
  }

  if ((key === "r" || key === "R") && typeof switchDrumTrack === "function") {
    switchDrumTrack(3);
    drumDisplay = "Drums 4";
  }

  if ((key === "t" || key === "T") && typeof muteDrum === "function") {
    muteDrum();
    drumDisplay = "Drums Off";
  }


  // -----------------------------
  // GUITAR: A ON / S OFF
  // -----------------------------

  if ((key === "a" || key === "A") && typeof unmuteGuitar === "function") {
    unmuteGuitar();
    guitarDisplay = "Guitar On";
  }

  if ((key === "s" || key === "S") && typeof muteGuitar === "function") {
    muteGuitar();
    guitarDisplay = "Guitar Off";
  }


  // -----------------------------
  // STRINGS: Z X C V / B OFF
  // -----------------------------

  if ((key === "z" || key === "Z") && typeof switchStringsTrack === "function") {
    switchStringsTrack(0);
    stringsDisplay = "Strings 1";
  }

  if ((key === "x" || key === "X") && typeof switchStringsTrack === "function") {
    switchStringsTrack(1);
    stringsDisplay = "Strings 2";
  }

  if ((key === "c" || key === "C") && typeof switchStringsTrack === "function") {
    switchStringsTrack(2);
    stringsDisplay = "Strings 3";
  }

  if ((key === "v" || key === "V") && typeof switchStringsTrack === "function") {
    switchStringsTrack(3);
    stringsDisplay = "Strings 4";
  }

  if ((key === "b" || key === "B") && typeof muteStrings === "function") {
    muteStrings();
    stringsDisplay = "Strings Off";
  }


  // -----------------------------
  // VOCALS: U I O ON / J K L OFF / P ALL
  // -----------------------------

  if ((key === "u" || key === "U") && typeof unmuteVocal === "function") {
    userStartAudio();
    unmuteVocal(0);
  }

  if ((key === "i" || key === "I") && typeof unmuteVocal === "function") {
    userStartAudio();
    unmuteVocal(1);
  }

  if ((key === "o" || key === "O") && typeof unmuteVocal === "function") {
    userStartAudio();
    unmuteVocal(2);
  }

  if ((key === "j" || key === "J") && typeof muteVocal === "function") {
    muteVocal(0);
  }

  if ((key === "k" || key === "K") && typeof muteVocal === "function") {
    muteVocal(1);
  }

  if ((key === "l" || key === "L") && typeof muteVocal === "function") {
    muteVocal(2);
  }

  if ((key === "p" || key === "P") && typeof toggleAllVocals === "function") {
    userStartAudio();
    toggleAllVocals();
  }


  // -----------------------------
  // MANUAL SYNTH TEST
  // Press M to check your separate synth backend directly.
  // -----------------------------

  if (key === "m" || key === "M") {
    if (typeof playSynthNote === "function") {
      playSynthNote();
    } else {
      console.log("playSynthNote() not found. Check synth.js is loaded before testvis.js.");
    }
  }
}


// --------------------------------------------------
// SYNTH FFT OUTER VISUAL
// --------------------------------------------------

function drawSynthOuterVisual() {
  if (
    typeof synth1Spectrum === "undefined" ||
    typeof synth2Spectrum === "undefined"
  ) {
    return;
  }

  if (
    typeof synth1CentroidFreq === "undefined" ||
    typeof synth2CentroidFreq === "undefined"
  ) {
    return;
  }

  let centreX = width / 2;
  let centreY = height / 2;

  let availableRadius = min(width, height) * 0.34;

  let synth1Energy =
    typeof synth1MidEnergy !== "undefined"
      ? synth1MidEnergy + synth1HighEnergy
      : 0;

  let synth2Energy =
    typeof synth2LowMidEnergy !== "undefined"
      ? synth2LowMidEnergy + synth2PresenceEnergy
      : 0;

  let synth1Pulse = map(synth1Energy, 0, 510, 0, 42, true);
  let synth2Pulse = map(synth2Energy, 0, 510, 0, 38, true);

  let synth1Radius = availableRadius + synth1Pulse;
  let synth2Radius = availableRadius - 48 + synth2Pulse;

  let synth1Speed = map(
    constrain(synth1CentroidFreq, 0, 8000),
    0,
    8000,
    0.001,
    0.012
  );

  let synth2Speed = map(
    constrain(synth2CentroidFreq, 0, 8000),
    0,
    8000,
    0.001,
    0.014
  );

  if (musicIsPlaying) {
    synth1RingRotation += synth1Speed;
    synth2RingRotation -= synth2Speed;
  }

  noFill();

  stroke(80, 220, 255, 24 + synth1Pulse * 1.4);
  strokeWeight(12);
  ellipse(centreX, centreY, synth1Radius * 2, synth1Radius * 2);

  stroke(255, 90, 220, 20 + synth2Pulse * 1.4);
  strokeWeight(10);
  ellipse(centreX, centreY, synth2Radius * 2, synth2Radius * 2);

  drawSpectrumRing(
    synth1Spectrum,
    centreX,
    centreY,
    synth1Radius,
    42,
    synth1RingRotation,
    80,
    220,
    255
  );

  drawSpectrumRing(
    synth2Spectrum,
    centreX,
    centreY,
    synth2Radius,
    35,
    synth2RingRotation,
    255,
    90,
    220
  );
}


// --------------------------------------------------
// DRAW ONE FFT SPECTRUM AS A CIRCULAR RING
// --------------------------------------------------

function drawSpectrumRing(
  spectrum,
  centreX,
  centreY,
  baseRadius,
  movementAmount,
  rotationAmount,
  red,
  green,
  blue
) {
  if (!spectrum || spectrum.length === 0) {
    return;
  }

  push();

  translate(centreX, centreY);
  rotate(rotationAmount);

  noFill();
  stroke(red, green, blue, 200);
  strokeWeight(2);

  beginShape();

  let usableBins = min(spectrum.length, 512);
  let step = max(1, floor(usableBins / 90));

  for (let i = 0; i < usableBins; i += step) {
    let angle = map(i, 0, usableBins, 0, TWO_PI);

    let amplitude = spectrum[i];
    let extraRadius = map(amplitude, 0, 255, 0, movementAmount);

    let radius = baseRadius + extraRadius;

    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    curveVertex(x, y);
  }

  endShape(CLOSE);

  pop();
}


// --------------------------------------------------
// VOCAL PITCH VISUAL
//
// OFF vocals show nothing.
// ON vocals show grey "listening" orb until pitch is detected.
// Detected pitch becomes coloured by closest note.
// --------------------------------------------------

function drawVocalPitchVisual() {
  if (
    typeof vocalFreq === "undefined" ||
    typeof vocalNoteName === "undefined" ||
    typeof vocalMuted === "undefined"
  ) {
    return;
  }

  let centreX = width / 2;
  let centreY = height / 2;

  drawSingleVocalPitchVisual(0, centreX, centreY, min(width, height) * 0.18);
  drawSingleVocalPitchVisual(1, centreX, centreY, min(width, height) * 0.24);
  drawSingleVocalPitchVisual(2, centreX, centreY, min(width, height) * 0.30);
}


function drawSingleVocalPitchVisual(index, centreX, centreY, orbitRadius) {
  if (vocalMuted[index]) {
    return;
  }

  let freq = vocalFreq[index];
  let noteName = vocalNoteName[index];

  let angle =
    frameCount * (0.012 + index * 0.004) + index * TWO_PI / 3;

  let x = centreX + cos(angle) * orbitRadius;
  let y = centreY + sin(angle) * orbitRadius;

  if (freq <= 0 || noteName === "-") {
    let waitingSize = 34 + sin(frameCount * 0.08 + index) * 6;

    noStroke();

    fill(180, 180, 180, 35);
    ellipse(x, y, waitingSize * 2.4, waitingSize * 2.4);

    fill(180, 180, 180, 90);
    ellipse(x, y, waitingSize * 1.5, waitingSize * 1.5);

    fill(230, 230, 230, 190);
    ellipse(x, y, waitingSize, waitingSize);

    noFill();
    stroke(230, 230, 230, 150);
    strokeWeight(2);
    ellipse(x, y, waitingSize * 1.25, waitingSize * 1.25);

    noStroke();
    fill(255, 220);
    textSize(13);
    text("V" + (index + 1) + " listening", x, y + 52);

    return;
  }

  let colour = getVocalNoteColour(noteName);

  let pitchSize = map(constrain(freq, 80, 1200), 80, 1200, 24, 95);
  let pulse = sin(frameCount * 0.08 + freq * 0.01) * 12;

  noStroke();

  fill(colour[0], colour[1], colour[2], 35);
  ellipse(x, y, pitchSize * 2.5 + pulse, pitchSize * 2.5 + pulse);

  fill(colour[0], colour[1], colour[2], 85);
  ellipse(x, y, pitchSize * 1.7 + pulse, pitchSize * 1.7 + pulse);

  fill(colour[0], colour[1], colour[2], 230);
  ellipse(x, y, pitchSize + pulse, pitchSize + pulse);

  noFill();
  stroke(colour[0], colour[1], colour[2], 190);
  strokeWeight(2);
  ellipse(x, y, pitchSize * 1.25 + pulse, pitchSize * 1.25 + pulse);

  noStroke();
  fill(255, 230);
  textSize(13);
  text(
    "V" + (index + 1) + " " + noteName + " " + freq.toFixed(0) + "Hz",
    x,
    y + pitchSize + 22
  );
}


function getVocalNoteColour(noteName) {
  if (noteName === "C") return [255, 70, 90];
  if (noteName === "C#") return [255, 120, 70];
  if (noteName === "D") return [255, 190, 70];
  if (noteName === "D#") return [220, 255, 80];
  if (noteName === "E") return [120, 255, 100];
  if (noteName === "F") return [80, 255, 180];
  if (noteName === "F#") return [80, 240, 255];
  if (noteName === "G") return [80, 170, 255];
  if (noteName === "G#") return [100, 100, 255];
  if (noteName === "A") return [150, 90, 255];
  if (noteName === "A#") return [220, 90, 255];
  if (noteName === "B") return [255, 80, 180];

  return [100, 100, 100];
}


// --------------------------------------------------
// BASS VISUAL
// --------------------------------------------------

function createBassVisual(note) {
  visualHits.push({
    type: "bass",
    size: map(note.velocity, 0, 1, 160, 420),
    life: 48,
    maxLife: 48
  });

  bgTarget = max(bgTarget, 25 + note.velocity * 55);
}


// --------------------------------------------------
// DRUM VISUAL
// --------------------------------------------------

function createDrumVisual(note) {
  visualHits.push({
    type: "drum",
    x: random(width * 0.15, width * 0.85),
    y: random(height * 0.15, height * 0.8),
    size: map(note.velocity, 0, 1, 45, 170),
    life: 32,
    maxLife: 32,
    rotation: random(TWO_PI)
  });

  shakeAmount = max(shakeAmount, 2 + note.velocity * 10);
  bgTarget = max(bgTarget, 24 + note.velocity * 45);
}


// --------------------------------------------------
// GUITAR VISUAL
// --------------------------------------------------

function createGuitarVisual(note) {
  visualHits.push({
    type: "guitar",
    x: width / 2,
    y: height / 2,
    size: map(note.velocity, 0, 1, 90, 280),
    life: 68,
    maxLife: 68,
    rotation: random(TWO_PI)
  });

  bgTarget = max(bgTarget, 22 + note.velocity * 28);
}


// --------------------------------------------------
// STRINGS VISUAL
// --------------------------------------------------

function createStringsVisual(note) {
  visualHits.push({
    type: "strings",
    size: map(note.velocity, 0, 1, 180, 500),
    life: 105,
    maxLife: 105
  });

  bgTarget = max(bgTarget, 20 + note.velocity * 24);
}


// --------------------------------------------------
// DRAW CENTRE GUIDE
// --------------------------------------------------

function drawCentreGuide() {
  noFill();
  stroke(255, 28);
  strokeWeight(1);

  ellipse(width / 2, height / 2, 120, 120);
}


// --------------------------------------------------
// DRAW ALL ACTIVE VISUAL REACTIONS
// --------------------------------------------------

function drawVisualHits() {
  for (let i = visualHits.length - 1; i >= 0; i--) {
    let hit = visualHits[i];

    let alpha = map(hit.life, 0, hit.maxLife, 0, 230);
    let progress = map(hit.life, hit.maxLife, 0, 0, 1);
    let s = hit.size * (1 + progress * 1.45);

    push();

    if (hit.type === "bass") {
      translate(width / 2, height / 2);

      noStroke();

      fill(70, 145, 255, alpha * 0.2);
      ellipse(0, 0, s * 1.7, s * 1.7);

      fill(70, 145, 255, alpha * 0.38);
      ellipse(0, 0, s * 1.3, s * 1.3);

      fill(70, 145, 255, alpha);
      ellipse(0, 0, s, s);
    }

    if (hit.type === "drum") {
      translate(hit.x, hit.y);
      rotate(hit.rotation + frameCount * 0.025);

      noFill();
      stroke(255, 105, 75, alpha);
      strokeWeight(4);

      rect(0, 0, s, s);
      line(-s * 0.8, 0, s * 0.8, 0);
      line(0, -s * 0.8, 0, s * 0.8);
    }

    if (hit.type === "guitar") {
      translate(hit.x, hit.y);
      rotate(PI / 4 + hit.rotation + frameCount * 0.018);

      noFill();
      stroke(255, 210, 80, alpha);
      strokeWeight(3);

      rect(0, 0, s, s);
      rect(0, 0, s * 0.65, s * 0.65);
    }

    if (hit.type === "strings") {
      translate(width / 2, height / 2);

      noFill();
      stroke(190, 110, 255, alpha);
      strokeWeight(2);

      ellipse(0, 0, s, s);
      ellipse(0, 0, s * 0.78, s * 0.78);
      ellipse(0, 0, s * 0.56, s * 0.56);
    }

    pop();

    hit.life--;

    if (hit.life <= 0) {
      visualHits.splice(i, 1);
    }
  }
}


// --------------------------------------------------
// DRAW STATUS AND CONTROLS
// --------------------------------------------------

function drawInterface() {
  noStroke();
  fill(255);

  textSize(22);

  if (musicIsPlaying) {
    text("PLAYING", width / 2, 38);
  } else {
    text("CLICK TO PLAY", width / 2, 38);
  }

  textSize(16);

  text(
    "BASS       [1] [2] [3] [4] [5 Off]      " + bassDisplay,
    width / 2,
    height - 204
  );

  text(
    "DRUMS      [Q] [W] [E] [R] [T Off]      " + drumDisplay,
    width / 2,
    height - 176
  );

  text(
    "GUITAR     [A On] [S Off]                " + guitarDisplay,
    width / 2,
    height - 148
  );

  text(
    "STRINGS    [Z] [X] [C] [V] [B Off]      " + stringsDisplay,
    width / 2,
    height - 120
  );

  let vocal1Status = "V1 Off";
  let vocal2Status = "V2 Off";
  let vocal3Status = "V3 Off";

  if (typeof vocalMuted !== "undefined") {
    vocal1Status = vocalMuted[0] ? "V1 Off" : "V1 On";
    vocal2Status = vocalMuted[1] ? "V2 Off" : "V2 On";
    vocal3Status = vocalMuted[2] ? "V3 Off" : "V3 On";
  }

  text(
    "VOCALS     [U I O On] [J K L Off] [P All]      " +
      vocal1Status +
      " / " +
      vocal2Status +
      " / " +
      vocal3Status,
    width / 2,
    height - 92
  );

  text(
    "BOUNCE SYNTH    " +
      bounceSquareText +
      "      Current: " +
      bounceSquareCurrentSynthType +
      " / F#4",
    width / 2,
    height - 64
  );
}


// --------------------------------------------------
// RESPONSIVE CANVAS
// --------------------------------------------------

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  bounceSquareX = constrain(
    bounceSquareX,
    bounceSquareSize / 2,
    width - bounceSquareSize / 2
  );

  bounceSquareY = constrain(
    bounceSquareY,
    bounceSquareSize / 2,
    height - bounceSquareSize / 2
  );
}