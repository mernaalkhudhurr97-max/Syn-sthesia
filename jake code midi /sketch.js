let song;
let midiData;

let allMidiNotes = [];
let triggeredNotes = [];

let activeDrumName = "none";
let activeMidiNote = "none";

// C1 to C2 drum map
// You can rename these later depending on your MIDI drum setup.
let drumMap = {
  36: { name: "C1 - Low Kick", colour: [255, 60, 60], shape: "circle" },
  37: { name: "C#1 - Deep Boom", colour: [255, 110, 60], shape: "square" },
  38: { name: "D1 - Snare Low", colour: [255, 180, 60], shape: "flash" },
  39: { name: "D#1 - Rim Hit", colour: [255, 230, 80], shape: "line" },
  40: { name: "E1 - Clap", colour: [180, 255, 80], shape: "burst" },
  41: { name: "F1 - Closed Hat", colour: [80, 255, 130], shape: "smallDots" },
  42: { name: "F#1 - Open Hat", colour: [80, 255, 220], shape: "rings" },
  43: { name: "G1 - Tom Low", colour: [80, 180, 255], shape: "circle" },
  44: { name: "G#1 - Tom Mid", colour: [80, 110, 255], shape: "square" },
  45: { name: "A1 - Tom High", colour: [140, 90, 255], shape: "triangle" },
  46: { name: "A#1 - Crash", colour: [210, 90, 255], shape: "burst" },
  47: { name: "B1 - Ride", colour: [255, 90, 220], shape: "rings" },
  48: { name: "C2 - Main Kick", colour: [255, 255, 255], shape: "bigPulse" }
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
          if (note.midi >= 36 && note.midi <= 48) {
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

// ----------------------------
// Draw triggered drum visuals
// ----------------------------

function updateAndDrawTriggeredNotes() {
  for (let i = triggeredNotes.length - 1; i >= 0; i--) {
    let hit = triggeredNotes[i];

    let alpha = map(hit.life, 0, hit.maxLife, 0, 180);
    let growth = map(hit.life, hit.maxLife, 0, 1, 2.5);

    let c = hit.colour;

    push();
    translate(hit.x, hit.y);

    fill(c[0], c[1], c[2], alpha);
    stroke(c[0], c[1], c[2], alpha);
    strokeWeight(3);

    let s = hit.size * growth;

    if (hit.shape === "circle") {
      ellipse(0, 0, s, s);
    }

    else if (hit.shape === "square") {
      rectMode(CENTER);
      rect(0, 0, s, s);
    }

    else if (hit.shape === "triangle") {
      triangle(-s / 2, s / 2, s / 2, s / 2, 0, -s / 2);
    }

    else if (hit.shape === "flash") {
      noStroke();
      rectMode(CENTER);
      rect(0, 0, width, height);
    }

    else if (hit.shape === "line") {
      line(-s, 0, s, 0);
      line(0, -s, 0, s);
    }

    else if (hit.shape === "burst") {
      for (let a = 0; a < TWO_PI; a += TWO_PI / 12) {
        let x1 = cos(a) * s * 0.2;
        let y1 = sin(a) * s * 0.2;
        let x2 = cos(a) * s;
        let y2 = sin(a) * s;
        line(x1, y1, x2, y2);
      }
    }

    else if (hit.shape === "smallDots") {
      noStroke();
      for (let j = 0; j < 12; j++) {
        let angle = TWO_PI * j / 12;
        let dotX = cos(angle) * s * 0.6;
        let dotY = sin(angle) * s * 0.6;
        ellipse(dotX, dotY, 10, 10);
      }
    }

    else if (hit.shape === "rings") {
      noFill();
      ellipse(0, 0, s, s);
      ellipse(0, 0, s * 0.7, s * 0.7);
      ellipse(0, 0, s * 0.4, s * 0.4);
    }

    else if (hit.shape === "bigPulse") {
      noStroke();
      ellipse(0, 0, s * 1.5, s * 1.5);
    }

    pop();

    hit.life--;

    if (hit.life <= 0) {
      triggeredNotes.splice(i, 1);
    }
  }
}

// ----------------------------
// Interface text
// ----------------------------

function drawInfo() {
  fill(255);
  noStroke();

  textSize(24);
  text("MIDI Drum Visualiser", width / 2, 40);

  textSize(16);
  text("Active drum: " + activeDrumName, width / 2, 75);
  text("MIDI note: " + activeMidiNote, width / 2, 100);

  if (song.isPlaying()) {
    text("Playing - click to pause", width / 2, height - 35);
  } else {
    text("Paused - click to play", width / 2, height - 35);
  }

  textSize(12);
  text("Using MIDI notes C1 to C2 / MIDI 24 to 36", width / 2, height - 15);
}