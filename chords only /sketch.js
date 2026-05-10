let song;
let fft;

let smoothing = 0.8;
let bins = 4096;

let detectedNotes = [];
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

  detectTwoStrongestNotes();
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

function detectTwoStrongestNotes() {
  let noteResults = [];

  // Check musical note range from about C2 to C6
  for (let freq = 65; freq <= 1046; freq += 2) {
    let energy = fft.getEnergy(freq - 1, freq + 1);

    if (energy > 20) {
      let noteName = frequencyToNoteName(freq);

      noteResults.push({
        note: noteName,
        frequency: freq,
        energy: energy
      });
    }
  }

  // Sort from strongest energy to weakest energy
  noteResults.sort(function(a, b) {
    return b.energy - a.energy;
  });

  // Remove duplicates of the same note name
  let uniqueNotes = [];

  for (let i = 0; i < noteResults.length; i++) {
    let current = noteResults[i];

    let alreadyExists = false;

    for (let j = 0; j < uniqueNotes.length; j++) {
      if (uniqueNotes[j].note === current.note) {
        alreadyExists = true;
      }
    }

    if (!alreadyExists) {
      uniqueNotes.push(current);
    }

    if (uniqueNotes.length === 2) {
      break;
    }
  }

  detectedNotes = uniqueNotes;

  if (detectedNotes.length > 0) {
    detectedEnergy = detectedNotes[0].energy;
  } else {
    detectedEnergy = 0;
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
  noStroke();

  if (detectedNotes.length === 0) {
    fill(120, 160);
    ellipse(width / 2, height / 2, 100, 100);
    return;
  }

  // First note visual
  let firstNote = detectedNotes[0].note;
  fillForNote(firstNote);

  let size1 = map(detectedNotes[0].energy, 0, 255, 80, 220, true);
  ellipse(width / 2 - 50, height / 2, size1, size1);

  // Second note visual
  if (detectedNotes.length > 1) {
    let secondNote = detectedNotes[1].note;
    fillForNote(secondNote);

    let size2 = map(detectedNotes[1].energy, 0, 255, 60, 180, true);
    ellipse(width / 2 + 50, height / 2, size2, size2);
  }
}

function fillForNote(note) {
  if (note.startsWith("C")) {
    fill(255, 80, 80, 160);
  } else if (note.startsWith("D")) {
    fill(255, 160, 80, 160);
  } else if (note.startsWith("E")) {
    fill(255, 230, 80, 160);
  } else if (note.startsWith("F")) {
    fill(100, 255, 100, 160);
  } else if (note.startsWith("G")) {
    fill(80, 180, 255, 160);
  } else if (note.startsWith("A")) {
    fill(120, 100, 255, 160);
  } else if (note.startsWith("B")) {
    fill(220, 100, 255, 160);
  } else {
    fill(120, 160);
  }
}

function drawTextInfo() {
  fill(0);
  noStroke();

  textSize(20);
  text("Detected notes:", width / 2, 70);

  textSize(42);

  if (detectedNotes.length === 0) {
    text("unknown", width / 2, 130);
  } else if (detectedNotes.length === 1) {
    text(detectedNotes[0].note, width / 2, 130);
  } else {
    text(detectedNotes[0].note + " + " + detectedNotes[1].note, width / 2, 130);
  }

  textSize(14);

  if (detectedNotes.length > 0) {
    text(
      "1: " + detectedNotes[0].frequency.toFixed(2) + " Hz | Energy: " + detectedNotes[0].energy.toFixed(2),
      width / 2,
      230
    );
  }

  if (detectedNotes.length > 1) {
    text(
      "2: " + detectedNotes[1].frequency.toFixed(2) + " Hz | Energy: " + detectedNotes[1].energy.toFixed(2),
      width / 2,
      250
    );
  }

  if (song.isPlaying()) {
    text("Playing - click to pause", width / 2, 360);
  } else {
    text("Paused - click to play", width / 2, 360);
  }
}