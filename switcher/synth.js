



let synth;
let synthReverb;
let synthDelay;

let synthTypes = ["sine"];
let synthVolume = 0.15;

let activeSynthTypeIndex = 0;
let activeSynthNoteIndex = 0;
let synthMidiNote = [71, 69, 66, 64, 62]; // B, A, F#, E, D

function setupSynth() {
  synth = new p5.PolySynth();

  setSynthType(activeSynthTypeIndex);
  synth.setADSR(0.03, 0.15, 0.21, 1.25);

  synthReverb = new p5.Reverb();
  synthReverb.process(synth, 3, 2);
  synthReverb.set(3, 2, false);
  synthReverb.drywet(1.0);

  synthDelay = new p5.Delay();
  synthDelay.process(synth, 0.5, 0.2, 2300);
}

function setSynthType(index) {
  activeSynthTypeIndex = constrain(index, 0, synthTypes.length - 1);
  let type = synthTypes[activeSynthTypeIndex];

  if (!synth || !Array.isArray(synth.audiovoices)) {
    return;
  }

  synth.audiovoices.forEach((voice) => {
    if (voice && voice.oscillator && typeof voice.oscillator.setType === "function") {
      voice.oscillator.setType(type);
    }
  });
}

function nextSynthType() {
  activeSynthTypeIndex++;

  if (activeSynthTypeIndex >= synthTypes.length) {
    activeSynthTypeIndex = 0;
  }

  setSynthType(activeSynthTypeIndex);
}

function setSynthNote(index) {
  activeSynthNoteIndex = constrain(index, 0, synthMidiNote.length - 1);
}

function setSynthMidiNote(midiNoteValue) {
  let foundIndex = synthMidiNote.indexOf(midiNoteValue);
  if (foundIndex >= 0) {
    activeSynthNoteIndex = foundIndex;
  } else {
    synthMidiNote[activeSynthNoteIndex] = midiNoteValue;
  }
}

function playSynthNote(index) {
  userStartAudio();

  if (typeof index !== "undefined") {
    setSynthNote(index);
  }

  let midiNumber = synthMidiNote[activeSynthNoteIndex];
  if (typeof synth !== "undefined" && typeof synth.play === "function") {
    synth.play(midiToFreq(midiNumber), synthVolume, 0, 1.2);
  }
}
function getCurrentSynthType() {
  return synthTypes[activeSynthTypeIndex];
}