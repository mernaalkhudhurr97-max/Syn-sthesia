// bass inputs 

let bassSongs = [];
let bassMidiTracks = [];

let activeBassTrack = 0;
let bassIsPlaying = false;
let bassMuted = false;

let bassBPM = 160;
let bassFadeTime = 0.05;


// --------------------------------------------------
// LOAD ALL BASS WAV FILES
// --------------------------------------------------

function preloadBassInputs() {
  bassSongs[0] = loadSound("assets/BassWav/Bass 1.wav");
  bassSongs[1] = loadSound("assets/BassWav/Bass 2.wav");
  bassSongs[2] = loadSound("assets/BassWav/Bass 3.wav");
  bassSongs[3] = loadSound("assets/BassWav/Bass 4.wav");
}


// --------------------------------------------------
// LOAD ALL BASS MIDI FILES
// --------------------------------------------------

function setupBassInputs() {
  loadBassMidiFile("assets/BassMidi/Bass 1.mid", 0);
  loadBassMidiFile("assets/BassMidi/Bass 2.mid", 1);
  loadBassMidiFile("assets/BassMidi/Bass 3.mid", 2);
  loadBassMidiFile("assets/BassMidi/Bass 4.mid", 3);

  setBassVolumes();
}


// --------------------------------------------------
// LOAD MIDI DATA
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
// soo silly of course bass has to all play at the same time otherwise it isnt in time. 
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


function switchBassTrack(newTrack) {
  activeBassTrack = newTrack;
  bassMuted = false;

  setBassVolumes();

  resetAllBassMidiTriggers();
  syncAllBassMidiToCurrentTime();
}


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