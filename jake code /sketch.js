let song;
let fft;

let smoothing = 0.8;
let bins = 512;

let waveform = [];
let spectrum = [];

let musicData = {
  kickdrum: 0,
  snaredrum: 0,
  hihat: 0,
  crash: 0,
  volume: 0,
  energyLevel: "low"
};

function preload() {
  song = loadSound("assets/songforcode.wav");
}

function setup() {
  createCanvas(400, 400);

  fft = new p5.FFT(smoothing, bins);
  fft.setInput(song);

  textSize(12);
}

function draw() {
  background(220);

  // Analyse the song every frame
  spectrum = fft.analyze();
  waveform = fft.waveform();

  // Update all music values
  updateMusicData();

  // Different sounds trigger different visuals
  drawKickVisual();
  drawSnareVisual();
  drawHihatVisual();
  drawCrashVisual();

  // Optional: draw waveform on top
  drawWaveform();
 
}

// --------------------------------------------------
// AUDIO ANALYSIS
// --------------------------------------------------

function updateMusicData() {
  // These are approximate frequency ranges
  musicData.kickdrum = fft.getEnergy(20, 100);
  musicData.snaredrum = fft.getEnergy(150, 2500);
  musicData.hihat = fft.getEnergy(4000, 9000);
  musicData.crash = fft.getEnergy(6000, 14000);

  musicData.volume = (
    musicData.kickdrum +
    musicData.snaredrum +
    musicData.hihat +
    musicData.crash
  ) / 4;

  if (musicData.volume > 170) {
    musicData.energyLevel = "high";
  } else if (musicData.volume > 100) {
    musicData.energyLevel = "medium";
  } else {
    musicData.energyLevel = "low";
  }
}

// --------------------------------------------------
// VISUAL 1: KICK DRUM
// Big pulsing circle
// --------------------------------------------------

function drawKickVisual() {
  let kickvol = musicData.kickdrum;

  let size = map(kickvol, 0, 255, 20, 260);

  noStroke();

  if (kickvol > 150) {
    fill(255, 80, 0, 180); // strong kick = orange red
  } else if (kickvol > 100) {
    fill(255, 180, 0, 130); // medium kick = yellow orange
  } else {
    fill(80, 80, 80, 80); // weak kick = grey
  }

  ellipse(width / 2, height / 2, size, size);
}

// --------------------------------------------------
// VISUAL 2: SNARE DRUM
// Sharp burst lines
// --------------------------------------------------

function drawSnareVisual() {
  let snarevol = musicData.snaredrum;

  if (snarevol > 120) {
    stroke(255);
    strokeWeight(2);

    let burstLength = map(snarevol, 0, 255, 20, 180);

    for (let i = 0; i < 16; i++) {
      let angle = TWO_PI * i / 16;

      let x1 = width / 2;
      let y1 = height / 2;

      let x2 = width / 2 + cos(angle) * burstLength;
      let y2 = height / 2 + sin(angle) * burstLength;

      line(x1, y1, x2, y2);
    }
  }
}

// --------------------------------------------------
// VISUAL 3: HI-HAT
// Small fast moving dots
// --------------------------------------------------

function drawHihatVisual() {
  let hihatvol = musicData.hihat;

  noStroke();

  if (hihatvol > 140) {
    fill(0, 255, 255, 180); // strong hi-hat = cyan
  } else if (hihatvol > 90) {
    fill(173, 216, 230, 130); // medium hi-hat = light blue
  } else {
    fill(120, 120, 120, 80); // weak hi-hat = grey
  }

  let dotSize = map(hihatvol, 0, 255, 2, 18);

  for (let i = 0; i < 20; i++) {
    let x = i * 22;
    let y = 50 + sin(frameCount * 0.2 + i) * 20;

    ellipse(x, y, dotSize, dotSize);
  }
}

// --------------------------------------------------
// VISUAL 4: CRASH CYMBAL
// Full-screen flash
// --------------------------------------------------

function drawCrashVisual() {
  let crashvol = musicData.crash;

  if (crashvol > 170) {
    noStroke();
    fill(255, 0, 255, 80); // magenta flash
    rect(0, 0, width, height);
  }
}

// --------------------------------------------------
// OPTIONAL: WAVEFORM
// Draws the audio wave across the screen
// --------------------------------------------------

function drawWaveform() {
  noFill();
  stroke(0);
  strokeWeight(1);

  beginShape();

  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, height * 0.25, height * 0.75);

    vertex(x, y);
  }

  endShape();
}




function mousePressed() {
  userStartAudio();

  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}