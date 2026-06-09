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

let instrumentCircles = [];
let instrumentEnergy = {
  bass: 0,
  drums: 0,
  guitar: 0,
  strings: 0,
  vocal1: 0,
  vocal2: 0,
  vocal3: 0,
};

let instrumentReverbs = {
  bass: [],
  drums: [],
  strings: [],
  guitar: null,
  vocals: [],
};

let audioReverbsCreated = false;


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

  if (typeof setupVocalPitchInputs === "function") {
    setupVocalPitchInputs();
  }

  setupInstrumentCircles();
  createInstrumentReverbs();
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
  }

  bgValue = lerp(bgValue, bgTarget, 0.18);
  bgTarget = lerp(bgTarget, 15, 0.1);

  shakeAmount *= 0.82;

  push();

  translate(
    random(-shakeAmount, shakeAmount),
    random(-shakeAmount, shakeAmount)
  );

  drawSynthOuterVisual();
  drawInstrumentCircles();

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

let activeCircleIndex = null;
let dragStartPoint = { x: 0, y: 0 };
let circleDragThreshold = 6;

function mousePressed() {
  userStartAudio();

  activeCircleIndex = getInstrumentCircleUnderMouse();
  dragStartPoint = { x: mouseX, y: mouseY };

  if (activeCircleIndex !== null) {
    if (!musicIsPlaying) {
      playAllInstrumentAudio();
      musicIsPlaying = true;
    }
    return;
  }

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

function mouseDragged() {
  if (activeCircleIndex === null) {
    return;
  }

  if (dist(mouseX, mouseY, dragStartPoint.x, dragStartPoint.y) < circleDragThreshold) {
    return;
  }

  let circle = instrumentCircles[activeCircleIndex];
  circle.x = constrain(mouseX, circle.maxRadius, width - circle.maxRadius);
  circle.y = constrain(mouseY, circle.maxRadius, height - circle.maxRadius);

  updateInstrumentAudio(circle);
}

function mouseReleased() {
  if (activeCircleIndex !== null) {
    let clickedDistance = dist(mouseX, mouseY, dragStartPoint.x, dragStartPoint.y);
    if (clickedDistance < circleDragThreshold) {
      let circle = instrumentCircles[activeCircleIndex];
      toggleInstrument(circle);
    }
  }

  activeCircleIndex = null;
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

  instrumentEnergy.bass = max(instrumentEnergy.bass, note.velocity);
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

  instrumentEnergy.drums = max(instrumentEnergy.drums, note.velocity);
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

  instrumentEnergy.guitar = max(instrumentEnergy.guitar, note.velocity);
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

  instrumentEnergy.strings = max(instrumentEnergy.strings, note.velocity);
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
    height - 176
  );

  text(
    "DRUMS      [Q] [W] [E] [R] [T Off]      " + drumDisplay,
    width / 2,
    height - 148
  );

  text(
    "GUITAR     [A On] [S Off]                " + guitarDisplay,
    width / 2,
    height - 120
  );

  text(
    "STRINGS    [Z] [X] [C] [V] [B Off]      " + stringsDisplay,
    width / 2,
    height - 92
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
    height - 64
  );
}


// --------------------------------------------------
// RESPONSIVE CANVAS
// --------------------------------------------------

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setupInstrumentCircles();
}

function setupInstrumentCircles() {
  instrumentCircles = [
    {
      key: "bass",
      label: "Bass",
      x: width * 0.18,
      y: height * 0.25,
      baseColor: [70, 145, 255],
      offColor: [25, 55, 90],
      trackCount: 4,
      maxRadius: 70,
      minRadius: 36,
      activeTrack: typeof activeBassTrack !== "undefined" ? activeBassTrack : 0,
      displayRadius: 70,
      pan: 0,
      reverb: 0,
    },
    {
      key: "drums",
      label: "Drums",
      x: width * 0.38,
      y: height * 0.16,
      baseColor: [255, 100, 80],
      offColor: [90, 28, 25],
      trackCount: 4,
      maxRadius: 70,
      minRadius: 36,
      activeTrack: typeof activeDrumTrack !== "undefined" ? activeDrumTrack : 0,
    },
    {
      key: "guitar",
      label: "Guitar",
      x: width * 0.68,
      y: height * 0.18,
      baseColor: [255, 210, 80],
      offColor: [80, 65, 20],
      trackCount: 1,
      maxRadius: 70,
      minRadius: 36,
      activeTrack: 0,
    },
    {
      key: "strings",
      label: "Strings",
      x: width * 0.82,
      y: height * 0.42,
      baseColor: [180, 110, 255],
      offColor: [45, 25, 70],
      trackCount: 4,
      maxRadius: 70,
      minRadius: 36,
      activeTrack: typeof activeStringsTrack !== "undefined" ? activeStringsTrack : 0,
    },
    {
      key: "vocal1",
      label: "Vocal 1",
      x: width * 0.18,
      y: height * 0.72,
      baseColor: [255, 130, 190],
      offColor: [90, 45, 70],
      trackCount: 1,
      maxRadius: 60,
      minRadius: 32,
      activeTrack: 0,
    },
    {
      key: "vocal2",
      label: "Vocal 2",
      x: width * 0.5,
      y: height * 0.86,
      baseColor: [255, 180, 160],
      offColor: [100, 70, 45],
      trackCount: 1,
      maxRadius: 60,
      minRadius: 32,
      activeTrack: 0,
    },
    {
      key: "vocal3",
      label: "Vocal 3",
      x: width * 0.82,
      y: height * 0.72,
      baseColor: [220, 190, 255],
      offColor: [80, 55, 95],
      trackCount: 1,
      maxRadius: 60,
      minRadius: 32,
      activeTrack: 0,
      displayRadius: 60,
      pan: 0,
      reverb: 0,
    },
  ];

  instrumentCircles.forEach((circle) => {
    circle.displayRadius = circle.maxRadius;
    circle.pan = map(circle.x, 0, width, -1, 1);
    circle.reverb = 0;
  });
}

function createInstrumentReverbs() {
  if (audioReverbsCreated) {
    return;
  }

  if (typeof bassSongs !== "undefined") {
    bassSongs.forEach((song, i) => {
      let rev = new p5.Reverb();
      if (song && typeof rev.process === "function") {
        rev.process(song, 3, 2);
      }
      instrumentReverbs.bass[i] = rev;
    });
  }

  if (typeof drumSongs !== "undefined") {
    drumSongs.forEach((song, i) => {
      let rev = new p5.Reverb();
      if (song && typeof rev.process === "function") {
        rev.process(song, 3, 2);
      }
      instrumentReverbs.drums[i] = rev;
    });
  }

  if (typeof stringsSongs !== "undefined") {
    stringsSongs.forEach((song, i) => {
      let rev = new p5.Reverb();
      if (song && typeof rev.process === "function") {
        rev.process(song, 3, 2);
      }
      instrumentReverbs.strings[i] = rev;
    });
  }

  if (typeof guitarSongs !== "undefined") {
    let rev = new p5.Reverb();
    if (guitarSongs && typeof rev.process === "function") {
      rev.process(guitarSongs, 3, 2);
    }
    instrumentReverbs.guitar = rev;
  }

  if (typeof vocalSounds !== "undefined") {
    vocalSounds.forEach((sound, i) => {
      let rev = new p5.Reverb();
      if (sound && typeof rev.process === "function") {
        rev.process(sound, 3, 2);
      }
      instrumentReverbs.vocals[i] = rev;
    });
  }

  audioReverbsCreated = true;
}

function drawInstrumentCircles() {
  updateVocalEnergies();

  instrumentCircles.forEach((circle, index) => {
    updateInstrumentCircle(circle);

    let energy = instrumentEnergy[circle.key] || 0;
    let pulse = sin(frameCount * 0.08 + index) * 8 * energy;
    let alpha = isInstrumentMuted(circle) ? 130 : 220;
    let colour = isInstrumentMuted(circle) ? circle.offColor : circle.baseColor;

    noStroke();
    fill(colour[0], colour[1], colour[2], alpha);
    ellipse(circle.x, circle.y, (circle.displayRadius + pulse) * 2);

    fill(255);
    textSize(14);
    text(circle.label, circle.x, circle.y - circle.displayRadius - 12);

    fill(230);
    textSize(12);
    text(getCircleSubtitle(circle), circle.x, circle.y + circle.displayRadius + 14);
  });
}

function updateInstrumentCircle(circle) {
  if (circle.key === "bass" && typeof activeBassTrack !== "undefined") {
    circle.activeTrack = activeBassTrack;
  }
  if (circle.key === "drums" && typeof activeDrumTrack !== "undefined") {
    circle.activeTrack = activeDrumTrack;
  }
  if (circle.key === "strings" && typeof activeStringsTrack !== "undefined") {
    circle.activeTrack = activeStringsTrack;
  }

  let distanceFromCenter = dist(circle.x, circle.y, width / 2, height / 2);
  let normalizedDistance = constrain(distanceFromCenter / (min(width, height) * 0.5), 0, 1);
  circle.displayRadius = lerp(circle.maxRadius, circle.minRadius, normalizedDistance);
  circle.pan = constrain(map(circle.x, 0, width, -1, 1), -1, 1);
  circle.reverb = normalizedDistance;

  if (circle.trackCount === 4) {
    let newTrack = getEdgeTrackIndex(circle);
    if (newTrack !== null && newTrack !== circle.activeTrack) {
      circle.activeTrack = newTrack;
      switchInstrumentTrack(circle);
    }
  }

  updateInstrumentAudio(circle);
}

function updateVocalEnergies() {
  if (typeof vocalMuted === "undefined") {
    return;
  }

  for (let i = 0; i < 3; i++) {
    let key = `vocal${i + 1}`;
    if (!vocalMuted[i]) {
      let energy = 0.2;
      if (typeof vocalFreq !== "undefined" && vocalFreq[i] > 0) {
        energy = map(constrain(vocalFreq[i], 80, 1200), 80, 1200, 0.2, 1, true);
      }
      instrumentEnergy[key] = max(instrumentEnergy[key] * 0.92, energy);
    } else {
      instrumentEnergy[key] *= 0.92;
    }
  }
}

function updateInstrumentAudio(circle) {
  let panValue = circle.pan;
  let wetValue = circle.reverb;

  if (circle.key === "bass" && typeof bassSongs !== "undefined") {
    bassSongs.forEach((song, i) => {
      if (song && typeof song.pan === "function") {
        song.pan(panValue);
      }
      if (instrumentReverbs.bass[i]) {
        instrumentReverbs.bass[i].drywet(wetValue);
      }
    });
  }

  if (circle.key === "drums" && typeof drumSongs !== "undefined") {
    drumSongs.forEach((song, i) => {
      if (song && typeof song.pan === "function") {
        song.pan(panValue);
      }
      if (instrumentReverbs.drums[i]) {
        instrumentReverbs.drums[i].drywet(wetValue);
      }
    });
  }

  if (circle.key === "strings" && typeof stringsSongs !== "undefined") {
    stringsSongs.forEach((song, i) => {
      if (song && typeof song.pan === "function") {
        song.pan(panValue);
      }
      if (instrumentReverbs.strings[i]) {
        instrumentReverbs.strings[i].drywet(wetValue);
      }
    });
  }

  if (circle.key === "guitar" && typeof guitarSongs !== "undefined") {
    if (guitarSongs && typeof guitarSongs.pan === "function") {
      guitarSongs.pan(panValue);
    }
    if (instrumentReverbs.guitar) {
      instrumentReverbs.guitar.drywet(wetValue);
    }
  }

  if (circle.key.startsWith("vocal") && typeof vocalSounds !== "undefined") {
    let vocalIndex = Number(circle.key.replace("vocal", "")) - 1;
    let sound = vocalSounds[vocalIndex];
    if (sound && typeof sound.pan === "function") {
      sound.pan(panValue);
    }
    if (instrumentReverbs.vocals[vocalIndex]) {
      instrumentReverbs.vocals[vocalIndex].drywet(wetValue);
    }
  }
}

function getEdgeTrackIndex(circle) {
  if (circle.x + circle.displayRadius >= width) {
    return 0;
  }
  if (circle.y - circle.displayRadius <= 0) {
    return 1;
  }
  if (circle.x - circle.displayRadius <= 0) {
    return 2;
  }
  if (circle.y + circle.displayRadius >= height) {
    return 3;
  }
  return null;
}

function switchInstrumentTrack(circle) {
  if (circle.key === "bass" && typeof switchBassTrack === "function") {
    switchBassTrack(circle.activeTrack);
    bassDisplay = `Bass ${circle.activeTrack + 1}`;
  }
  if (circle.key === "drums" && typeof switchDrumTrack === "function") {
    switchDrumTrack(circle.activeTrack);
    drumDisplay = `Drums ${circle.activeTrack + 1}`;
  }
  if (circle.key === "strings" && typeof switchStringsTrack === "function") {
    switchStringsTrack(circle.activeTrack);
    stringsDisplay = `Strings ${circle.activeTrack + 1}`;
  }
}

function getCircleSubtitle(circle) {
  let status = isInstrumentMuted(circle) ? "Off" : "On";
  if (circle.trackCount === 4) {
    return `${status} · ${circle.activeTrack + 1}`;
  }
  return status;
}

function isInstrumentMuted(circle) {
  if (circle.key === "bass") {
    return typeof bassMuted !== "undefined" ? bassMuted : false;
  }
  if (circle.key === "drums") {
    return typeof drumMuted !== "undefined" ? drumMuted : false;
  }
  if (circle.key === "strings") {
    return typeof stringsMuted !== "undefined" ? stringsMuted : false;
  }
  if (circle.key === "guitar") {
    return typeof guitarMuted !== "undefined" ? guitarMuted : false;
  }
  if (circle.key.startsWith("vocal")) {
    let idx = Number(circle.key.replace("vocal", "")) - 1;
    return typeof vocalMuted !== "undefined" ? vocalMuted[idx] : true;
  }
  return false;
}

function toggleInstrument(circle) {
  if (circle.key === "bass") {
    if (typeof bassMuted !== "undefined" && bassMuted) {
      if (typeof switchBassTrack === "function") {
        switchBassTrack(circle.activeTrack);
      }
    } else if (typeof muteBass === "function") {
      muteBass();
    }
    return;
  }
  if (circle.key === "drums") {
    if (typeof drumMuted !== "undefined" && drumMuted) {
      if (typeof switchDrumTrack === "function") {
        switchDrumTrack(circle.activeTrack);
      }
    } else if (typeof muteDrum === "function") {
      muteDrum();
    }
    return;
  }
  if (circle.key === "strings") {
    if (typeof stringsMuted !== "undefined" && stringsMuted) {
      if (typeof switchStringsTrack === "function") {
        switchStringsTrack(circle.activeTrack);
      }
    } else if (typeof muteStrings === "function") {
      muteStrings();
    }
    return;
  }
  if (circle.key === "guitar") {
    if (typeof guitarMuted !== "undefined" && guitarMuted) {
      if (typeof unmuteGuitar === "function") {
        unmuteGuitar();
      }
    } else if (typeof muteGuitar === "function") {
      muteGuitar();
    }
    return;
  }
  if (circle.key.startsWith("vocal")) {
    let idx = Number(circle.key.replace("vocal", "")) - 1;
    if (typeof vocalMuted !== "undefined" && vocalMuted[idx]) {
      if (typeof unmuteVocal === "function") {
        unmuteVocal(idx);
      }
    } else if (typeof muteVocal === "function") {
      muteVocal(idx);
    }
    return;
  }
}

function getInstrumentCircleUnderMouse() {
  for (let i = instrumentCircles.length - 1; i >= 0; i--) {
    let circle = instrumentCircles[i];
    if (dist(mouseX, mouseY, circle.x, circle.y) <= circle.displayRadius) {
      return i;
    }
  }
  return null;
}

function playAllInstrumentAudio() {
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
}
