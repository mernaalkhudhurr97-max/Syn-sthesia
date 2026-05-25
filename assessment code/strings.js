




let StringsSounds = [];
let allMidiNotes = [];
let midiData;

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

/ --------------------------------------------------
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
    .catch(function(error) {
      console.error("Error loading MIDI file:", error);
    });
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
// PLAY CURRENT BASS TRACK FROM THE START
// --------------------------------------------------

function playBass() {
  stopAllBassAudio();
  resetBassMidiTriggers(activeBassTrack);

  bassSongs[activeBassTrack].setVolume(1);
  bassSongs[activeBassTrack].play();

  bassIsPlaying = true;
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

  let oldSong = bassSongs[activeBassTrack];
  let newSong = bassSongs[newTrack];

  let currentTime = oldSong.currentTime();
  let wasPlaying = bassIsPlaying;

  activeBassTrack = newTrack;

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