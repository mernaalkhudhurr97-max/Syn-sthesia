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