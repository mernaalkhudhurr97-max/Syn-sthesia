let song;
let fft;

let smoothing = 0.8;
let bins = 4096;

let detectedNote = "unknown";
let detectedFreq = 0;
let detectedEnergy = 0;

function preload() {
  song = loadSound("assets/songforcode.wav");
}

function setup() {
  createCanvas(400, 400);

  fft = new p5.FFT(smoothing, bins);
  fft.setInput(song);

  textAlign(CENTER, CENTER);
}

function draw() {
  background(220);

  fft.analyze();

  detectStrongestNote();
  drawNoteVisual();
  drawTextInfo();
}

function mousePressed() {
  userStartAudio();

  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function detectStrongestNote() {
  let strongestEnergy = 0;
  let strongestFreq = 0;

  // Check musical note range from about C2 to C6
  for (let freq = 65; freq <= 1046; freq += 2) {
    let energy = fft.getEnergy(freq - 1, freq + 1);

    if (energy > strongestEnergy) {
      strongestEnergy = energy;
      strongestFreq = freq;
    }
  }

  detectedFreq = strongestFreq;
  detectedEnergy = strongestEnergy;

  if (strongestEnergy < 20) {
    detectedNote = "unknown";
  } else {
    detectedNote = frequencyToNoteName(strongestFreq);
  }
}

function frequencyToNoteName(freq) {
  let semitoneFromA4 = Math.round(12 * Math.log2(freq / 440));

  let noteNamesFromA = [
    "A", "A#", "B", "C", "C#", "D",
    "D#", "E", "F", "F#", "G", "G#"
  ];

  let noteIndex = ((semitoneFromA4 % 12) + 12) % 12;
  let noteName = noteNamesFromA[noteIndex];

  let midiLikeNumber = semitoneFromA4 + 69;
  let octave = Math.floor(midiLikeNumber / 12) - 1;

  return noteName + octave;
}

function drawNoteVisual() {
  if (detectedNote.startsWith("C")) {
    fill(255, 80, 80, 160); // red
  } else if (detectedNote.startsWith("D")) {
    fill(255, 160, 80, 160); // orange
  } else if (detectedNote.startsWith("E")) {
    fill(255, 230, 80, 160); // yellow
  } else if (detectedNote.startsWith("F")) {
    fill(100, 255, 100, 160); // green
  } else if (detectedNote.startsWith("G")) {
    fill(80, 180, 255, 160); // blue
  } else if (detectedNote.startsWith("A")) {
    fill(120, 100, 255, 160); // purple-blue
  } else if (detectedNote.startsWith("B")) {
    fill(220, 100, 255, 160); // purple
  } else {
    fill(120, 160); // grey
  }

  noStroke();

  let circleSize = map(detectedEnergy, 0, 255, 80, 220, true);
  ellipse(width / 2, height / 2, circleSize, circleSize);
}

function drawTextInfo() {
  fill(0);
  noStroke();

  textSize(20);
  text("Detected note:", width / 2, 90);

  textSize(52);
  text(detectedNote, width / 2, 150);

  textSize(16);
  text("Frequency: " + detectedFreq.toFixed(2) + " Hz", width / 2, 210);
  text("Energy: " + detectedEnergy.toFixed(2), width / 2, 235);

  if (song.isPlaying()) {
    text("Playing - click to pause", width / 2, 360);
  } else {
    text("Paused - click to play", width / 2, 360);
  }
}