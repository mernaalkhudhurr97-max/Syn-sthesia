let BassSounds = [];
let allMidiNotes = [];
let midiData;

function preload() {
  // Load WAV audio files
  BassSounds[0] = loadSound("assets/BassWav/Bass 1.wav");
  BassSounds[1] = loadSound("assets/BassWav/Bass 2.wav");
  BassSounds[2] = loadSound("assets/BassWav/Bass 3.wav");
  BassSounds[3] = loadSound("assets/BassWav/Bass 4.wav");
}

// idk what happened but the tempo wasnt being set in the midi files so i just hardcoded it here, it should be 160 bpm for all of them
let bpm = 160;
let secondsPerBeat = 60 / bpm; 

function setup() {
  createCanvas(800, 600);

  // Load MIDI files
  loadMidiFile("assets/BassMidi/Bass 1.mid");
  loadMidiFile("assets/BassMidi/Bass 2.mid");
  loadMidiFile("assets/BassMidi/Bass 3.mid");
  loadMidiFile("assets/BassMidi/Bass 4.mid");
}