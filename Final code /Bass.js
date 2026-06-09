// --------------------------------------------------
// BASS AUDIO + MIDI MECHANIC
// Creative Coding Final Project
//
// This file controls the bass layer of the project.
// It loads four bass audio files and four matching MIDI files.
// All bass audio files play at the same time so they stay synchronised,
// but only one bass track is audible at a time.
//
// The MIDI files are used to trigger bass visuals at the correct musical time.
//
// External tool / technique:
// The Midi class comes from the Tone.js MIDI library.
// It allows the browser to read .mid files and access note data such as
// pitch, velocity and tick position.
// Source: https://github.com/Tonejs/Midi
// --------------------------------------------------


// --------------------------------------------------
// BASS STATE VARIABLES
// --------------------------------------------------

// Stores the four loaded bass WAV audio files.

let bassSongs = [];
let bassMidiTracks = [];

let activeBassTrack = 0;
let bassIsPlaying = false;
let bassMuted = false;

let bassBPM = 160;

// Fade time used when changing bass volume.
// This prevents sudden clicks when switching or muting tracks.
let bassFadeTime = 0.05;


// --------------------------------------------------
// PRELOAD BASS WAV FILES
//
// This function is called from preload() in musicbrain.js.
// p5.js loads the audio files before the sketch starts.
// --------------------------------------------------

function preloadBassInputs() {
  bassSongs[0] = loadSound("assets/BassWav/Bass 1.wav");
  bassSongs[1] = loadSound("assets/BassWav/Bass 2.wav");
  bassSongs[2] = loadSound("assets/BassWav/Bass 3.wav");
  bassSongs[3] = loadSound("assets/BassWav/Bass 4.wav");
}


// --------------------------------------------------
// SETUP BASS MIDI FILES
//
// This function is called from setup() in musicbrain.js.
// Each MIDI file matches one bass audio file.
// --------------------------------------------------

function setupBassInputs() {
  loadBassMidiFile("assets/BassMidi/Bass 1.mid", 0);
  loadBassMidiFile("assets/BassMidi/Bass 2.mid", 1);
  loadBassMidiFile("assets/BassMidi/Bass 3.mid", 2);
  loadBassMidiFile("assets/BassMidi/Bass 4.mid", 3);

  setBassVolumes();
}


// --------------------------------------------------
// LOAD AND PARSE MIDI DATA
//
// fetch() loads the .mid file as binary data.
// The Tone.js Midi parser then converts it into note information.
//
// Each note is stored with:
// - midi: pitch number
// - name: musical note name
// - time: note time in seconds
// - velocity: note strength
// - triggered: whether the visual has already been triggered
// --------------------------------------------------

function loadBassMidiFile(path, index) {
  fetch(path)
    .then(function(response) {
      if (!response.ok) {
        throw new Error("Cannot load " + path);
      }

      return response.arrayBuffer();
    })
    .then(function(arrayBuffer) {
      let midiData = new Midi(arrayBuffer);
      let notes = [];

      let ppq = midiData.header.ppq || midiData.header.PPQ || 480;

      for (let track of midiData.tracks) {
        for (let note of track.notes) {
          notes.push({
            midi: note.midi,
            name: note.name,
            time: bassTicksToSeconds(note.ticks, ppq, bassBPM),
            velocity: note.velocity,
            triggered: false
          });
        }
      }

      notes.sort(function(a, b) {
        return a.time - b.time;
      });

      bassMidiTracks[index] = {
        notes: notes
      };
    })
}


// --------------------------------------------------
// FORCE MIDI TIMING TO 160 BPM
// --------------------------------------------------

function bassTicksToSeconds(ticks, ppq, bpm) {
  let beats = ticks / ppq;
  return beats * (60 / bpm);
}




// --------------------------------------------------
// PLAY BASS LAYER
//
// All four bass audio files are started together.
// This keeps them synchronised on the same timeline.
// Only the active bass track is heard because the other tracks
// are set to volume 0.
// --------------------------------------------------
function playBass() {
  for (let i = 0; i < bassSongs.length; i++) {
    bassSongs[i].stop();
  }

  resetAllBassMidiTriggers();
  setBassVolumes();

  for (let i = 0; i < bassSongs.length; i++) {
    bassSongs[i].play();
  }

  bassIsPlaying = true;
}

function pauseBass() {
  for (let i = 0; i < bassSongs.length; i++) {
    bassSongs[i].pause();
  }

  bassIsPlaying = false;
}


function setBassVolumes() {
  for (let i = 0; i < bassSongs.length; i++) {
    if (bassMuted) {
      bassSongs[i].setVolume(0, bassFadeTime);
    } else if (i === activeBassTrack) {
      bassSongs[i].setVolume(1, bassFadeTime);
    } else {
      bassSongs[i].setVolume(0, bassFadeTime);
    }
  }
}


// --------------------------------------------------
// SWITCH ACTIVE BASS TRACK
//
// This changes which bass track is audible.
// The audio files do not restart, so the bass remains synchronised
// with the rest of the music.
// --------------------------------------------------

function switchBassTrack(newTrack) {
  activeBassTrack = newTrack;
  bassMuted = false;

  setBassVolumes();

  resetAllBassMidiTriggers();
  syncAllBassMidiToCurrentTime();
}


// --------------------------------------------------
// MUTE BASS LAYER
//
// The audio timeline keeps running, but the volume is set to 0.
// This means the bass can be unmuted later without losing sync.
// --------------------------------------------------

function muteBass() {
  bassMuted = true;

  setBassVolumes();

  resetAllBassMidiTriggers();
  syncAllBassMidiToCurrentTime();
}

function getActiveBassHits() {
  let hits = [];

  if (!bassIsPlaying || bassMuted) {
    return hits;
  }

  let midi = bassMidiTracks[activeBassTrack];

  if (!midi) {
    return hits;
  }

   let currentTime = getBassCurrentTime();

  for (let note of midi.notes) {
    if (!note.triggered && currentTime >= note.time) {
      note.triggered = true;
      hits.push(note);
    }
  }

  return hits;
} 

function getBassCurrentTime() {
  if (
    bassSongs[activeBassTrack] &&
    bassSongs[activeBassTrack].isPlaying()
  ) {
    return bassSongs[activeBassTrack].currentTime();
  }

  return 0;
}



// --------------------------------------------------
// RESET MIDI TRIGGERS
// --------------------------------------------------

function resetAllBassMidiTriggers() {
  for (let t = 0; t < bassMidiTracks.length; t++) {
    if (bassMidiTracks[t]) {
      for (let note of bassMidiTracks[t].notes) {
        note.triggered = false;
      }
    }
  }
}


// --------------------------------------------------
// SYNC ALL MIDI TRACKS TO THE CURRENT AUDIO TIME
// Prevents old notes suddenly triggering after a switch.
// --------------------------------------------------

function syncAllBassMidiToCurrentTime() {
  let currentTime = getBassCurrentTime();

  for (let t = 0; t < bassMidiTracks.length; t++) {
    if (bassMidiTracks[t]) {
      for (let note of bassMidiTracks[t].notes) {
        note.triggered = note.time < currentTime;
      }
    }
  }
}