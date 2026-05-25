


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
    .catch(function(error) {
      console.error("Error loading MIDI file:", error);
    });
}


// --------------------------------------------------
// FORCE MIDI TIMING TO 160 BPM
// --------------------------------------------------

function stringsTicksToSeconds(ticks, ppq, bpm) {
  let beats = ticks / ppq;
  return beats * (60 / bpm);
}


// --------------------------------------------------
// RETURN NEW NOTES FROM THE ACTIVE STRINGS TRACK
// --------------------------------------------------

function getActiveStringsHits() {
  let hits = [];

  if (stringsMuted) {
    return hits;
  }

  if (!StringsMidiTracks[activeStringsTrack]) {
    return hits;
  }

  if (!StringsSounds[activeStringsTrack].isPlaying()) {
    return hits;
  }

  let currentTime = StringsSounds[activeStringsTrack].currentTime();

  for (let note of StringsMidiTracks[activeStringsTrack].notes) {
    if (!note.triggered && currentTime >= note.time) {
      note.triggered = true;
      hits.push(note);
    }
  }

  return hits;
}


// --------------------------------------------------
// PLAY CURRENT STRINGS TRACK FROM THE START
// --------------------------------------------------

function playStrings() {
  stopAllStringsAudio();
  resetStringsMidiTriggers(activeStringsTrack);

  StringsSounds[activeStringsTrack].setVolume(1);
  StringsSounds[activeStringsTrack].play();

  stringsIsPlaying = true;

  if (!stringsMuted) { 
    StringsSounds[activeStringsTrack].setVolume(1);
    StringsSounds[activeStringsTrack].play();
  }
}


// --------------------------------------------------
// PAUSE CURRENT STRINGS TRACK
// --------------------------------------------------

function pauseStrings() {
  if (StringsSounds[activeStringsTrack].isPlaying()) {
    StringsSounds[activeStringsTrack].pause();
  }

  stringsIsPlaying = false;
}

//string muted function//

function muteStrings() {
  stringsMuted = true;

  let oldSong = StringsSounds[activeStringsTrack];

  if (oldSong && oldSong.isPlaying()) {
    oldSong.setVolume(0, stringsFadeTime);

    setTimeout(function() {
      if (stringsMuted) {
        oldSong.stop();
        oldSong.setVolume(1);
      }
    }, stringsFadeTime * 1000 + 10);
  }
}
// --------------------------------------------------
// SWITCH TRACK WITH CROSSFADE
// --------------------------------------------------

function switchStringsTrack(newTrack) {
  if (newTrack === activeStringsTrack) {
    return;
  }


  let currentTime = 0;

  if (bassMuted && guitarSong && guitarSong.isPlaying()) {
    currentTime = guitarSong.currentTime();
  } else if (bassSongs[activeBassTrack]) {
    currentTime = bassSongs[activeBassTrack].currentTime();
  }
  
  let oldSong = StringsSounds[activeStringsTrack];
  let newSong = StringsSounds[newTrack];

  
  let wasPlaying = stringsIsPlaying;

  activeStringsTrack = newTrack;

  resetStringsMidiTriggers(activeStringsTrack);
  syncStringsMidiToCurrentTime(activeStringsTrack, currentTime);

  if (wasPlaying) {
    newSong.stop();
    newSong.setVolume(0);
    newSong.play(0, 1, 0, currentTime);

    newSong.setVolume(1, stringsFadeTime);
    oldSong.setVolume(0, stringsFadeTime);

    setTimeout(function() {
      if (oldSong !== StringsSounds[activeStringsTrack]) {
        oldSong.stop();
        oldSong.setVolume(1);
      }
    }, stringsFadeTime * 1000 + 10);
  }
}


// --------------------------------------------------
// STOP ALL STRINGS AUDIO
// --------------------------------------------------

function stopAllStringsAudio() {
  for (let song of StringsSounds) {
    if (song) {
      song.stop();
      song.setVolume(1);
    }
  }
}


// --------------------------------------------------
// RESET MIDI TRIGGERS
// --------------------------------------------------

function resetStringsMidiTriggers(trackIndex) {
  if (!StringsMidiTracks[trackIndex]) {
    return;
  }

  for (let note of StringsMidiTracks[trackIndex].notes) {
    note.triggered = false;
  }
}


// --------------------------------------------------
// SKIP NOTES THAT HAPPENED BEFORE A TRACK SWITCH
// --------------------------------------------------

function syncStringsMidiToCurrentTime(trackIndex, currentTime) {
  if (!StringsMidiTracks[trackIndex]) {
    return;
  }

  for (let note of StringsMidiTracks[trackIndex].notes) {
    note.triggered = note.time < currentTime;
  }
}