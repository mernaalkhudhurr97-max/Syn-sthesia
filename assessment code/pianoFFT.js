
let snythFFT1Sounds = [];
let snythFFT2Sounds = [];



let synthFFT1;
let synthFFT2;

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





function playSynthFFT() {
  snythFFT1Sounds.stop();
  snythFFT2Sounds.stop();

  snythFFT1Sounds.play();
  snythFFT2Sounds.play();
  synthFFTIsPlaying = true;
}
  

function pauseSynthFFT() {
    snythFFT1Sounds.pause();
    snythFFT2Sounds.pause();

  synthFFTIsPlaying = false;
}


function updateSynthFFTOutputs() {
  if (!synthFFTIsPlaying) {
    resetSynthFFTOutputs();
    return;
  }

  updateSynthFFT1Outputs();
  updateSynthFFT2Outputs();
}




function updateSynthFFT1Outputs() {

  synth1Spectrum = synthFFT1.analyze();

  
  synth1CentroidFreq = synthFFT1.getCentroid();


  synth1SubBassEnergy = synthFFT1.getEnergy(20, 80);
  synth1BassEnergy = synthFFT1.getEnergy(80, 250);
  synth1LowMidEnergy = synthFFT1.getEnergy(250, 500);
  synth1MidEnergy = synthFFT1.getEnergy(500, 2000);
  synth1PresenceEnergy = synthFFT1.getEnergy(2000, 6000);
  synth1HighEnergy = synthFFT1.getEnergy(6000, 15000);
}




function updateSynthFFT2Outputs() {

  synth2Spectrum = synthFFT2.analyze();



  synth2CentroidFreq = synthFFT2.getCentroid();


  synth2SubBassEnergy = synthFFT2.getEnergy(20, 80);
  synth2BassEnergy = synthFFT2.getEnergy(80, 250);
  synth2LowMidEnergy = synthFFT2.getEnergy(250, 500);
  synth2MidEnergy = synthFFT2.getEnergy(500, 2000);
  synth2PresenceEnergy = synthFFT2.getEnergy(2000, 6000);
  synth2HighEnergy = synthFFT2.getEnergy(6000, 15000);
}




function resetSynthFFTOutputs() {
  synth1Spectrum = new Array(synthBins).fill(0);
  synth1CentroidFreq = 0;

  synth1SubBassEnergy = 0;
  synth1BassEnergy = 0;
  synth1LowMidEnergy = 0;
  synth1MidEnergy = 0;
  synth1PresenceEnergy = 0;
  synth1HighEnergy = 0;


  synth2Spectrum = new Array(synthBins).fill(0);
  synth2CentroidFreq = 0;

  synth2SubBassEnergy = 0;
  synth2BassEnergy = 0;
  synth2LowMidEnergy = 0;
  synth2MidEnergy = 0;
  synth2PresenceEnergy = 0;
  synth2HighEnergy = 0;
}
