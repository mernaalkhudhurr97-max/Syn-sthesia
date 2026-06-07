



let synthOsc;
let synthEnv;
let synthReverb;
let synthDelay;
let synthLowPassFilter;

let synthTypes = "sine";

let synthVolumes = 0.2;



let activeSynthTypeIndex = 0;


let synthMidiNote = [66, 71]; // F# and B note work over all the chord changes 

function setupSynth() {
  synthOsc = new p5.Oscillator();

  synthOsc.setType(synthTypes[activeSynthTypeIndex]);
  synthOsc.freq(midiToFreq(synthMidiNote[activeSynthTypeIndex]));
  synthOsc.amp(0);
  synthOsc.start();

  synthEnv = new p5.Envelope();

  /// https://p5js.org/reference/p5.PolySynth/noteADSR/ ///

  synthEnv.setADSR(0.03, 0.15, 0.81 , 2.25);

  synthReverb = new p5.Reverb();

  synthReverb.process(synthOsc, 3, 2);

  ///https://p5js.org/reference/p5.Reverb/set///

  synthReverb.set(3, 2, false);

  synthReverb.drywet(1.0);

  synthEnv.setRange(synthVolumes[activeSynthTypeIndex], 0);

  synthDelay = new p5.Delay();

  synthDelay.process(synthOsc, 0.5, 0.8, 2300);

    synthLowPassFilter = new p5.LowPass();

    synthOsc.disconnect();

    synthOsc.connect(synthLowPassFilter);

    synthLowPassFilter.freq(3000);


}

function setSynthType(index) {
  activeSynthTypeIndex = index;

  if (activeSynthTypeIndex< 0) {
    activeSynthTypeIndex = 0;
    }

    if (activeSynthTypeIndex >= synthTypes.length) {
        activeSynthTypeIndex = synthTypes.length - 1;
        }

  let type = synthTypes[activeSynthTypeIndex];

  synthOsc.setType(type);

  synthEnv.setRange(synthVolumes[activeSynthTypeIndex], 0);
}

function nextSynthType() {
  activeSynthTypeIndex++;

  if (activeSynthTypeIndex >= synthTypes.length) {
    activeSynthTypeIndex = 0;
  }

  setSynthType(activeSynthTypeIndex);
}

function setSynthMidiNote(midiNote) {
  synthMidiNote = midiNote;
}

function playSynthNote() {
  userStartAudio();

  let freq = midiToFreq(synthMidiNote[activeSynthTypeIndex]);

  synthOsc.freq(freq);

  synthEnv.setRange(synthVolumes[activeSynthTypeIndex], 0);

  synthEnv.play(synthOsc);
}
function getCurrentSynthType() {
  return synthTypes[activeSynthTypeIndex];
}