/// drum output variables

let drumSounds = [];
let allMidiNotes = [];
let midiData;

function preload() {
  // Load WAV audio files
  drumSounds[0] = loadSound("assets/DrumWav/Drum 1.wav");
  drumSounds[1] = loadSound("assets/DrumWav/Drum 2.wav");
  drumSounds[2] = loadSound("assets/DrumWav/Drum 3.wav");
  drumSounds[3] = loadSound("assets/DrumWav/Drum 4.wav");
}

// idk what happened but the tempo wasnt being set in the midi files so i just hardcoded it here, it should be 160 bpm for all of them
let bpm = 160;
let secondsPerBeat = 60 / bpm; 

function setup() {
  createCanvas(800, 600);

  // Load MIDI files
  loadMidiFile("assets/DrumMidi/Drum 1.mid");
  loadMidiFile("assets/DrumMidi/Drum 2.mid");
  loadMidiFile("assets/DrumMidi/Drum 3.mid");
  loadMidiFile("assets/DrumMidi/Drum 4.mid");
}

// Drum output parameters
let bassKick = "off";
let rimshot = "off";
let snareDrum = "off";
let handclap = "off";
let congaLow = "off";
let timbale = "off";
let closedHihat = "off";
let congaHigh = "off";
let tomLow = "off";
let tomMid = "off";
let openHihat = "off";
let tomHigh = "off";
let cowbellLow = "off";
let crashCymbal = "off";
let cowbellHigh = "off";
let rideCymbal = "off";

// MIDI note number to output name
let drumMap = {
  36: "bassKick",
  37: "rimshot",
  38: "snareDrum",
  39: "handclap",
  40: "congaLow",
  41: "timbale",
  42: "closedHihat",
  43: "congaHigh",
  44: "tomLow",
  45: "tomMid",
  46: "openHihat",
  47: "tomHigh",
  48: "cowbellLow",
  49: "crashCymbal",
  50: "cowbellHigh",
  51: "rideCymbal"
};

// Loads a MIDI file and extracts drum notes.
function loadMidiFile(path) {
  fetch(path)
    .then(function(response) {
      return response.arrayBuffer();
    })
    .then(function(arrayBuffer) {
      midiData = new Midi(arrayBuffer);

      for (let track of midiData.tracks) {
        for (let note of track.notes) {
          if (note.midi >= 36 && note.midi <= 51) {
            allMidiNotes.push({
              midi: note.midi,
              time: note.time,
              velocity: note.velocity,
              triggered: false
            });
          }
        }
      }

      console.log("MIDI loaded:", path, allMidiNotes);
    });
}

function updateMusicOutputs(currentTime) {
  resetDrumOutputs();

  for (let note of allMidiNotes) {
    if (!note.triggered && currentTime >= note.time) {
      note.triggered = true;

      let outputName = drumMap[note.midi];
      let level = getVelocityLevel(note.velocity);

      setDrumOutput(outputName, level);
    }
  }
}

function resetDrumOutputs() {
  bassKick = "off";
  rimshot = "off";
  snareDrum = "off";
  handclap = "off";
  congaLow = "off";
  timbale = "off";
  closedHihat = "off";
  congaHigh = "off";
  tomLow = "off";
  tomMid = "off";
  openHihat = "off";
  tomHigh = "off";
  cowbellLow = "off";
  crashCymbal = "off";
  cowbellHigh = "off";
  rideCymbal = "off";
}


function getVelocityLevel(velocity) {
  if (velocity < 0.33) {
    return "low";
  } else {
    return "high";
  }
}

function setDrumOutput(outputName, level) {
  if (outputName === "bassKick") bassKick = level;
  if (outputName === "rimshot") rimshot = level;
  if (outputName === "snareDrum") snareDrum = level;
  if (outputName === "handclap") handclap = level;
  if (outputName === "congaLow") congaLow = level;
  if (outputName === "timbale") timbale = level;
  if (outputName === "closedHihat") closedHihat = level;
  if (outputName === "congaHigh") congaHigh = level;
  if (outputName === "tomLow") tomLow = level;
  if (outputName === "tomMid") tomMid = level;
  if (outputName === "openHihat") openHihat = level;
  if (outputName === "tomHigh") tomHigh = level;
  if (outputName === "cowbellLow") cowbellLow = level;
  if (outputName === "crashCymbal") crashCymbal = level;
  if (outputName === "cowbellHigh") cowbellHigh = level;
  if (outputName === "rideCymbal") rideCymbal = level;
}