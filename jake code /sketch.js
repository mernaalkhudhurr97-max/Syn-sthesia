let song;
let fft; 
let smoothing = 0.8; 
let bins = 512;
let waveform = [];
let r = 100;
let spectrum = [];


function preload() {
  song = loadSound('assets/songforcode.wav');
}

function setup () {
  createCanvas(400, 400);
  song.play();
  fft = new p5.FFT(smoothing, bins);
}

function draw () {
  background(220);
  waveform = fft.waveform();
  spectrum = fft.analyze();
  let vol = fft.getEnergy(20, 140);

  if (vol > 200) {
    stroke(255,0,0);
  } else if (vol > 150) {
    stroke(255,255,0);
  } else {
    stroke(0)
  }

  stroke(255,0,255);
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let y = map(spectrum[i], 0, 255, height, 0);
    line(x, height, x, y);
}
}

  for (let i = 0; i < spectrum.length; i++) {
    let y = map(spectrum[i], 0, 255, height, 0);
    line(i, 0, i,y);
  }


  for (let i = 0; i < waveform.length; i++) {
    let y = map(waveform[i], -1, 1, 0, height);
    ellipse(i, y, 1, 1);
  }


function mousePressed() {
  userStartAudio();

  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }

}
