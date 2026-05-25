// --------------------------------------------------
// FULL MUSIC VISUAL TEST
//
// CONTROLS:
// Bass    = 1 2 3 4 / 5 off
// Drums   = Q W E R / T off
// Guitar  = A on / S off
// Strings = Z X C V / B off
// Mouse   = play / pause all available instruments
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


// --------------------------------------------------
// P5 PRELOAD
// Loads only instruments whose functions currently exist.
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
}


// --------------------------------------------------
// MAIN DRAW LOOP
// --------------------------------------------------

function draw() {
  background(bgValue);

  if (musicIsPlaying) {
    checkAllMusicHits();
  }

  bgValue = lerp(bgValue, bgTarget, 0.18);
  bgTarget = lerp(bgTarget, 15, 0.1);

  shakeAmount *= 0.82;

  push();

  translate(
    random(-shakeAmount, shakeAmount),
    random(-shakeAmount, shakeAmount)
  );

  drawCentreGuide();
  drawVisualHits();

  pop();

  drawInterface();
}


// --------------------------------------------------
// CHECK MIDI HITS FROM ALL AVAILABLE INSTRUMENTS
// --------------------------------------------------

function checkAllMusicHits() {
  // Bass
  if (typeof getActiveBassHits === "function") {
    let bassHits = getActiveBassHits();

    for (let note of bassHits) {
      createBassVisual(note);
    }
  }

  // Drums
  if (typeof getActiveDrumHits === "function") {
    let drumHits = getActiveDrumHits();

    for (let note of drumHits) {
      createDrumVisual(note);
    }
  }

  // Guitar
  if (typeof getGuitarHits === "function") {
    let guitarHits = getGuitarHits();

    for (let note of guitarHits) {
      createGuitarVisual(note);
    }
  }

  // Strings
  if (typeof getActiveStringsHits === "function") {
    let stringsHits = getActiveStringsHits();

    for (let note of stringsHits) {
      createStringsVisual(note);
    }
  }
}


// --------------------------------------------------
// CLICK TO PLAY OR PAUSE ALL AVAILABLE INSTRUMENTS
// --------------------------------------------------

function mousePressed() {
  userStartAudio();

  if (musicIsPlaying) {
    if (typeof pauseBass === "function") {
      pauseBass();
    }

    if (typeof pauseDrums === "function") {
      pauseDrums();
    }

    if (typeof pauseGuitar === "function") {
      pauseGuitar();
    }

    if (typeof pauseStrings === "function") {
      pauseStrings();
    }

    musicIsPlaying = false;
  } else {
    if (typeof playBass === "function") {
      playBass();
    }

    if (typeof playDrums === "function") {
      playDrums();
    }

    if (typeof playGuitar === "function") {
      playGuitar();
    }

    if (typeof playStrings === "function") {
      playStrings();
    }

    musicIsPlaying = true;
  }
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

  if ((key === "t" || key === "T") && typeof muteDrums === "function") {
    muteDrums();
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
}


// --------------------------------------------------
// BASS VISUAL
// Large central circular pulse
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
// Sharp impact squares and screen shake
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
// Rotating diamond shape
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
// Slow soft expanding rings
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

    // -----------------------------
    // BASS: BLUE CENTRAL PULSE
    // -----------------------------

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


    // -----------------------------
    // DRUMS: RED IMPACT SHAPE
    // -----------------------------

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


    // -----------------------------
    // GUITAR: YELLOW DIAMOND
    // -----------------------------

    if (hit.type === "guitar") {
      translate(hit.x, hit.y);
      rotate(PI / 4 + hit.rotation + frameCount * 0.018);

      noFill();
      stroke(255, 210, 80, alpha);
      strokeWeight(3);

      rect(0, 0, s, s);
      rect(0, 0, s * 0.65, s * 0.65);
    }


    // -----------------------------
    // STRINGS: PURPLE RINGS
    // -----------------------------

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
    height - 120
  );

  text(
    "DRUMS      [Q] [W] [E] [R] [T Off]      " + drumDisplay,
    width / 2,
    height - 92
  );

  text(
    "GUITAR     [A On] [S Off]                " + guitarDisplay,
    width / 2,
    height - 64
  );

  text(
    "STRINGS    [Z] [X] [C] [V] [B Off]      " + stringsDisplay,
    width / 2,
    height - 36
  );
}


// --------------------------------------------------
// RESPONSIVE CANVAS
// --------------------------------------------------

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}