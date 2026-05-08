let song;
let fft; 
let smoothing = 0.8; 
let bins = 512;
let waveform = [];
let spectrum = [];

let musicData = {
  kickdrum: 0,
  snaredrum: 0,
  hihat: 0,
  crash: 0,
  volume: 0,
  energyLevel: "low"
};

function preload() {
  song = loadSound('assets/songforcode.wav');
}

function setup() {
  createCanvas(400, 400);

  fft = new p5.FFT(smoothing, bins);
  fft.setInput(song);
}

function draw() {
  background(220);

  spectrum = fft.analyze();
  waveform = fft.waveform();

  updateMusicData();

  // Use kickdrum energy to change spectrum colour
  let kickvol = musicData.kickdrum;

  if (kickvol > 150) {
    stroke(255, 255, 0); // yellow = strong kick
  } else if (kickvol > 100) {
    stroke(255, 0, 0); // red = medium kick
  } else {
    stroke(0); // black = low kick
  }

  let snarevol = musicData.snaredrum;

  if (snarevol > 150) {
    stroke(255, 255, 255); // yellow = strong snare
  } else if (snarevol > 100) {
    stroke(0, 255, 255); // red = medium snare
  } else {
    stroke(255, 0, 255); // black = low snare
  }

  let hihatvol = musicData.hihat;

  if (hihatvol > 100) {
    stroke(255, 255, 255); // yellow = strong hh
  } else if (hihatvol > 100) {
    stroke(0, 255, 255); // red = medium hh
  } else {
    stroke(255, 0, 255); // black = low hh
  }


  // Draw spectrum
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let y = map(spectrum[i], 0, 255, height, 0);

    line(x, height, x, y);
  }

  // Draw waveform
  noStroke();
  fill(0);

  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, 0, height);

    ellipse(x, y, 2, 2);
  }

  // Draw debug text
  fill(0);
  noStroke();
  textSize(12);
}

function updateMusicData() {
  musicData.kickdrum = fft.getEnergy(20, 100);
  musicData.snaredrum = fft.getEnergy(150, 2500);
  musicData.hihat = fft.getEnergy(4000, 9000);
  musicData.crash = fft.getEnergy(6000, 14000);

  musicData.volume = (
    musicData.kickdrum +
    musicData.snaredrum +
    musicData.hihat +
    musicData.crash
  ) / 4;

  if (musicData.volume > 170) {
    musicData.energyLevel = "high";
  } else if (musicData.volume > 100) {
    musicData.energyLevel = "medium";
  } else {
    musicData.energyLevel = "low";
  }
}

function mousePressed() {
  userStartAudio();

  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}