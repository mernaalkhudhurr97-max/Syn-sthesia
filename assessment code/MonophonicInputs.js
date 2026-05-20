
let synthSounds = [];
let allMidiNotes = [];
let midiData;

let monophonicNotes = [];

function preload() {
  // Load WAV audio files
  synthSounds[0] = loadSound("assets/poly 1.wav");
  synthSounds[1] = loadSound("assets/poly 2.wav");
  synthSounds[2] = loadSound("assets/poly 3.wav");
  synthSounds[3] = loadSound("assets/poly 4.wav");
}

function setup() {
  createCanvas(800, 600);

  // Load MIDI files
  loadMidiFile("assets/poly 1.mid");
  loadMidiFile("assets/poly 2.mid");
  loadMidiFile("assets/poly 3.mid");
  loadMidiFile("assets/poly 4.mid");
}


let coutput = "off";
let csharpoutput = "off";
let doutput = "off";
let dsharpoutput = "off";
let eoutput = "off";
let foutput = "off";
let fsharpoutput = "off";
let goutput = "off";
let gsharpoutput = "off";
let aoutput = "off";
let asharpoutput = "off";
let boutput = "off";

let c2output = "off";
let csharp2output = "off";
let d2output = "off";
let dsharp2output = "off";
let e2output = "off";
let f2output = "off";
let fsharp2output = "off";
let g2output = "off";
let gsharp2output = "off";
let a2output = "off";
let asharp2output = "off";
let b2output = "off";

let c3output = "off";



let monophonicMap = {
  24: "Coutput",
  25: "csharpoutput",
  26: "Doutput",
  27: "D#output",
  28: "Eoutput",
  29: "Foutput",
  30: "F#output",
  31: "Goutput",
  32: "G#output",
  33: "Aoutput",
  34: "A#output",
  35: "Boutput",

  36: "C2output",
  37: "C#2output",
  38: "D2output",
  39: "D#2output",
  40: "E2output",
  41: "F2output",
  42: "F#2output",
  43: "G2output",
  44: "G#2output",
  45: "A2output",
  46: "A#2output",
  47: "B2output",

  48: "C3output"
};

// =====================================================
// SETUP FUNCTION TO CALL FROM sketch.js
// =====================================================

function setupMonophonicInputs() {
  loadMonophonicMidiFile("assets/monophonic.mid");
}

// =====================================================
// LOAD MONOPHONIC MIDI FILE
// =====================================================

function loadMonophonicMidiFile(path) {
  fetch(path)
    .then(function(response) {
      return response.arrayBuffer();
    })
    .then(function(arrayBuffer) {
      let midiData = new Midi(arrayBuffer);

      for (let track of midiData.tracks) {
        for (let note of track.notes) {
          // C1 to C3
          if (note.midi >= 24 && note.midi <= 48) {
            monophonicNotes.push({
              midi: note.midi,
              name: note.name,
              time: note.time,
              duration: note.duration,
              velocity: note.velocity,
              triggered: false
            });
          }
        }
      }

      console.log("Monophonic MIDI loaded:", path);
      console.log(monophonicNotes);
    });
}

// =====================================================
// UPDATE MONOPHONIC OUTPUTS
// =====================================================

function updateMonophonicOutputs(currentTime) {
  resetMonophonicOutputs();

  for (let note of monophonicNotes) {
    let noteStart = note.time;
    let noteEnd = note.time + note.duration;

    if (currentTime >= noteStart && currentTime <= noteEnd) {
      let outputName = monophonicMap[note.midi];
      let level = getMonophonicVelocityLevel(note.velocity);

      setMonophonicOutput(outputName, level);
    }
  }
}

// =====================================================
// RESET MONOPHONIC OUTPUTS
// =====================================================

function resetMonophonicOutputs() {
  coutput = "off";
  csharpoutput = "off";
  doutput = "off";
  dsharpoutput = "off";
  eoutput = "off";
  foutput = "off";
  fsharpoutput = "off";
  goutput = "off";
  gsharpoutput = "off";
  aoutput = "off";
  asharpoutput = "off";
  boutput = "off";

  c2output = "off";
  csharp2output = "off";
  d2output  = "off";
  dsharp2output = "off";
  e2output = "off";
  f2output = "off";
  fsharp2output = "off";
  g2output = "off";
  gsharp2output = "off";
  a2output = "off";
  asharp2output = "off";
  b2output = "off";

  c3output = "off";
}

// =====================================================
// VELOCITY LEVEL
// =====================================================

function getMonophonicVelocityLevel(velocity) {
  if (velocity < 0.33) {
    return "low";
  } else if (velocity < 0.66) {
    return "medium";
  } else {
    return "high";
  }
}

// =====================================================
// SET ONE MONOPHONIC OUTPUT
// =====================================================

function setMonophonicOutput(outputName, level) {
  if (outputName === "coutput") coutput = level;
  if (outputName === "csharpoutput") csharpoutput = level;
  if (outputName === "doutput") doutput = level;
  if (outputName === "dsharpoutput") dsharpoutput = level;
  if (outputName === "eoutput") eoutput = level;
  if (outputName === "foutput") foutput = level;
  if (outputName === "fsharpoutput") fsharpoutput = level;
  if (outputName === "goutput") goutput = level;
  if (outputName === "gsharpoutput") gsharpoutput = level;
  if (outputName === "aoutput") aoutput = level;
  if (outputName === "asharpoutput") asharpoutput = level;
  if (outputName === "boutput") boutput = level;

  if (outputName === "c2output") c2output = level;
  if (outputName === "csharp2output") csharp2output = level;
  if (outputName === "d2output") d2output = level;
  if (outputName === "dsharp2output") dsharp2output = level;
  if (outputName === "e2output") e2output = level;
  if (outputName === "f2output") f2output = level;
  if (outputName === "fsharp2output") fsharp2output = level;
  if (outputName === "g2output") g2output = level;
  if (outputName === "gsharp2output") gsharp2output = level;
  if (outputName === "a2output") a2output = level;
  if (outputName === "asharp2output") asharp2output = level;
  if (outputName === "b2output") b2output = level;

  if (outputName === "c3output") c3output = level;
}