// sketch.js

let song;

function preload() {
  song = loadSound("assets/songforcode.wav");
}

function setup() {
  createCanvas(700, 500);

  loadMidiFile("assets/songforcode.mid");
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