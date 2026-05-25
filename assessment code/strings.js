


let StringsSounds = [];
let StringsMidiTracks = [];

let activeStringsTrack = 0;
let stringsIsPlaying = false;
let stringsMuted = false;

let stringsBPM = 160;
let stringsFadeTime = 0.05;

function preload() {
  // Load WAV audio files
  StringsSounds[0] = loadSound("assets/StringsWav/String 1.wav");
  StringsSounds[1] = loadSound("assets/StringsWav/String 2.wav");
  StringsSounds[2] = loadSound("assets/StringsWav/String 3.wav");
  StringsSounds[3] = loadSound("assets/StringsWav/String 4.wav");
}

// idk what happened but the tempo wasnt being set in the midi files so i just hardcoded it here, it should be 160 bpm for all of them
let bpm = 160;
let secondsPerBeat = 60 / bpm; 

function setup() {
  createCanvas(800, 600);

  // Load MIDI files
  loadMidiFile("assets/StringsMidi/String 1.mid");
  loadMidiFile("assets/StringsMidi/String 2.mid");
  loadMidiFile("assets/StringsMidi/String 3.mid");
  loadMidiFile("assets/StringsMidi/String 4.mid");
}


// --------------------------------------------------
// LOAD MIDI DATA
// --------------------------------------------------

function loadStringsMidiFile(path, index) {
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
            time: stringsTicksToSeconds(note.ticks, ppq, stringsBPM),
            velocity: note.velocity,
            triggered: false
          });
        }
      }

      notes.sort(function(a, b) {
        return a.time - b.time;
      });

      StringsMidiTracks[index] = {
        notes: notes
      };
    })
}


// --------------------------------------------------
// FORCE MIDI TIMING TO 160 BPM
// --------------------------------------------------

function stringsTicksToSeconds(ticks, ppq, bpm) {
  let beats = ticks / ppq;
  return beats * (60 / bpm);
}






function playStrings() {
  for (let i = 0; i < stringsSongs.length; i++) {
    stringsSongs[i].stop();
  }

  resetAllStringsMidiTriggers();
  setStringsVolumes();

  for (let i = 0; i < stringsSongs.length; i++) {
    stringsSongs[i].play();
  }

  stringsIsPlaying = true;
}

function pauseStrings() {
  for (let i = 0; i < stringsSongs.length; i++) {
    stringsSongs[i].pause();
  }

  stringsIsPlaying = false;
}


function setStringsVolumes() {
  for (let i = 0; i < stringsSongs.length; i++) {
    if (stringsMuted) {
      stringsSongs[i].setVolume(0, stringsFadeTime);
    } else if (i === activeStringsTrack) {
      stringsSongs[i].setVolume(1, stringsFadeTime);
    } else {
      stringsSongs[i].setVolume(0, stringsFadeTime);
    }
  }
}


function switchStringsTrack(newTrack) {
  activeStringsTrack = newTrack;
  stringsMuted = false;

  setStringsVolumes();

  resetAllStringsMidiTriggers();
  syncAllStringsMidiToCurrentTime();
}


function muteStrings() {
  stringsMuted = true;

  setStringsVolumes();

  resetAllStringsMidiTriggers();
  syncAllStringsMidiToCurrentTime();
}

function getActiveStringsHits() {
  let hits = [];

  if (!stringsIsPlaying || stringsMuted) {
    return hits;
  }

  let midi = stringsMidiTracks[activeStringsTrack];

  if (!midi) {
    return hits;
  }

   let currentTime = getStringsCurrentTime();

  for (let note of midi.notes) {
    if (!note.triggered && currentTime >= note.time) {
      note.triggered = true;
      hits.push(note);
    }
  }

  return hits;
} 

function getStringsCurrentTime() {
  if (
    stringsSongs[activeStringsTrack] &&
    stringsSongs[activeStringsTrack].isPlaying()
  ) {
    return stringsSongs[activeStringsTrack].currentTime();
  }

  return 0;
}



// --------------------------------------------------
// RESET MIDI TRIGGERS
// --------------------------------------------------

function resetAllStringsMidiTriggers() {
  for (let t = 0; t < stringsMidiTracks.length; t++) {
    if (stringsMidiTracks[t]) {
      for (let note of stringsMidiTracks[t].notes) {
        note.triggered = false;
      }
    }
  }
}


// --------------------------------------------------
// SYNC ALL MIDI TRACKS TO THE CURRENT AUDIO TIME
// Prevents old notes suddenly triggering after a switch.
// --------------------------------------------------

function syncAllStringsMidiToCurrentTime() {
  let currentTime = getStringsCurrentTime();

  for (let t = 0; t < stringsMidiTracks.length; t++) {
    if (stringsMidiTracks[t]) {
      for (let note of stringsMidiTracks[t].notes) {
        note.triggered = note.time < currentTime;
      }
    }
  }
}