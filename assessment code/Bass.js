// --------------------------------------------------
// BASS INPUTS
// Four bass tracks that switch with keys 1, 2, 3, 4
// --------------------------------------------------

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
// RETURN NEW NOTES FROM THE ACTIVE BASS TRACK
// --------------------------------------------------

function getActiveBassHits() {
  let hits = [];

  if (bassMuted) {
    return hits;
  }
  if (!bassMidiTracks[activeBassTrack]) {
    return hits;
  }

  if (!bassSongs[activeBassTrack].isPlaying()) {
    return hits;
  }

  let currentTime = bassSongs[activeBassTrack].currentTime();

  for (let note of bassMidiTracks[activeBassTrack].notes) {
    if (!note.triggered && currentTime >= note.time) {
      note.triggered = true;
      hits.push(note);
    }
  }

  return hits;
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
  if (bassSongs[activeBassTrack] && bassSongs[activeBassTrack].isPlaying()) {
    return bassSongs[activeBassTrack].currentTime();
  }

  return 0;
}

// silly me forgot that it has to mute as well play nothign 
// --------------------------------------------------
// --- mute CURRENT BASS TRACK-- 

function muteBass() {
  bassMuted = true;

  let oldSong = bassSongs[activeBassTrack];

  if (oldSong && oldSong.isPlaying()) {
    oldSong.setVolume(0, bassFadeTime);

    setTimeout(function() {
      if (bassMuted) {
        oldSong.stop();
        oldSong.setVolume(1);
      }
    }, bassFadeTime * 1000 + 10);
  }
}

// --------------------------------------------------
// PAUSE CURRENT BASS TRACK
// --------------------------------------------------

function pauseBass() {
  if (bassSongs[activeBassTrack].isPlaying()) {
    bassSongs[activeBassTrack].pause();
  }

  bassIsPlaying = false;
}


// --------------------------------------------------
// SWITCH TRACK WITH CROSSFADE
// --------------------------------------------------

function switchBassTrack(newTrack) {
  if (newTrack === activeBassTrack) {
    return;
  }

  let currentTime = 0;

  if (bassMuted && bassSongs[activeBassTrack] && bassSongs[activeBassTrack].isPlaying()) {
    currentTime = bassSongs[activeBassTrack].currentTime();
  } else if (GuitarSongs[activeGuitarTrack]) {
    currentTime = GuitarSongs[activeGuitarTrack].currentTime();
  }

  let oldSong = bassSongs[activeBassTrack];
  let newSong = bassSongs[newTrack];

  let wasPlaying = bassIsPlaying;

  activeBassTrack = newTrack;
  bassMuted = false;

  resetBassMidiTriggers(activeBassTrack);
  syncBassMidiToCurrentTime(activeBassTrack, currentTime);

  if (wasPlaying) {
    newSong.stop();
    newSong.setVolume(0);
    newSong.play(0, 1, 0, currentTime);

    newSong.setVolume(1, bassFadeTime);
    oldSong.setVolume(0, bassFadeTime);

    setTimeout(function() {
      if (oldSong !== bassSongs[activeBassTrack]) {
        oldSong.stop();
        oldSong.setVolume(1);
      }
    }, bassFadeTime * 1000 + 10);
  }
}


// --------------------------------------------------
// STOP ALL BASS AUDIO
// --------------------------------------------------

function stopAllBassAudio() {
  for (let song of bassSongs) {
    if (song) {
      song.stop();
      song.setVolume(1);
    }
  }
}


// --------------------------------------------------
// RESET MIDI TRIGGERS
// --------------------------------------------------

function resetBassMidiTriggers(trackIndex) {
  if (!bassMidiTracks[trackIndex]) {
    return;
  }

  for (let note of bassMidiTracks[trackIndex].notes) {
    note.triggered = false;
  }
}


// --------------------------------------------------
// SKIP NOTES THAT HAPPENED BEFORE A TRACK SWITCH
// --------------------------------------------------

function syncBassMidiToCurrentTime(trackIndex, currentTime) {
  if (!bassMidiTracks[trackIndex]) {
    return;
  }

  for (let note of bassMidiTracks[trackIndex].notes) {
    note.triggered = note.time < currentTime;
  }
}