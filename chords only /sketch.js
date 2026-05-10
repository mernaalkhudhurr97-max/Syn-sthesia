
let song;
let fft;

let smoothing = 0.8;
let bins = 512;

let waveform = [];
let spectrum = [];


function preload() {
  song = loadSound("assets/songforcode.wav");
}

function setup() {
  createCanvas(400, 400);

  fft = new p5.FFT(smoothing, bins);
  fft.setInput(song);

  textSize(12);
}


function frequencyToNoteWithOctave(freq) {
  let semitoneFromA4 = Math.round(12 * Math.log2(freq / 440));

  let noteNamesFromA = [
    "A", "A#", "B", "C", "C#", "D",
    "D#", "E", "F", "F#", "G", "G#"
  ];

  let noteIndex = ((semitoneFromA4 % 12) + 12) % 12;
  let noteName = noteNamesFromA[noteIndex];

  // A4 is our reference point.
  // This formula converts the semitone offset into octave number.
  let midiLikeNumber = semitoneFromA4 + 69;
  let octave = Math.floor(midiLikeNumber / 12) - 1;

  return noteName + octave;
}

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


function draw() {
  background(220);

  // Analyse the song every frame
  spectrum = fft.analyze();
  waveform = fft.waveform();

  // Update all music values
  updateMusicData();

  // Different sounds trigger different visuals
  drawmajorVisual();
  drawminorVisual();
  drawdom7Visual();
  drawdiminishedVisual();
 
}