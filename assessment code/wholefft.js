
let wholeFFT;

let wholeFFTIsPlaying = false;

let wholeSmoothing = 0.8;
let wholeBins = 1024;




let wholeSpectrum = [];
let wholeCentroidFreq = 0;

let wholeSubBassEnergy = 0;
let wholeBassEnergy = 0;
let wholeLowMidEnergy = 0;
let wholeMidEnergy = 0;
let wholePresenceEnergy = 0;
let wholeHighEnergy = 0;




/// https://p5js.org/reference/p5.Amplitude/setInput/ ///


function setupwholeFFTInputs() {

wholeFFT = new p5.FFT(wholeSmoothing,wholeBins);


resetWholeFFTOutputs();

}





function updatewholeFFTOutputs() {
  if (!wholeFFTIsPlaying) {
    resetWholeFFTOutputs();
    return;
  }

  wholeSpectrum = wholeFFT.analyze();

  
  wholeCentroidFreq = wholeFFT.getCentroid();


  wholeSubBassEnergy = wholeFFT.getEnergy(20, 80);
  wholeBassEnergy = wholeFFT.getEnergy(80, 250);
  wholeLowMidEnergy = wholeFFT.getEnergy(250, 500);
  wholeMidEnergy = wholeFFT.getEnergy(500, 2000);
  wholePresenceEnergy = wholeFFT.getEnergy(2000, 6000);
  wholeHighEnergy = wholeFFT.getEnergy(6000, 15000);
}



function resetWholeFFTOutputs() {
  wholeSpectrum = new Array(wholeBins).fill(0);
  wholeCentroidFreq = 0;

  wholeSubBassEnergy = 0;
  wholeBassEnergy = 0;
  wholeLowMidEnergy = 0;
  wholeMidEnergy = 0;
  wholePresenceEnergy = 0;
  wholeHighEnergy = 0;
}
