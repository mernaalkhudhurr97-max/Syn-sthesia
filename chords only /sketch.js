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

  minor: [0, 3, 7],

  dom7: [0, 4, 7, 10],
  

  diminished: [0, 3, 6],
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

  } else if (chordType === "minor") {
    drawminorVisual();
    
  } else if (chordType === "dom7") {
    drawdom7Visual();

  } else if (chordType === "diminished") {
    drawdiminishedVisual();

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

  let totalEnergy = 0;
  for (let note of notesInMusic) {
    totalEnergy += noteEnergy[note];
  }

  // If there is barely any musical energy, do not guess a chord
  if (totalEnergy < 80) {
    chordRoot = "unknown";
    chordType = "unknown";
    chordName = "unknown";
    return;
  }

  for (let rootIndex = 0; rootIndex < notesInMusic.length; rootIndex++) {
    let rootNote = notesInMusic[rootIndex];

    for (let type in chordInfo) {
      let formula = chordInfo[type];
      let score = 0;
      let chordNotes = [];

      for (let interval of formula) {
        let noteIndex = (rootIndex + interval) % 12;
        let noteName = notesInMusic[noteIndex];

        chordNotes.push(noteName);
        score += noteEnergy[noteName];
      }

      // IMPORTANT:
      // Divide by number of notes so 9th chords do not always beat triads
      score = score / formula.length;

      // Give the root note a small bonus
      score += noteEnergy[rootNote] * 0.25;

      // Penalise notes outside the chord
      for (let note of notesInMusic) {
        if (!chordNotes.includes(note)) {
          score -= noteEnergy[note] * 0.08;
        }
      }

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

function drawminorVisual() {
  noStroke();
  fill(80, 120, 255, 180); // blue
  ellipse(width / 2, height / 2, 150, 150);
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


function drawdiminishedVisual() {
  stroke(0);
  strokeWeight(2);

  for (let i = 0; i < 20; i++) {
    line(random(width), random(height), random(width), random(height));
  }
}


function drawunknownVisual() {
  noStroke();
  fill(120);
  ellipse(width / 2, height / 2, 80, 80);
}