

let SnythFFT2Sounds = [];

let fft;
let smoothing = 0.8;
let numbins = 1024;



function preload() {
  
  SnythFFT2Sounds[0] = loadSound("assets/SnythFFT2/SnythFFT2.wav");
}

fft = new p5.FFT(smoothing,numbins);


let lowbassamplitude = fft.getEnergy(20, 600);
let bassamplitude = fft.getEnergy(600, 800);
let lowmidbassamplitude = fft.getEnergy(800, 1200);
let midamplitude = fft.getEnergy(1200, 2000);
let trebleamplitude = fft.getEnergy(2000, 8000);
let presenceamplitude = fft.getEnergy(8000, 15000);