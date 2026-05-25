
let GuitarSongs = [];
let GuitarMidiTracks = [];

let activeGuitarTrack = 0;
let GuitarIsPlaying = false;
let GuitarMuted = false;

let GuitarBPM = 160;
let GuitarFadeTime = 0.05;

function preload() {
  // Load WAV audio files
  GuitarSounds = loadSound("assets/Guitar/Guitar.wav");
}

// idk what happened but the tempo wasnt being set in the midi files so i just hardcoded it here, it should be 160 bpm for all of them
let bpm = 160;
let secondsPerBeat = 60 / bpm; 

function setup() {
  createCanvas(800, 600);

  // Load MIDI files
  loadMidiFile("assets/Guitar/Guitar.mid");
}


//--------------------------------------------------
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
    .catch(function(error) {
      console.error("Error loading MIDI file:", error);
    });
}


// --------------------------------------------------
// FORCE MIDI TIMING TO 160 BPM
// --------------------------------------------------

function guitarTicksToSeconds(ticks, ppq, bpm) {
  let beats = ticks / ppq;
  return beats * (60 / bpm);
}


// --------------------------------------------------
// RETURN NEW NOTES FROM THE ACTIVE GUITAR TRACK
// --------------------------------------------------

function getActiveGuitarHits() {
  let hits = [];

  if (GuitarMuted) {
    return hits;
  }

  if (!GuitarMidiTracks[activeGuitarTrack]) {
    return hits;
  }

  if (!GuitarSongs[activeGuitarTrack].isPlaying()) {
    return hits;
  }

  let currentTime = GuitarSongs[activeGuitarTrack].currentTime();

  for (let note of GuitarMidiTracks[activeGuitarTrack].notes) {
    if (!note.triggered && currentTime >= note.time) {
      note.triggered = true;
      hits.push(note);
    }
  }

  return hits;
}


// --------------------------------------------------
// PLAY CURRENT GUITAR TRACK FROM THE START
// --------------------------------------------------

function playGuitar() {
  stopAllGuitarAudio();
  resetGuitarMidiTriggers(activeGuitarTrack);

  GuitarSongs[activeGuitarTrack].setVolume(1);
  GuitarSongs[activeGuitarTrack].play();

  GuitarIsPlaying = true;

  if (!GuitarMuted) {
    GuitarSongs[activeGuitarTrack].setVolume(1);
    GuitarSongs[activeGuitarTrack].play();
  }
}


// --------------------------------------------------
// PAUSE CURRENT GUITAR TRACK
// --------------------------------------------------

function pauseGuitar() {
  if (GuitarSongs[activeGuitarTrack].isPlaying()) {
    GuitarSongs[activeGuitarTrack].pause();
  }

  GuitarIsPlaying = false;
}


function muteGuitar() {
  GuitarMuted = true;

  let oldSong = GuitarSongs[activeGuitarTrack];

  if (oldSong && oldSong.isPlaying()) {
    oldSong.setVolume(0, GuitarFadeTime);

    setTimeout(function() {
      if (GuitarMuted) {
        oldSong.stop();
        oldSong.setVolume(1);
      }
    }, GuitarFadeTime * 1000 + 10);
  }
}

// --------------------------------------------------
// SWITCH TRACK WITH CROSSFADE
// --------------------------------------------------

function switchGuitarTrack(newTrack) {
  if (newTrack === activeGuitarTrack) {
    return;
  }
    let currentTime= 0;

   if (GuitarMuted && GuitarSongs[activeGuitarTrack] && GuitarSongs[activeGuitarTrack].isPlaying()) {
    currentTime = GuitarSongs[activeGuitarTrack].currentTime();
  } else if (BassSongs[activeBassTrack]) {
    currentTime = BassSongs[activeBassTrack].currentTime();
  }

  let oldSong = GuitarSongs[activeGuitarTrack];
  let newSong = GuitarSongs[newTrack];

  let wasPlaying = GuitarIsPlaying;


  activeGuitarTrack = newTrack;

  resetGuitarMidiTriggers(activeGuitarTrack);
  syncGuitarMidiToCurrentTime(activeGuitarTrack, currentTime);

  if (wasPlaying) {
    newSong.stop();
    newSong.setVolume(0);
    newSong.play(0, 1, 0, currentTime);

    newSong.setVolume(1, guitarFadeTime);
    oldSong.setVolume(0, guitarFadeTime);

    setTimeout(function() {
      if (oldSong !== GuitarSongs[activeGuitarTrack]) {
        oldSong.stop();
        oldSong.setVolume(1);
      }
    }, guitarFadeTime * 1000 + 10);
  }
}


// --------------------------------------------------
// STOP ALL GUITAR AUDIO
// --------------------------------------------------

function stopAllGuitarAudio() {
  for (let song of GuitarSongs) {
    if (song) {
      song.stop();
      song.setVolume(1);
    }
  }
}


// --------------------------------------------------
// RESET MIDI TRIGGERS
// --------------------------------------------------

function resetGuitarMidiTriggers(trackIndex) {
  if (!GuitarMidiTracks[trackIndex]) {
    return;
  }

  for (let note of GuitarMidiTracks[trackIndex].notes) {
    note.triggered = false;
  }
}


// --------------------------------------------------
// SKIP NOTES THAT HAPPENED BEFORE A TRACK SWITCH
// --------------------------------------------------

function syncGuitarMidiToCurrentTime(trackIndex, currentTime) {
  if (!GuitarMidiTracks[trackIndex]) {
    return;
  }

  for (let note of GuitarMidiTracks[trackIndex].notes) {
    note.triggered = note.time < currentTime;
  }
}