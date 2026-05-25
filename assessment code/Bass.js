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

// Bass note output parameters: A1 to A3
let bassNotes = {
  // A1 to B1
  A1: "off",
  As1: "off",
  B1: "off",

  // Octave 2
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

  // C3 to A3
  C3: "off",
  Cs3: "off",
  D3: "off",
  Ds3: "off",
  E3: "off",
  F3: "off",
  Fs3: "off",
  G3: "off",
  Gs3: "off",
  A3: "off"
};

// MIDI note number to bass note name
let bassMap = {
  // A1 to B1
  33: "A1",
  34: "As1",
  35: "B1",

  // Octave 2
  36: "C2",
  37: "Cs2",
  38: "D2",
  39: "Ds2",
  40: "E2",
  41: "F2",
  42: "Fs2",
  43: "G2",
  44: "Gs2",
  45: "A2",
  46: "As2",
  47: "B2",

  // C3 to A3
  48: "C3",
  49: "Cs3",
  50: "D3",
  51: "Ds3",
  52: "E3",
  53: "F3",
  54: "Fs3",
  55: "G3",
  56: "Gs3",
  57: "A3"
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