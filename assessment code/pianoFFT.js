
let snythFFT1Sounds = [];
let snythFFT2Sounds = [];



let synthFFt1;
let synthFFt2;

let synthFFTIsPlaying = false;
let smoothing = 0.8;
let numbins = 1024;








// was doing it wrong i think you have to set the thing to 0 just like the background in the ed ones idk 

let synth1Spectrum = [];
let synth1CentroidFreq = 0;

let synth1SubBassEnergy = 0;
let synth1BassEnergy = 0;
let synth1LowMidEnergy = 0;
let synth1MidEnergy = 0;
let synth1PresenceEnergy = 0;
let synth1HighEnergy = 0;


let synth2Spectrum = [];
let synth2CentroidFreq = 0;

let synth2SubBassEnergy = 0;
let synth2BassEnergy = 0;
let synth2LowMidEnergy = 0;
let synth2MidEnergy = 0;
let synth2PresenceEnergy = 0;
let synth2HighEnergy = 0;



function preload() {
  
  snythFFT1Sounds = loadSound("assets/SnythFFT1/SnythFFT1.wav");
  snythFFT2Sounds = loadSound("assets/SnythFFT2/SnythFFT2.wav");
 
}


/// https://p5js.org/reference/p5.Amplitude/setInput/ ///


function setupSnythFFTinputs() {

synthFFt1 = new p5.FFT(smoothing,numbins);
synthFFt2 = new p5.FFT(smoothing,numbins);

synthFFt1.setInput(snythFFT1Sounds);
synthFFt2.setInput(snythFFT2Sounds);

}



// surely it work the same as the others just with the different names and stuff

function playGuitar() {
    guitarSongs.stop();
  

  guitarSongs.play();
  guitarIsPlaying = true;
}
  

function pauseGuitar() {
    guitarSongs.pause();

  guitarIsPlaying = false;
}


function setGuitarVolume() {
  if (guitarMuted) {
    guitarSongs.setVolume(0, guitarFadeTime);
  } else {
    guitarSongs.setVolume(1, guitarFadeTime);
  }
}

