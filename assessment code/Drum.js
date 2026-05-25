

/// drum output variables

let DrumSongs = [];
let DrumMidiTracks = [];

let activeDrumTrack = 0;
let DrumIsPlaying = false;
let DrumMuted = false;

let DrumBPM = 160;
let DrumFadeTime = 0.05;


function preload() {
  // Load WAV audio files
  drumSounds[0] = loadSound("assets/DrumWav/Drum 1.wav");
  drumSounds[1] = loadSound("assets/DrumWav/Drum 2.wav");
  drumSounds[2] = loadSound("assets/DrumWav/Drum 3.wav");
  drumSounds[3] = loadSound("assets/DrumWav/Drum 4.wav");
}

function setup() {
  createCanvas(800, 600);

  // Load MIDI files
  loadMidiFile("assets/DrumMidi/Drum 1.mid");
  loadMidiFile("assets/DrumMidi/Drum 2.mid");
  loadMidiFile("assets/DrumMidi/Drum 3.mid");
  loadMidiFile("assets/DrumMidi/Drum 4.mid");
}

// --------------------------------------------------
// LOAD MIDI DATA
// --------------------------------------------------

function loadDrumMidiFile(path, index) {
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
            time: drumTicksToSeconds(note.ticks, ppq, drumBPM),
            velocity: note.velocity,
            triggered: false
          });
        }
      }

      notes.sort(function(a, b) {
        return a.time - b.time;
      });

      drumMidiTracks[index] = {
        notes: notes
      };
    })
}


// --------------------------------------------------
// FORCE MIDI TIMING TO 160 BPM
// --------------------------------------------------

function drumTicksToSeconds(ticks, ppq, bpm) {
  let beats = ticks / ppq;
  return beats * (60 / bpm);
}





function playDrum() {
  for (let i = 0; i < drumSongs.length; i++) {
    drumSongs[i].stop();
  }

  resetAllDrumMidiTriggers();
  setDrumVolumes();

  for (let i = 0; i < drumSongs.length; i++) {
    drumSongs[i].play();
  }

  drumIsPlaying = true;
}

function pauseDrum() {
  for (let i = 0; i < drumSongs.length; i++) {
    drumSongs[i].pause();
  }

  drumIsPlaying = false;
}


function setDrumVolumes() {
  for (let i = 0; i < drumSongs.length; i++) {
    if (DrumMuted) {
      drumSongs[i].setVolume(0, drumFadeTime);
    } else if (i === activeDrumTrack) {
      drumSongs[i].setVolume(1, drumFadeTime);
    } else {
      drumSongs[i].setVolume(0, drumFadeTime);
    }
  }
}


function switchDrumTrack(newTrack) {
  activeDrumTrack = newTrack;
  DrumMuted = false;

  setDrumVolumes();

  resetAllDrumMidiTriggers();
  syncAllDrumMidiToCurrentTime();
}


function muteDrum() {
  DrumMuted = true;

  setDrumVolumes();

  resetAllDrumMidiTriggers();
  syncAllDrumMidiToCurrentTime();
}

function getActiveDrumHits() {
  let hits = [];

  if (!drumIsPlaying || DrumMuted) {
    return hits;
  }

  let midi = drumMidiTracks[activeDrumTrack];

  if (!midi) {
    return hits;
  }

   let currentTime = getDrumCurrentTime();

  for (let note of midi.notes) {
    if (!note.triggered && currentTime >= note.time) {
      note.triggered = true;
      hits.push(note);
    }
  }

  return hits;
} 

function getDrumCurrentTime() {
  if (
    drumSongs[activeDrumTrack] &&
    drumSongs[activeDrumTrack].isPlaying()
  ) {
    return drumSongs[activeDrumTrack].currentTime();
  }

  return 0;
}



// --------------------------------------------------
// RESET MIDI TRIGGERS
// --------------------------------------------------

function resetAllDrumMidiTriggers() {
  for (let t = 0; t < drumMidiTracks.length; t++) {
    if (drumMidiTracks[t]) {
      for (let note of drumMidiTracks[t].notes) {
        note.triggered = false;
      }
    }
  }
}


// --------------------------------------------------
// SYNC ALL MIDI TRACKS TO THE CURRENT AUDIO TIME
// Prevents old notes suddenly triggering after a switch.
// --------------------------------------------------

function syncAllDrumMidiToCurrentTime() {
  let currentTime = getDrumCurrentTime();

  for (let t = 0; t < DrumMidiTracks.length; t++) {
    if (drumMidiTracks[t]) {
      for (let note of drumMidiTracks[t].notes) {
        note.triggered = note.time < currentTime;
      }
    }
  }
}