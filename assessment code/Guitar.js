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
  // Octave 4
  C4: "off",
  Cs4: "off",
  D4: "off",
  Ds4: "off",
  E4: "off",
  F4: "off",
  Fs4: "off",
  G4: "off",
  Gs4: "off",
  A4: "off",
  As4: "off",
  B4: "off",

  // Octave 5
  C5: "off",
  Cs5: "off",
  D5: "off",
  Ds5: "off",
  E5: "off",
  F5: "off",
  Fs5: "off",
  G5: "off",
  Gs5: "off",
  A5: "off",
  As5: "off",
  B5: "off",

  // Final note
  C6: "off"
};

// MIDI note number to guitar note name
let guitarMap = {
  // Octave 4
  60: "C4",
  61: "Cs4",
  62: "D4",
  63: "Ds4",
  64: "E4",
  65: "F4",
  66: "Fs4",
  67: "G4",
  68: "Gs4",
  69: "A4",
  70: "As4",
  71: "B4",

  // Octave 5
  72: "C5",
  73: "Cs5",
  74: "D5",
  75: "Ds5",
  76: "E5",
  77: "F5",
  78: "Fs5",
  79: "G5",
  80: "Gs5",
  81: "A5",
  82: "As5",
  83: "B5",

  // Final note
  84: "C6"
};