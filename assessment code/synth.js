



let synthOsc;
let synthEnv;
let synthReverb;

let synthVolumes = [0.02, 0.02, 0.02, 0.02];

let synthTypes = ["sine", "triangle", "square", "sawtooth"];

let activeSynthTypeIndex = 0;


let synthMidiNote = 66; // F# note work over all the chord changes 

function setupSynth() {
  synthOsc = new p5.Oscillator();

  synthOsc.setType(synthTypes[activeSynthTypeIndex]);
  synthOsc.freq(midiToFreq(synthMidiNote));
  synthOsc.amp(0);
  synthOsc.start();

  synthEnv = new p5.Envelope();

  /// https://p5js.org/reference/p5.PolySynth/noteADSR/ ///

  synthEnv.setADSR(0.01, 0.15, 0.21 , 0.25);

  synthReverb = new p5.Reverb();

  synthReverb.process(synthOsc, 3, 2);

  ///https://p5js.org/reference/p5.Reverb/set///

  synthReverb.set(3, 2, false);

  synthEnv.setRange(synthVolumes[activeSynthTypeIndex], 0);
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

  let freq = midiToFreq(synthMidiNote);

  synthOsc.freq(freq);

  synthEnv.setRange(synthVolumes[activeSynthTypeIndex], 0);

  synthEnv.play(synthOsc);
}
function getCurrentSynthType() {
  return synthTypes[activeSynthTypeIndex];
}