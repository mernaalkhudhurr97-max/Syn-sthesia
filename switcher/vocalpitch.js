/// the code train guy had this tuner thing and i thiough i could use it formy thing //

const vocalPitchModelURL =
  "https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/";

let vocalSounds = [];
let vocalSoundFiles = [];  // p5.SoundFile objects for reverb processing
let vocalPitchDetectors = [];

let vocalFreq = [0, 0, 0];
let vocalNoteName = ["-", "-", "-"];
let vocalNoteFreq = [0, 0, 0];

// true = off / muted
// false = on / unmuted
let vocalMuted = [true, true, true];

let vocalIsPlaying = false;
let vocalAudioContext;


// --------------------------------------------------
// PRELOAD
// --------------------------------------------------

function preloadVocalPitchInputs() {
  // Create p5.SoundFile objects for reverb processing (Web Audio API)
  vocalSoundFiles[0] = loadSound("assets/VocalPitchWAV/vocal1.wav");
  vocalSoundFiles[1] = loadSound("assets/VocalPitchWAV/vocal2.wav");
  vocalSoundFiles[2] = loadSound("assets/VocalPitchWAV/vocal3.wav");
  
  // Create HTML audio elements for pitch detection (captureStream)
  vocalSounds[0] = createAudio("assets/VocalPitchWAV/vocal1.wav");
  vocalSounds[1] = createAudio("assets/VocalPitchWAV/vocal2.wav");
  vocalSounds[2] = createAudio("assets/VocalPitchWAV/vocal3.wav");

  for (let i = 0; i < vocalSounds.length; i++) {
    vocalSounds[i].hide();
    vocalSounds[i].volume(0);
  }
}


// --------------------------------------------------
// SETUP
// --------------------------------------------------

function setupVocalPitchInputs() {
  vocalAudioContext = getAudioContext();

  for (let i = 0; i < vocalSounds.length; i++) {
    setupSingleVocalPitchDetector(i);
  }
}


function setupSingleVocalPitchDetector(index) {
  let stream = vocalSounds[index].elt.captureStream();

  vocalPitchDetectors[index] = ml5.pitchDetection(
    vocalPitchModelURL,
    vocalAudioContext,
    stream,
    function () {
      console.log("Vocal pitch model loaded for vocal " + (index + 1));

      vocalPitchDetectors[index].getPitch(function (error, frequency) {
        gotVocalPitch(error, frequency, index);
      });
    }
  );
}


// --------------------------------------------------
// PITCH DETECTION LOOP
// --------------------------------------------------

function gotVocalPitch(error, frequency, index) {
  if (error) {
    console.error(error);
  } else {
    if (frequency && vocalIsPlaying && !vocalMuted[index]) {
      vocalFreq[index] = frequency;

      let closestNote = getClosestVocalNote(frequency);

      vocalNoteName[index] = closestNote.note;
      vocalNoteFreq[index] = closestNote.freq;
    }

    if (!vocalIsPlaying || vocalMuted[index]) {
      resetSingleVocalPitch(index);
    }

    vocalPitchDetectors[index].getPitch(function (error, frequency) {
      gotVocalPitch(error, frequency, index);
    });
  }
}


function playVocals() {
  vocalIsPlaying = true;

  for (let i = 0; i < vocalSounds.length; i++) {
    vocalSounds[i].stop();
    vocalSounds[i].volume(vocalMuted[i] ? 0 : 1);
    vocalSounds[i].loop();
  }
  
  if (typeof vocalSoundFiles !== "undefined") {
    for (let i = 0; i < vocalSoundFiles.length; i++) {
      if (vocalSoundFiles[i]) {
        if (typeof vocalSoundFiles[i].stop === "function") {
          vocalSoundFiles[i].stop();
        }
        if (typeof vocalSoundFiles[i].setVolume === "function") {
          vocalSoundFiles[i].setVolume(vocalMuted[i] ? 0 : 1);
        }
        if (typeof vocalSoundFiles[i].loop === "function") {
          vocalSoundFiles[i].loop();
        }
      }
    }
  }
}


function pauseVocals() {
  vocalIsPlaying = false;

  for (let i = 0; i < vocalSounds.length; i++) {
    vocalSounds[i].pause();
    resetSingleVocalPitch(i);
  }
  
  if (typeof vocalSoundFiles !== "undefined") {
    for (let i = 0; i < vocalSoundFiles.length; i++) {
      if (vocalSoundFiles[i] && typeof vocalSoundFiles[i].stop === "function") {
        vocalSoundFiles[i].stop();
      }
    }
  }
}


// --------------------------------------------------
// INDIVIDUAL VOCAL ON / OFF
//
// ON = volume up only
// OFF = volume down only
// The vocal does not restart, so timing stays locked.
// --------------------------------------------------

function unmuteVocal(index) {
  vocalMuted[index] = false;

  if (vocalIsPlaying) {
    vocalSounds[index].volume(1);
    if (typeof vocalSoundFiles !== "undefined" && vocalSoundFiles[index]) {
      if (typeof vocalSoundFiles[index].setVolume === "function") {
        vocalSoundFiles[index].setVolume(1);
      }
    }
  }
}


function muteVocal(index) {
  vocalMuted[index] = true;

  if (vocalIsPlaying) {
    vocalSounds[index].volume(0);
    if (typeof vocalSoundFiles !== "undefined" && vocalSoundFiles[index]) {
      if (typeof vocalSoundFiles[index].setVolume === "function") {
        vocalSoundFiles[index].setVolume(0);
      }
    }
  }

  resetSingleVocalPitch(index);
}




function unmuteAllVocals() {
  for (let i = 0; i < vocalSounds.length; i++) {
    vocalMuted[i] = false;

    if (vocalIsPlaying) {
      vocalSounds[i].volume(1);
      if (typeof vocalSoundFiles !== "undefined" && vocalSoundFiles[i]) {
        if (typeof vocalSoundFiles[i].setVolume === "function") {
          vocalSoundFiles[i].setVolume(1);
        }
      }
    }
  }
}


function muteAllVocals() {
  for (let i = 0; i < vocalSounds.length; i++) {
    vocalMuted[i] = true;

    if (vocalIsPlaying) {
      vocalSounds[i].volume(0);
      if (typeof vocalSoundFiles !== "undefined" && vocalSoundFiles[i]) {
        if (typeof vocalSoundFiles[i].setVolume === "function") {
          vocalSoundFiles[i].setVolume(0);
        }
      }
    }

    resetSingleVocalPitch(i);
  }
}


function toggleAllVocals() {
  let atLeastOneOff = false;

  for (let i = 0; i < vocalMuted.length; i++) {
    if (vocalMuted[i]) {
      atLeastOneOff = true;
    }
  }

  if (atLeastOneOff) {
    unmuteAllVocals();
  } else {
    muteAllVocals();
  }
}


// --------------------------------------------------
// RESET
// --------------------------------------------------

function resetSingleVocalPitch(index) {
  vocalFreq[index] = 0;
  vocalNoteName[index] = "-";
  vocalNoteFreq[index] = 0;
}


// --------------------------------------------------
// CLOSEST MUSICAL NOTE
//
// Uses equal temperament with A4 = 440 Hz.
// This avoids needing a huge note table.
// --------------------------------------------------

function getClosestVocalNote(freq) {
  let midi = Math.round(12 * Math.log2(freq / 440) + 69);

  let noteNames = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B"
  ];

  let noteIndex = ((midi % 12) + 12) % 12;
  let noteName = noteNames[noteIndex];

  let noteFreq = 440 * Math.pow(2, (midi - 69) / 12);

  return {
    note: noteName,
    freq: noteFreq
  };
}