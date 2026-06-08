// --------------------------------------------------
// SWITCH LOGIC FILE
// Person 1 works on this file.
//
// This file controls:
// - where the bouncing objects are
// - how they move
// - which wall they hit
// - what audio action happens after a wall hit
//
// This file does NOT decide how the objects look.
// The visual appearance is handled in switchVisual.js.
// --------------------------------------------------


// --------------------------------------------------
// GLOBAL BOUNCER VARIABLES
// --------------------------------------------------

let bassTrackBouncer;
let drumTrackBouncer;
let guitarBouncer;
let vocalBouncer;

let synthSpheres = [];
const MAX_SYNTH_SPHERES = 5;
const SYNTH_NOTE_NAMES = ["B", "A", "F#", "E", "D"];
const SYNTH_MIDI_NOTES = [71, 69, 66, 64, 62];

let bounceBoxScale = 1.0;
const bounceBoxMinScale = 0.25;
const bounceBoxMaxScale = 1.0;
const bounceBounds = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  width: 0,
  height: 0
};

let sliderState = {
  x: 0,
  y: 0,
  width: 0,
  height: 10,
  knobX: 0,
  knobRadius: 16,
  dragging: false
};

let addSynthButton = {
  x: 0,
  y: 0,
  width: 150,
  height: 40
};

let removeSynthButton = {
  x: 0,
  y: 0,
  width: 150,
  height: 40
};

let bassReverb;
let drumReverb;
let stringsReverb;
let guitarReverb;
let vocalReverb;


// --------------------------------------------------
// SETUP BOUNCERS
// Called once from setup() in musicbrain.js.
// --------------------------------------------------

function setupBounceSwitchers() {
  bounceBoxScale = bounceBoxMaxScale;
  updateBounceBounds();
  updateUIGeometry();
  setupInstrumentReverbs();

  bassTrackBouncer = new WallSwitchBouncer(
    width * 0.2,
    height * 0.3,
    46,
    0.75,
    0.55,
    "bassTrack"
  );

  drumTrackBouncer = new WallSwitchBouncer(
    width * 0.8,
    height * 0.3,
    46,
    -0.35,
    0.28,
    "drumTrack"
  );

  guitarBouncer = new WallSwitchBouncer(
    width * 0.35,
    height * 0.78,
    42,
    0.62,
    -0.45,
    "guitar"
  );

  vocalBouncer = new WallSwitchBouncer(
    width * 0.5,
    height * 0.72,
    42,
    0.52,
    -0.38,
    "vocal"
  );

  synthSpheres = [];
}


// --------------------------------------------------
// UPDATE BOUNCERS
// Called every frame from draw() in musicbrain.js.
// --------------------------------------------------

function updateBounceSwitchers() {
  updateBounceBounds();
  updateUIGeometry();

  if (bassTrackBouncer) bassTrackBouncer.update();
  if (drumTrackBouncer) drumTrackBouncer.update();
  if (guitarBouncer) guitarBouncer.update();
  if (vocalBouncer) vocalBouncer.update();

  updateSynthSpheres();
}


// --------------------------------------------------
// DRAW BOUNCERS
//
// This function stays here only as a bridge.
// The actual drawing is done by switchVisual.js.
// --------------------------------------------------

function drawBounceSwitchers() {
  if (typeof drawOneBounceSwitcher !== "function") {
    return;
  }

  if (bassTrackBouncer) drawOneBounceSwitcher(bassTrackBouncer);
  if (drumTrackBouncer) drawOneBounceSwitcher(drumTrackBouncer);
  if (guitarBouncer) drawOneBounceSwitcher(guitarBouncer);
  if (vocalBouncer) drawOneBounceSwitcher(vocalBouncer);

  drawSynthSpheres();
  drawBounceBounds();
  drawBounceUI();
}


// --------------------------------------------------
// SAFE ACTION WRAPPER
//
// If one audio function breaks, the whole sketch does not crash.
// --------------------------------------------------

function safeBounceAction(label, actionFunction) {
  try {
    actionFunction();
  } catch (error) {
    console.error("Bounce action crashed:", label, error);
  }
}


function safeInstrumentProcess(reverb, source) {
  try {
    if (reverb && typeof reverb.process === "function") {
      reverb.process(source, 3, 2);
    }
  } catch (error) {
    console.warn("Unable to connect source to reverb", error);
  }
}


function safeSetDrywet(reverb, amount) {
  try {
    if (reverb && typeof reverb.drywet === "function") {
      reverb.drywet(amount);
    }
  } catch (error) {
    console.warn("Unable to set reverb wet/dry", error);
  }
}


// --------------------------------------------------
// WALL SWITCH BOUNCER CLASS
//
// This class only handles:
// - position
// - velocity
// - wall collision
// - audio action
//
// It does NOT draw the object.
// --------------------------------------------------

class WallSwitchBouncer {
  constructor(x, y, size, speedX, speedY, type) {
    this.x = x;
    this.y = y;

    this.size = size;

    this.speedX = speedX;
    this.speedY = speedY;

    this.type = type;

    this.flash = 0;
    this.hitCooldown = 0;

    this.lastActionText = getBounceStartText(type);
  }


  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.hitCooldown > 0) {
      this.hitCooldown--;
    }

    if (this.x - this.size / 2 < bounceBounds.left) {
      this.x = bounceBounds.left + this.size / 2;
      this.speedX *= -1;
      this.handleWallHit("left");
    }

    if (this.x + this.size / 2 > bounceBounds.right) {
      this.x = bounceBounds.right - this.size / 2;
      this.speedX *= -1;
      this.handleWallHit("right");
    }

    if (this.y - this.size / 2 < bounceBounds.top) {
      this.y = bounceBounds.top + this.size / 2;
      this.speedY *= -1;
      this.handleWallHit("top");
    }

    if (this.y + this.size / 2 > bounceBounds.bottom) {
      this.y = bounceBounds.bottom - this.size / 2;
      this.speedY *= -1;
      this.handleWallHit("bottom");
    }

    this.applyAudioMix();
    this.flash *= 0.88;
  }


  handleWallHit(wall) {
    if (this.hitCooldown > 0) {
      return;
    }

    // Skip audio action if bouncer is muted
    if (this.isCurrentlyMuted()) {
      this.flash = 40;
      this.hitCooldown = 45;
      return;
    }

    this.flash = 80;

    if (this.type === "bassTrack") {
      this.handleBassTrackWall(wall);
    }

    if (this.type === "drumTrack") {
      this.handleDrumTrackWall(wall);
    }

    if (this.type === "guitar") {
      this.handleGuitarWall(wall);
    }

    if (this.type === "vocal") {
      this.handleVocalWall(wall);
    }

    if (this.type === "synth") {
      this.handleSynthWall(wall);
    }

    this.hitCooldown = 45;
  }

  isCurrentlyMuted() {
    if (this.type === "bassTrack" && typeof bassMuted !== "undefined") {
      return bassMuted;
    }
    if (this.type === "drumTrack" && typeof drumMuted !== "undefined") {
      return drumMuted;
    }
    if (this.type === "guitar" && typeof guitarMuted !== "undefined") {
      return guitarMuted;
    }
    if (this.type === "vocal") {
      return areAllVocalsMuted();
    }
    return false;
  }


  applyAudioMix() {
    const pan = getBouncePan(this.x);
    const amount = getBounceReverbAmount(this.x, this.y);

    if (this.type === "bassTrack") {
      setInstrumentPan("bassTrack", pan);
      setInstrumentReverb("bassTrack", amount);
      return;
    }

    if (this.type === "drumTrack") {
      setInstrumentPan("drumTrack", pan);
      setInstrumentReverb("drumTrack", amount);
      return;
    }

    if (this.type === "guitar") {
      setInstrumentPan("guitar", pan);
      setInstrumentReverb("guitar", amount);
      return;
    }

    if (this.type === "vocal") {
      setInstrumentPan("vocal", pan);
      setInstrumentReverb("vocal", amount);
      return;
    }
  }


  // --------------------------------------------------
  // BASS TRACK
  // left   = Bass 1
  // top    = Bass 2
  // right  = Bass 3
  // bottom = Bass 4
  // --------------------------------------------------

  handleBassTrackWall(wall) {
    let track = wallToFourTrack(wall);

    safeBounceAction("switch bass track", function() {
      if (typeof switchBassTrack === "function") {
        switchBassTrack(track);
      }
    });

    this.lastActionText = "Bass " + (track + 1);
  }


  // --------------------------------------------------
  // DRUM TRACK
  // left   = Drum 1
  // top    = Drum 2
  // right  = Drum 3
  // bottom = Drum 4
  // --------------------------------------------------

  handleDrumTrackWall(wall) {
    let track = wallToFourTrack(wall);

    safeBounceAction("switch drum track", function() {
      if (typeof switchDrumTrack === "function") {
        switchDrumTrack(track);
      }
    });

    this.lastActionText = "Drum " + (track + 1);
  }


  // --------------------------------------------------
  // GUITAR MUTE
  // top/left   = Guitar Off
  // right/bottom = Guitar On
  // --------------------------------------------------

  handleGuitarWall(wall) {
    if (wall === "left" || wall === "top") {
      safeBounceAction("mute guitar", function() {
        if (typeof muteGuitar === "function") {
          muteGuitar();
        }
      });

      this.lastActionText = "Guitar On/Off";
      return;
    }

    if (wall === "right" || wall === "bottom") {
      safeBounceAction("unmute guitar", function() {
        if (typeof unmuteGuitar === "function") {
          unmuteGuitar();
        }
      });

      this.lastActionText = "Guitar On/Off";
    }
  }


  // --------------------------------------------------
  // VOCAL CONTROL
  // left   = Vocal 1 only
  // top    = Vocal 2 only
  // right  = Vocal 3 only
  // bottom = Vocals Off
  // --------------------------------------------------

  handleVocalWall(wall) {
    if (wall === "left") {
      safeBounceAction("vocal 1 only", function() {
        turnOnOnlyVocal(0);
      });
      this.lastActionText = "Vocal 1";
      return;
    }

    if (wall === "top") {
      safeBounceAction("vocal 2 only", function() {
        turnOnOnlyVocal(1);
      });
      this.lastActionText = "Vocal 2";
      return;
    }

    if (wall === "right") {
      safeBounceAction("vocal 3 only", function() {
        turnOnOnlyVocal(2);
      });
      this.lastActionText = "Vocal 3";
      return;
    }

    // Bottom wall does not change vocals in this version.
  }


  // --------------------------------------------------
  // SYNTH CONTROL
  // left/top      = F#
  // right/bottom  = B
  // --------------------------------------------------

  handleSynthWall(wall) {
    if (wall === "left" || wall === "top") {
      safeBounceAction("set synth F#", function() {
        setSynthNoteSafe(0, 66);
      });
      this.lastActionText = "Synth F#";
    } else if (wall === "right" || wall === "bottom") {
      safeBounceAction("set synth B", function() {
        setSynthNoteSafe(1, 71);
      });
      this.lastActionText = "Synth B";
    }

    safeBounceAction("play synth note", function() {
      if (typeof playSynthNote === "function") {
        playSynthNote();
      }
    });
  }
}


// --------------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------------

function pointInRect(mx, my, rect) {
  return (
    mx >= rect.x &&
    mx <= rect.x + rect.width &&
    my >= rect.y &&
    my <= rect.y + rect.height
  );
}


function isPointOnSlider(mx, my) {
  return (
    mx >= sliderState.x - 20 &&
    mx <= sliderState.x + sliderState.width + 20 &&
    my >= sliderState.y - 20 &&
    my <= sliderState.y + sliderState.height + 20
  );
}


function handleBounceClick(mx, my) {
  if (pointInRect(mx, my, addSynthButton)) {
    addSynthSphere();
    return true;
  }

  if (pointInRect(mx, my, removeSynthButton)) {
    removeSynthSphere();
    return true;
  }

  if (isPointOnSlider(mx, my)) {
    sliderState.dragging = true;
    handleBounceDrag(mx, my);
    return true;
  }

  if (
    clickBounceObject(bassTrackBouncer, mx, my) ||
    clickBounceObject(drumTrackBouncer, mx, my) ||
    clickBounceObject(guitarBouncer, mx, my) ||
    clickBounceObject(vocalBouncer, mx, my)
  ) {
    return true;
  }

  return false;
}


function clickBounceObject(bouncer, mx, my) {
  if (!bouncer) {
    return false;
  }

  const distance = dist(mx, my, bouncer.x, bouncer.y);
  if (distance <= bouncer.size * 0.55) {
    toggleInstrumentMute(bouncer.type);
    return true;
  }

  return false;
}


function toggleInstrumentMute(type) {
  if (type === "bassTrack") {
    if (typeof bassMuted !== "undefined" && bassMuted) {
      if (typeof switchBassTrack === "function") {
        switchBassTrack(activeBassTrack || 0);
      }
    } else if (typeof muteBass === "function") {
      muteBass();
    }
    return;
  }

  if (type === "drumTrack") {
    if (typeof drumMuted !== "undefined" && drumMuted) {
      if (typeof switchDrumTrack === "function") {
        switchDrumTrack(activeDrumTrack || 0);
      }
    } else if (typeof muteDrum === "function") {
      muteDrum();
    }
    return;
  }

  if (type === "guitar") {
    if (typeof guitarMuted !== "undefined" && guitarMuted) {
      if (typeof unmuteGuitar === "function") {
        unmuteGuitar();
      }
    } else if (typeof muteGuitar === "function") {
      muteGuitar();
    }
    return;
  }

  if (type === "vocal") {
    if (!areAllVocalsMuted()) {
      if (typeof muteAllVocals === "function") {
        muteAllVocals();
      }
    } else if (typeof unmuteAllVocals === "function") {
      unmuteAllVocals();
    }
    return;
  }
}


function areAllVocalsMuted() {
  if (typeof vocalMuted === "undefined" || !Array.isArray(vocalMuted)) {
    return true;
  }

  for (let i = 0; i < vocalMuted.length; i++) {
    if (!vocalMuted[i]) {
      return false;
    }
  }

  return true;
}


function handleBounceDrag(mx, my) {
  const normalized = map(
    mx,
    sliderState.x,
    sliderState.x + sliderState.width,
    bounceBoxMinScale,
    bounceBoxMaxScale,
    true
  );

  bounceBoxScale = constrain(normalized, bounceBoxMinScale, bounceBoxMaxScale);
  updateBounceBounds();
  updateUIGeometry();
}


function mouseDragged() {
  if (sliderState.dragging) {
    handleBounceDrag(mouseX, mouseY);
  }
}


function mouseReleased() {
  sliderState.dragging = false;
}


function updateBounceBounds() {
  bounceBounds.width = width * bounceBoxScale;
  bounceBounds.height = height * bounceBoxScale;
  bounceBounds.left = (width - bounceBounds.width) / 2;
  bounceBounds.top = (height - bounceBounds.height) / 2;
  bounceBounds.right = bounceBounds.left + bounceBounds.width;
  bounceBounds.bottom = bounceBounds.top + bounceBounds.height;
}


function updateUIGeometry() {
  sliderState.width = min(420, width * 0.44);
  sliderState.height = 10;
  sliderState.x = width * 0.08;
  sliderState.y = height - 84;
  sliderState.knobX = map(
    bounceBoxScale,
    bounceBoxMinScale,
    bounceBoxMaxScale,
    sliderState.x,
    sliderState.x + sliderState.width
  );

  addSynthButton.x = width - addSynthButton.width - 40;
  addSynthButton.y = height - 76;

  removeSynthButton.x = addSynthButton.x;
  removeSynthButton.y = addSynthButton.y + addSynthButton.height + 14;
}


function drawBounceBounds() {
  push();
  noFill();
  stroke(200, 190);
  strokeWeight(3);
  rect(
    bounceBounds.left,
    bounceBounds.top,
    bounceBounds.width,
    bounceBounds.height
  );
  pop();
}


function drawBounceUI() {
  push();

  noStroke();
  fill(255, 220);
  textAlign(LEFT, CENTER);
  textSize(12);
  text("Movement zone", sliderState.x, sliderState.y - 18);

  fill(120, 120, 130, 180);
  rect(
    sliderState.x,
    sliderState.y,
    sliderState.width,
    sliderState.height,
    4
  );

  fill(255);
  circle(
    sliderState.knobX,
    sliderState.y + sliderState.height / 2,
    sliderState.knobRadius * 2
  );

  textAlign(LEFT, CENTER);
  text(
    "Zone size " + nf(bounceBoxScale * 100, 0, 0) + "%",
    sliderState.x + sliderState.width + 18,
    sliderState.y + sliderState.height / 2
  );

  const buttonColor = synthSpheres.length < MAX_SYNTH_SPHERES
    ? [40, 190, 255]
    : [100, 100, 120];

  fill(buttonColor[0], buttonColor[1], buttonColor[2], 220);
  rect(
    addSynthButton.x,
    addSynthButton.y,
    addSynthButton.width,
    addSynthButton.height,
    8
  );

  fill(255);
  textAlign(CENTER, CENTER);
  const addButtonCenterX = addSynthButton.x + addSynthButton.width / 2;
  text("ADD SYNTH NOTES", addButtonCenterX, addSynthButton.y - 6);
  text(
    synthSpheres.length + " / " + MAX_SYNTH_SPHERES,
    addButtonCenterX,
    addSynthButton.y + 14
  );

  const removeColor = synthSpheres.length > 0
    ? [255, 120, 90]
    : [120, 120, 130];

  fill(removeColor[0], removeColor[1], removeColor[2], 220);
  rect(
    removeSynthButton.x,
    removeSynthButton.y,
    removeSynthButton.width,
    removeSynthButton.height,
    8
  );

  fill(255);
  text("REMOVE SYNTH NOTES", removeSynthButton.x + removeSynthButton.width / 2, removeSynthButton.y - 6);
  text(
    synthSpheres.length > 0 ? "Remove last note" : "No notes to remove",
    removeSynthButton.x + removeSynthButton.width / 2,
    removeSynthButton.y + 14
  );

  pop();
}


function drawSynthSpheres() {
  for (let sphere of synthSpheres) {
    push();
    translate(sphere.x, sphere.y);

    noStroke();
    fill(80, 240, 255, 210);
    circle(0, 0, sphere.size);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(SYNTH_NOTE_NAMES[sphere.noteIndex], 0, 0);
    pop();

    if (sphere.lastActionText) {
      push();
      noStroke();
      fill(255, 220);
      textAlign(CENTER, CENTER);
      textSize(11);
      text(sphere.lastActionText, sphere.x, sphere.y + sphere.size * 0.75);
      pop();
    }
  }
}


function updateSynthSpheres() {
  for (let sphere of synthSpheres) {
    sphere.x += sphere.speedX;
    sphere.y += sphere.speedY;

    if (sphere.hitCooldown > 0) {
      sphere.hitCooldown--;
    }

    let wallHit = "";

    if (sphere.x - sphere.size / 2 <= bounceBounds.left) {
      sphere.x = bounceBounds.left + sphere.size / 2;
      sphere.speedX *= -1;
      wallHit = "left";
    }

    if (sphere.x + sphere.size / 2 >= bounceBounds.right) {
      sphere.x = bounceBounds.right - sphere.size / 2;
      sphere.speedX *= -1;
      wallHit = "right";
    }

    if (sphere.y - sphere.size / 2 <= bounceBounds.top) {
      sphere.y = bounceBounds.top + sphere.size / 2;
      sphere.speedY *= -1;
      wallHit = "top";
    }

    if (sphere.y + sphere.size / 2 >= bounceBounds.bottom) {
      sphere.y = bounceBounds.bottom - sphere.size / 2;
      sphere.speedY *= -1;
      wallHit = "bottom";
    }

    if (wallHit !== "" && sphere.hitCooldown <= 0) {
      handleSynthSphereWall(sphere, wallHit);
      sphere.hitCooldown = 18;
    }
  }
}


function handleSynthSphereWall(sphere, wall) {
  const pan = getBouncePan(sphere.x);
  const amount = getBounceReverbAmount(sphere.x, sphere.y);
  const noteIndex = constrain(sphere.noteIndex, 0, SYNTH_MIDI_NOTES.length - 1);
  const midiNumber = SYNTH_MIDI_NOTES[noteIndex];

  setInstrumentPan("synth", pan);
  setInstrumentReverb("synth", amount);

  if (typeof setSynthMidiNote === "function") {
    setSynthMidiNote(midiNumber);
  }

  if (typeof playSynthNote === "function") {
    playSynthNote();
  }

  sphere.lastActionText = "Synth " + SYNTH_NOTE_NAMES[noteIndex];
}


function addSynthSphere() {
  if (synthSpheres.length >= MAX_SYNTH_SPHERES) {
    return;
  }

  const radius = 22;
  const x = random(
    bounceBounds.left + radius,
    bounceBounds.right - radius
  );
  const y = random(
    bounceBounds.top + radius,
    bounceBounds.bottom - radius
  );

  synthSpheres.push({
    x,
    y,
    size: radius * 2,
    speedX: random(1.3, 2.5) * (random() > 0.5 ? 1 : -1),
    speedY: random(1.1, 2.4) * (random() > 0.5 ? 1 : -1),
    noteIndex: synthSpheres.length % SYNTH_NOTE_NAMES.length,
    hitCooldown: 18,
    lastActionText: ""
  });
}


function removeSynthSphere() {
  if (synthSpheres.length === 0) {
    return;
  }

  synthSpheres.pop();
}


function setupInstrumentReverbs() {
  if (typeof bassSongs !== "undefined" && bassSongs.length) {
    bassReverb = new p5.Reverb();
    for (let song of bassSongs) {
      if (song && typeof song.pan === "function") {
        safeInstrumentProcess(bassReverb, song);
      }
    }
    bassReverb.set(3, 2, false);
    bassReverb.drywet(0.5);
  }

  if (typeof drumSongs !== "undefined" && drumSongs.length) {
    drumReverb = new p5.Reverb();
    for (let song of drumSongs) {
      if (song && typeof song.pan === "function") {
        safeInstrumentProcess(drumReverb, song);
      }
    }
    drumReverb.set(3, 2, false);
    drumReverb.drywet(0.5);
  }

  if (typeof stringsSongs !== "undefined" && stringsSongs.length) {
    stringsReverb = new p5.Reverb();
    for (let song of stringsSongs) {
      if (song && typeof song.pan === "function") {
        safeInstrumentProcess(stringsReverb, song);
      }
    }
    stringsReverb.set(3, 2, false);
    stringsReverb.drywet(0.5);
  }

  if (typeof guitarSongs !== "undefined") {
    guitarReverb = new p5.Reverb();
    if (guitarSongs && typeof guitarSongs.pan === "function") {
      safeInstrumentProcess(guitarReverb, guitarSongs);
    }
    guitarReverb.set(3, 2, false);
    guitarReverb.drywet(0.5);
  }

  if (typeof vocalSounds !== "undefined" && vocalSounds.length) {
    vocalReverb = new p5.Reverb();
    if (typeof vocalSoundFiles !== "undefined" && vocalSoundFiles.length) {
      for (let sound of vocalSoundFiles) {
        if (sound && typeof sound.pan === "function") {
          safeInstrumentProcess(vocalReverb, sound);
        }
      }
    }
    vocalReverb.set(3, 2, false);
    vocalReverb.drywet(0.5);
  }
}


function setInstrumentPan(type, pan) {
  try {
    if (type === "bassTrack" && typeof bassSongs !== "undefined") {
      for (let song of bassSongs) {
        if (song && typeof song.pan === "function") {
          song.pan(pan);
        }
      }
      return;
    }

    if (type === "drumTrack" && typeof drumSongs !== "undefined") {
      for (let song of drumSongs) {
        if (song && typeof song.pan === "function") {
          song.pan(pan);
        }
      }
      return;
    }

    if (type === "strings" && typeof stringsSongs !== "undefined") {
      for (let song of stringsSongs) {
        if (song && typeof song.pan === "function") {
          song.pan(pan);
        }
      }
      return;
    }

    if (type === "guitar" && typeof guitarSongs !== "undefined") {
      if (guitarSongs && typeof guitarSongs.pan === "function") {
        guitarSongs.pan(pan);
      }
      return;
    }

    if (type === "vocal" && typeof vocalSounds !== "undefined") {
      for (let sound of vocalSounds) {
        if (sound && typeof sound.pan === "function") {
          sound.pan(pan);
        }
      }
      if (typeof vocalSoundFiles !== "undefined") {
        for (let soundFile of vocalSoundFiles) {
          if (soundFile && typeof soundFile.pan === "function") {
            soundFile.pan(pan);
          }
        }
      }
      return;
    }

    if (type === "synth" && typeof synth !== "undefined") {
      if (typeof synth.pan === "function") {
        synth.pan(pan);
      }
    }
  } catch (error) {
    console.warn("Unable to set instrument pan", type, error);
  }
}


function setInstrumentReverb(type, amount) {
  if (type === "bassTrack") {
    safeSetDrywet(bassReverb, amount);
    return;
  }

  if (type === "drumTrack") {
    safeSetDrywet(drumReverb, amount);
    return;
  }

  if (type === "strings") {
    safeSetDrywet(stringsReverb, amount);
    return;
  }

  if (type === "guitar") {
    safeSetDrywet(guitarReverb, amount);
    return;
  }

  if (type === "vocal") {
    safeSetDrywet(vocalReverb, amount);
    return;
  }

  if (type === "synth") {
    safeSetDrywet(synthReverb, amount);
  }
}


function getBouncePan(x) {
  if (width <= 0) {
    return 0;
  }

  return constrain(
    map(x, 0, width, -1, 1),
    -1,
    1
  );
}


function getBounceReverbAmount(x, y) {
  const centerX = width / 2;
  const centerY = height / 2;
  const distance = dist(x, y, centerX, centerY);
  const maxDistance = dist(centerX, centerY, 0, 0);

  if (maxDistance <= 0) {
    return 0;
  }

  return constrain(distance / maxDistance, 0, 1);
}


function getBounceStartText(type) {
  if (type === "bassTrack") return "Bass Track";
  if (type === "drumTrack") return "Drum Track";
  if (type === "guitar") return "Guitar";
  if (type === "vocal") return "Vocals";
  return "";
}


function wallToFourTrack(wall) {
  if (wall === "right") return 0;
  if (wall === "bottom") return 1;
  if (wall === "top") return 2;
  if (wall === "left") return 3;

  return 0;
}


function turnOnOnlyVocal(index) {
  if (typeof muteAllVocals === "function") {
    muteAllVocals();
  }

  if (typeof unmuteVocal === "function") {
    unmuteVocal(index);
  }
}


function setSynthNoteSafe(index, midiNumber) {
  if (typeof setSynthNote === "function") {
    setSynthNote(index);
    return;
  }

  if (typeof setSynthMidiNote === "function") {
    setSynthMidiNote(midiNumber);
    return;
  }

  console.log("No synth note setter found");
}