// sketch.js

let song;

function preload() {
  song = loadSound("assets/songforcode.wav");
}

function setup() {
  createCanvas(700, 500);

  loadMidiFile("assets/songforcode.mid");
  loadMidiFile("assets/drums.mid", "drums");
  loadMidiFile("assets/piano.mid", "piano");
  loadMidiFile("assets/guitar.mid", "guitar");
  loadMidiFile("assets/bass.mid", "bass");
}

function draw() {
  background(15);

  updateMusicOutputs(song.currentTime());

  drawGroupVisuals();
}

function mousePressed() {
  userStartAudio();

  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}