
let GuitarSongs = [];
let GuitarMidiTracks = [];



let guitarBPM = 160;


function preloadGuitarInputs() {
  // Load WAV audio files
  GuitarSongs = loadSound("assets/Guitar/Guitar.wav");
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

      GuitarMidiTracks[index] = {
        notes: notes
      };
    })
}


// --------------------------------------------------
// FORCE MIDI TIMING TO 160 BPM
// --------------------------------------------------

function guitarTicksToSeconds(ticks, ppq, bpm) {
  let beats = ticks / ppq;
  return beats * (60 / bpm);
}





function playGuitar() {
    GuitarSongs.stop();
  

  GuitarSongs.play();
  GuitarIsPlaying = true;
}
  

function pauseGuitar() {
    GuitarSongs.pause();

  GuitarIsPlaying = false;
}





function getGuitarHits() {
  let hits = [];

  if (!guitarIsPlaying || !guitarSong.isPlaying()) {
    return hits;
  }

  let currentTime = guitarSong.currentTime();

  for (let note of guitarMidiNotes) {
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
      for (let note of GuitarMidinotes) {
        note.triggered = false;
      }
    }
  

