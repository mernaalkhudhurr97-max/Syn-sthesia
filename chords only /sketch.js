let song;
let fft;

let smoothing = 0.8;
let bins = 512;

let waveform = [];
let spectrum = [];

// ----------------------------
// Music theory information
// ----------------------------

let notesInMusic = [
  "C", "C#", "D", "D#", "E", "F",
  "F#", "G", "G#", "A", "A#", "B"
];

let chordInfo = {
  major: [0, 4, 7],
  major7: [0, 4, 7, 11],
  major9: [0, 4, 7, 11, 14],

  minor: [0, 3, 7],
  minor7: [0, 3, 7, 10],
  minor9: [0, 3, 7, 10, 14],

  dom7: [0, 4, 7, 10],
  dom9: [0, 4, 7, 10, 14],

  diminished: [0, 3, 6],
  diminished7: [0, 3, 6, 9],

  augmented: [0, 4, 8],

  suspended2: [0, 2, 7],
  suspended4: [0, 5, 7]
};

// These values update every frame
let noteEnergy = {};
let chordType = "unknown";
let chordRoot = "unknown";
let chordName = "unknown";

// ----------------------------
// Load song
// ----------------------------

function preload() {
  song = loadSound("assets/songforcode.wav");
}

// ----------------------------
// Setup
// ----------------------------

function setup() {
  createCanvas(400, 400);

  fft = new p5.FFT(smoothing, bins);
  fft.setInput(song);

  textSize(14);
}

// ----------------------------
// Main draw loop
// ----------------------------

function draw() {
  background(220);

  // Analyse the song every frame
  spectrum = fft.analyze();
  waveform = fft.waveform();

  // Use FFT to estimate note/chord information
  updateNoteEnergy();
  detectChordFromFFT();

  // Show detected information
  fill(0);
  noStroke();
  text("Chord: " + chordName, 20, 25);
  text("Root: " + chordRoot, 20, 45);
  text("Type: " + chordType, 20, 65);
  text("Click to play / pause", 20, 385);

  // Draw visual depending on detected chord type
  if (chordType === "major") {
    drawmajorVisual();
  } else if (chordType === "major7") {
    drawmajor7Visual();
  } else if (chordType === "major9") {
    drawmajor9Visual();
  } else if (chordType === "minor") {
    drawminorVisual();
  } else if (chordType === "minor7") {
    drawminor7Visual();
  } else if (chordType === "minor9") {
    drawminor9Visual();
  } else if (chordType === "dom7") {
    drawdom7Visual();
  } else if (chordType === "dom9") {
    drawdom9Visual();
  } else if (chordType === "diminished") {
    drawdiminishedVisual();
  } else if (chordType === "diminished7") {
    drawdiminished7Visual();
  } else if (chordType === "augmented") {
    drawaugmentedVisual();
  } else if (chordType === "suspended2") {
    drawsuspended2Visual();
  } else if (chordType === "suspended4") {
    drawsuspended4Visual();
  } else {
    drawunknownVisual();
  }
}

// ----------------------------
// Play / pause song
// ----------------------------

function mousePressed() {
  userStartAudio();

  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

// ----------------------------
// FFT note identification
// ----------------------------

function updateNoteEnergy() {
  // Reset note energy every frame
  for (let note of notesInMusic) {
    noteEnergy[note] = 0;
  }

  // Check note frequencies across several octaves
  // A4 = 440 Hz
  // -33 is around C2
  // +26 is around B5
  for (let semitoneFromA4 = -33; semitoneFromA4 <= 26; semitoneFromA4++) {
    let freq = 440 * Math.pow(2, semitoneFromA4 / 12);

    let noteName = frequencyToNoteName(freq);

    // Check a small frequency area around the note
    let lowFreq = freq * 0.985;
    let highFreq = freq * 1.015;

    let energy = fft.getEnergy(lowFreq, highFreq);

    // Add all octaves of the same note together
    noteEnergy[noteName] += energy;
  }
}

function frequencyToNoteName(freq) {
  let semitoneFromA4 = Math.round(12 * Math.log2(freq / 440));

  let noteNamesFromA = [
    "A", "A#", "B", "C", "C#", "D",
    "D#", "E", "F", "F#", "G", "G#"
  ];

  let noteIndex = ((semitoneFromA4 % 12) + 12) % 12;

  return noteNamesFromA[noteIndex];
}

// ----------------------------
// Chord detection from FFT note energy
// ----------------------------

function detectChordFromFFT() {
  let bestScore = -999999;
  let bestRoot = "unknown";
  let bestType = "unknown";

  // Try every root note
  for (let rootIndex = 0; rootIndex < notesInMusic.length; rootIndex++) {
    let rootNote = notesInMusic[rootIndex];

    // Try every chord type
    for (let type in chordInfo) {
      let formula = chordInfo[type];
      let score = 0;
      let chordNotes = [];

      // Build chord notes from the interval formula
      for (let interval of formula) {
        let noteIndex = (rootIndex + interval) % 12;
        let noteName = notesInMusic[noteIndex];

        chordNotes.push(noteName);

        // Reward notes that belong to the chord
        score += noteEnergy[noteName];
      }

      // Pick the chord with the strongest matching note energy
      if (score > bestScore) {
        bestScore = score;
        bestRoot = rootNote;
        bestType = type;
      }
    }
  }

  chordRoot = bestRoot;
  chordType = bestType;
  chordName = chordRoot + " " + chordType;
}

// ----------------------------
// Visual functions
// You can replace these with cooler group visuals later
// ----------------------------

function drawmajorVisual() {
  noStroke();
  fill(80, 220, 120, 180); // green
  ellipse(width / 2, height / 2, 150, 150);
}

function drawmajor7Visual() {
  noFill();
  stroke(80, 220, 120);
  strokeWeight(3);
  ellipse(width / 2, height / 2, 120, 120);
  ellipse(width / 2, height / 2, 180, 180);
}

function drawmajor9Visual() {
  noFill();
  stroke(100, 255, 150);
  strokeWeight(2);

  for (let i = 0; i < 5; i++) {
    ellipse(width / 2, height / 2, 80 + i * 35, 80 + i * 35);
  }
}

function drawminorVisual() {
  noStroke();
  fill(80, 120, 255, 180); // blue
  ellipse(width / 2, height / 2, 150, 150);
}

function drawminor7Visual() {
  noFill();
  stroke(80, 120, 255);
  strokeWeight(3);

  beginShape();
  for (let x = 0; x < width; x += 15) {
    let y = height / 2 + sin(x * 0.04 + frameCount * 0.05) * 50;
    vertex(x, y);
  }
  endShape();
}

function drawminor9Visual() {
  noFill();
  stroke(120, 80, 255);
  strokeWeight(3);

  beginShape();
  for (let a = 0; a < TWO_PI * 3; a += 0.1) {
    let r = 80 + sin(a * 4 + frameCount * 0.04) * 30;
    let x = width / 2 + cos(a) * r;
    let y = height / 2 + sin(a) * r;
    vertex(x, y);
  }
  endShape();
}

function drawdom7Visual() {
  push();
  translate(width / 2, height / 2);
  rotate(frameCount * 0.03);

  noFill();
  stroke(255, 140, 40);
  strokeWeight(4);
  rectMode(CENTER);
  rect(0, 0, 140, 140);

  pop();
}

function drawdom9Visual() {
  push();
  translate(width / 2, height / 2);
  rotate(frameCount * 0.04);

  noFill();
  stroke(255, 100, 40);
  strokeWeight(3);
  rectMode(CENTER);

  for (let i = 0; i < 4; i++) {
    rotate(TWO_PI / 4);
    rect(0, 0, 170, 70);
  }

  pop();
}

function drawdiminishedVisual() {
  stroke(0);
  strokeWeight(2);

  for (let i = 0; i < 20; i++) {
    line(random(width), random(height), random(width), random(height));
  }
}

function drawdiminished7Visual() {
  noFill();
  stroke(0);
  strokeWeight(2);

  for (let i = 0; i < 8; i++) {
    rect(random(width), random(height), random(20, 80), random(20, 80));
  }
}

function drawaugmentedVisual() {
  push();
  translate(width / 2, height / 2);
  rotate(frameCount * 0.02);

  noStroke();
  fill(255, 80, 200, 160);
  triangle(-80, 70, 80, 70, 0, -90);

  fill(255, 180, 80, 120);
  triangle(-100, -70, 100, -70, 0, 100);

  pop();
}

function drawsuspended2Visual() {
  noFill();
  stroke(0, 180, 255);
  strokeWeight(4);

  line(width / 2 - 120, height / 2, width / 2 + 120, height / 2);
  ellipse(width / 2, height / 2, 80, 80);
}

function drawsuspended4Visual() {
  noFill();
  stroke(0, 220, 180);
  strokeWeight(4);

  line(width / 2, height / 2 - 120, width / 2, height / 2 + 120);
  ellipse(width / 2, height / 2, 80, 80);
}

function drawunknownVisual() {
  noStroke();
  fill(120);
  ellipse(width / 2, height / 2, 80, 80);
}