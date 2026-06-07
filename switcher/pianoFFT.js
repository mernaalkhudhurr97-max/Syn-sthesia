
let synthFFT1Sound = [];
let synthFFT2Sound = [];



let synthFFT1;
let synthFFT2;

let synthFFTIsPlaying = false;

let synthSmoothing = 0.8;
let synthBins = 1024;








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



function preloadSynthFFTInputs() {
  
  synthFFT1Sound = loadSound("assets/SynthWAV/SynthFFT1.wav");
  synthFFT2Sound = loadSound("assets/SynthWAV/SynthFFT2.wav");
 
}


/// https://p5js.org/reference/p5.Amplitude/setInput/ ///


function setupSynthFFTInputs() {

synthFFT1 = new p5.FFT(synthSmoothing,synthBins);
synthFFT2 = new p5.FFT(synthSmoothing,synthBins);

synthFFT1.setInput(synthFFT1Sound);
synthFFT2.setInput(synthFFT2Sound);

resetSynthFFTOutputs();
}





function playSynthFFT() {
  synthFFT1Sound.stop();
  synthFFT2Sound.stop();

  synthFFT1Sound.play();
  synthFFT2Sound.play();

  synthFFTIsPlaying = true;
}
  

function pauseSynthFFT() {
    if (synthFFT1Sound.pause()) {
      synthFFT1Sound.pause();
    }
    if (synthFFT2Sound.pause()) {
      synthFFT2Sound.pause();
    }

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
