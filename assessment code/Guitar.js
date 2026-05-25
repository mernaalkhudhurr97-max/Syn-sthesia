let GuitarSounds = [];
let allMidiNotes = [];
let midiData;

function preload() {
  // Load WAV audio files
  GuitarSounds[0] = loadSound("assets/Guitar Guitar 1.wav");
  GuitarSounds[1] = loadSound("assets/Guitar Guitar 2.wav");
  GuitarSounds[2] = loadSound("assets/Guitar Guitar 3.wav");
  GuitarSounds[3] = loadSound("assets/Guitar Guitar 4.wav");
}

// idk what happened but the tempo wasnt being set in the midi files so i just hardcoded it here, it should be 160 bpm for all of them
let bpm = 160;
let secondsPerBeat = 60 / bpm; 

function setup() {
  createCanvas(800, 600);

  // Load MIDI files
  loadMidiFile("assets/Guitar Guitar 1.mid");
  loadMidiFile("assets/Guitar Guitar 2.mid");
  loadMidiFile("assets/Guitar Guitar 3.mid");
  loadMidiFile("assets/Guitar Guitar 4.mid");
}


// idk if this is going to work 
let guitarNotes = {
  C1: "off",
  Cs1: "off",
  D1: "off",
  Ds1: "off",
  E1: "off",
  F1: "off",
  Fs1: "off",
  G1: "off",
  Gs1: "off",
  A1: "off",
  As1: "off",
  B1: "off",

  C2: "off",
  Cs2: "off",
  D2: "off",
  Ds2: "off",
  E2: "off",
  F2: "off",
  Fs2: "off",
  G2: "off",
  Gs2: "off",
  A2: "off",
  As2: "off",
  B2: "off",

  C3: "off"
};

// MIDI note number to output name
let bassMap = {
  36: "C1",
  37: "Cs1",
  38: "D1",
  39: "Ds1",
  40: "E1",
  41: "F1",
  42: "Fs1",
  43: "G1",
  44: "Gs1",
  45: "A1",
  46: "As1",
  47: "B1",

  48: "C2",
  49: "Cs2",
  50: "D2",
  51: "Ds2",
  52: "E2",
  53: "F2",
  54: "Fs2",
  55: "G2",
  56: "Gs2",
  57: "A2",
  58: "As2",
  59: "B2",

  60: "C3"
};