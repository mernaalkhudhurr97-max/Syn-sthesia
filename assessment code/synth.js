



let synthOsc;
let synthEnv;

let synthVolumes = [0.02, 0.02, 0.02, 0.02];
let synthreverb;

let synthTypes = ["sine", "triangle", "square", "sawtooth"];

let activeSynthTypeIndex = 0;


let synthMidiNote = 66; // F# note work over all the chord changes 

function setupSynth() {
  synthOsc = new p5.Oscillator();

  synthOsc.setType(synthTypes[activeSynthTypeIndex]);
  synthEnv.freq(midiToFreq(synthMidiNote));
  synthOsc.amp(0);
  synthOsc.start();

  synthEnv = new p5.Envelope();

  /// https://p5js.org/reference/p5.PolySynth/noteADSR/ ///

  synthEnv.setADSR(0.01, 0.15, 0.21 , 0.25);

  reverb = new p5.Reverb();

  reverb.process(synthOsc, 3, 2);

  ///https://p5js.org/reference/p5.Reverb/set///

    reverb.set(3, 2, false);

  synthEnv.setRange(synthVolumes[activeSynthTypeIndex], 0);
}

function setSynthType(index) {
  activeSynthTypeIndex = index;

  let type = synthTypes[activeSynthTypeIndex];

  synthOsc.setType(type);
}

function nextSynthType() {
  activeSynthTypeIndex++;

  if (activeSynthTypeIndex >= synthTypes.length) {
    activeSynthTypeIndex = 0;
  }

  let type = synthTypes[activeSynthTypeIndex];

  synthOsc.setType(type);
}

function setSynthMidiNote(midiNote) {
  synthMidiNote = midiNote;
}

function playSynthNote() {
  userStartAudio();

  let freq = midiToFreq(synthMidiNote);

  synthOsc.freq(freq);
  synthEnv.play(synthOsc);
}

function getCurrentSynthType() {
  return synthTypes[activeSynthTypeIndex];
}