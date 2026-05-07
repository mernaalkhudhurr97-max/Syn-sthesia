let song;
let fft; 
let smoothing = 0.8; 
let bins = 512;
let waveform = [];
let spectrum = [];

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

  let vol = fft.getEnergy(20, 140);

  // Bass energy changes colour
  if (vol > 150) {
    stroke(255, 255, 0); // yellow = strong bass
  } else if (vol > 100) {
    stroke(255, 0, 0); // red = medium bass
  } else {
    stroke(0); // black = low bass
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

  fill(0);
  noStroke();
  text("Click to play / pause", 20, 20);
}

function mousePressed() {
  userStartAudio();

  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}