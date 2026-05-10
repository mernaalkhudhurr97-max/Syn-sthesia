let song;
let midiData;

let allMidiNotes = [];
let triggeredNotes = [];

let activeDrumName = "none";
let activeMidiNote = "none";

// C1 to C2 drum map
// You can rename these later depending on your MIDI drum setup.
let drumMap = {
  36: { name: "C1 - basskick"},
  37: { name: "C#1 - Rimshot"},
  38: { name: "D1 - Snaredrum"},
  39: { name: "D#1 - handclap"},
  40: { name: "E1 - conga low"},
  41: { name: "F1 - Timbale"},
  42: { name: "F#1 - closed hihat"},
  43: { name: "G1 - conga high"},
  44: { name: "G#1 - Tom low"},
  45: { name: "A1 - Tom mid"},
  46: { name: "A#1 - open hihat"},
  47: { name: "B1 - tom high",},
  48: { name: "C2 - cowbell low"},
  49 : { name: "C#2 - crash cymbal"},
  50 : { name: "D2 - hi cowbell"},
  51 : { name: "D#2 - ride cymbal"},
};

function preload() {
  song = loadSound("assets/songforcode.wav");
}

function setup() {
  createCanvas(700, 500);
  textAlign(CENTER, CENTER);

  loadMidiFile("assets/songforcode.mid");
}

function draw() {
  background(15);

  checkMidiTriggers();
  updateAndDrawTriggeredNotes();
  drawInfo();
}

function mousePressed() {
  userStartAudio();

  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

// ----------------------------
// Load MIDI file
// ----------------------------

function loadMidiFile(path) {
  fetch(path)
    .then(function(response) {
      return response.arrayBuffer();
    })
    .then(function(arrayBuffer) {
      midiData = new Midi(arrayBuffer);

      for (let track of midiData.tracks) {
        for (let note of track.notes) {
          // Only keep MIDI notes from C1 to C2
          if (note.midi >= 36 && note.midi <= 51) {
            allMidiNotes.push({
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

      console.log("Loaded drum MIDI notes:", allMidiNotes);
    });
}

// ----------------------------
// Check MIDI timing against song time
// ----------------------------

function checkMidiTriggers() {
  if (!song || !allMidiNotes.length) {
    return;
  }

  let currentTime = song.currentTime();

  for (let note of allMidiNotes) {
    // Trigger once when song time passes the MIDI note time
    if (!note.triggered && currentTime >= note.time) {
      note.triggered = true;

      let drumInfo = drumMap[note.midi];

      if (drumInfo) {
        activeDrumName = drumInfo.name;
        activeMidiNote = note.name + " / MIDI " + note.midi;

        triggeredNotes.push({
          midi: note.midi,
          name: note.name,
          drumName: drumInfo.name,
          colour: drumInfo.colour,
          shape: drumInfo.shape,
          velocity: note.velocity,
          life: 60,
          maxLife: 60,
          x: random(120, width - 120),
          y: random(150, height - 100),
          size: map(note.velocity, 0, 1, 40, 180)
        });
      }
    }
  }
}


