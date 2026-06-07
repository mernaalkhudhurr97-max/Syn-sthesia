
let guitarSongs = [];
let guitarMidiTracks = [];

let guitarIsPlaying = false;
let guitarMuted = false;


let guitarBPM = 160;
let guitarFadeTime = 0.5;


function preloadGuitarInputs() {
  // Load WAV audio files
  guitarSongs = loadSound("assets/Guitar/Guitar.wav");
}




function setupGuitarInputs() {
  loadGuitarMidiFile("assets/Guitar/Guitar.mid");
}

// --------------------------------------------------
// LOAD MIDI DATA
// --------------------------------------------------

function loadGuitarMidiFile(path, index) {
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
            time: guitarTicksToSeconds(note.ticks, ppq, guitarBPM),
            velocity: note.velocity,
            triggered: false
          });
        }
      }

      notes.sort(function(a, b) {
        return a.time - b.time;
      });

      guitarMidiTracks = notes
      });
}


// --------------------------------------------------
// FORCE MIDI TIMING TO 160 BPM
// --------------------------------------------------

function guitarTicksToSeconds(ticks, ppq, bpm) {
  let beats = ticks / ppq;
  return beats * (60 / bpm);
}





function playGuitar() {
    guitarSongs.stop();
  

  guitarSongs.play();
  guitarIsPlaying = true;
}
  

function pauseGuitar() {
    guitarSongs.pause();

  guitarIsPlaying = false;
}


function setGuitarVolume() {
  if (guitarMuted) {
    guitarSongs.setVolume(0, guitarFadeTime);
  } else {
    guitarSongs.setVolume(1, guitarFadeTime);
  }
}



function unmuteGuitar() {
  guitarMuted = false;

  setGuitarVolume();

  resetAllGuitarMidiTriggers();
  syncAllGuitarMidiToCurrentTime();
}




function muteGuitar() {
  guitarMuted = true;

  setGuitarVolume();

  resetAllGuitarMidiTriggers();
  syncAllGuitarMidiToCurrentTime();
}


function getGuitarHits() {
  let hits = [];

  if (!guitarIsPlaying || !guitarSongs.isPlaying()) {
    return hits;
  }

  let currentTime = guitarSongs.currentTime();

  for (let note of guitarMidiTracks) {
    if (!note.triggered && currentTime >= note.time) {
      note.triggered = true;
      hits.push(note);
    }
  }

  return hits;
}



// --------------------------------------------------
// RESET MIDI TRIGGERS
// --------------------------------------------------

function resetAllGuitarMidiTriggers() {
      for (let note of guitarMidiTracks) {
        note.triggered = false;
      }
    }
  

