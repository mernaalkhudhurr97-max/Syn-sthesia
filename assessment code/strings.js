




let StringsSounds = [];
let allMidiNotes = [];
let midiData;

function preload() {
  // Load WAV audio files
  StringsSounds[0] = loadSound("assets/StringsWav/String 1.wav");
  StringsSounds[1] = loadSound("assets/StringsWav/String 2.wav");
  StringsSounds[2] = loadSound("assets/StringsWav/String 3.wav");
  StringsSounds[3] = loadSound("assets/StringsWav/String 4.wav");
}

// idk what happened but the tempo wasnt being set in the midi files so i just hardcoded it here, it should be 160 bpm for all of them
let bpm = 160;
let secondsPerBeat = 60 / bpm; 

function setup() {
  createCanvas(800, 600);

  // Load MIDI files
  loadMidiFile("assets/StringsMidi/String 1.mid");
  loadMidiFile("assets/StringsMidi/String 2.mid");
  loadMidiFile("assets/StringsMidi/String 3.mid");
  loadMidiFile("assets/StringsMidi/String 4.mid");
}

