

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

      DrumMidiTracks[index] = {
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

function drumTicksToSeconds(ticks, ppq, bpm) {
  let beats = ticks / ppq;
  return beats * (60 / bpm);
}


// --------------------------------------------------
// RETURN NEW NOTES FROM THE ACTIVE DRUM TRACK
// --------------------------------------------------

function getActiveDrumHits() {
  let hits = [];

  if (DrumMuted) {
    return hits;
  }

  if (!DrumMidiTracks[activeDrumTrack]) {
    return hits;
  }

  if (!DrumSongs[activeDrumTrack].isPlaying()) {
    return hits;
  }

  let currentTime = DrumSongs[activeDrumTrack].currentTime();

  for (let note of DrumMidiTracks[activeDrumTrack].notes) {
    if (!note.triggered && currentTime >= note.time) {
      note.triggered = true;
      hits.push(note);
    }
  }

  return hits;
}


// --------------------------------------------------
// PLAY CURRENT DRUM TRACK FROM THE START
// --------------------------------------------------

function playDrum() {
  stopAllDrumAudio();
  resetDrumMidiTriggers(activeDrumTrack);

  DrumSongs[activeDrumTrack].setVolume(1);
  DrumSongs[activeDrumTrack].play();

  DrumIsPlaying = true;

  if (!DrumMuted) {
    DrumSongs[activeDrumTrack].setVolume(1);
    DrumSongs[activeDrumTrack].play();
  }
}


function muteDrum() {
  DrumMuted = true;

  let oldSong = DrumSongs[activeDrumTrack];

  if (oldSong && oldSong.isPlaying()) {
    oldSong.setVolume(0, DrumFadeTime);
    
    setTimeout(function() { 
      if (DrumMuted) {
        oldSong.stop();
        oldSong.setVolume(1);
      }
    }, DrumFadeTime * 1000 + 20);
  }
}

// --------------------------------------------------
// PAUSE CURRENT DRUM TRACK
// --------------------------------------------------

function pauseDrum() {
  if (DrumSongs[activeDrumTrack].isPlaying()) {
    DrumSongs[activeDrumTrack].pause();
  }

  DrumIsPlaying = false;
}


// --------------------------------------------------
// SWITCH TRACK WITH CROSSFADE before it clicked which was obvouis but didnt think about it beofre maybe do a longer cross fade time or something to make it more noticeable
// --------------------------------------------------

function switchDrumTrack(newTrack) {
  if (newTrack === activeDrumTrack) {
    return;
  }

  let currentTime = 0;

  if (DrumMuted && DrumSongs[activeDrumTrack] && DrumSongs[activeDrumTrack].isPlaying()) {
    currentTime = DrumSongs[activeDrumTrack].currentTime();
  } else if (BassSongs[activeBassTrack]) {
    currentTime = BassSongs[activeBassTrack].currentTime();
  }

  let oldSong = DrumSongs[activeDrumTrack];
  let newSong = DrumSongs[newTrack];

  
  let wasPlaying = DrumIsPlaying;

  activeDrumTrack = newTrack;

  resetDrumMidiTriggers(activeDrumTrack);
  syncDrumMidiToCurrentTime(activeDrumTrack, currentTime);

  if (wasPlaying) {
    newSong.stop();
    newSong.setVolume(0);
    newSong.play(0, 1, 0, currentTime);

    newSong.setVolume(1, drumFadeTime);
    oldSong.setVolume(0, drumFadeTime);

    setTimeout(function() {
      if (oldSong !== DrumSongs[activeDrumTrack]) {
        oldSong.stop();
        oldSong.setVolume(1);
      }
    }, drumFadeTime * 1000 + 20);
  }
}


// --------------------------------------------------
// STOP ALL DRUM AUDIO
// --------------------------------------------------

function stopAllDrumAudio() {
  for (let song of DrumSongs) {
    if (song) {
      song.stop();
      song.setVolume(1);
    }
  }
}


// --------------------------------------------------
// RESET MIDI TRIGGERS
// --------------------------------------------------

function resetDrumMidiTriggers(trackIndex) {
  if (!DrumMidiTracks[trackIndex]) {
    return;
  }

  for (let note of DrumMidiTracks[trackIndex].notes) {
    note.triggered = false;
  }
}


// --------------------------------------------------
// SKIP NOTES THAT HAPPENED BEFORE A TRACK SWITCH
// --------------------------------------------------

function syncDrumMidiToCurrentTime(trackIndex, currentTime) {
  if (!DrumMidiTracks[trackIndex]) {
    return;
  }

  for (let note of DrumMidiTracks[trackIndex].notes) {
    note.triggered = note.time < currentTime;
  }
}