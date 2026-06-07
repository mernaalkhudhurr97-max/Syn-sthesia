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
let bassMuteBouncer;

let drumTrackBouncer;
let drumMuteBouncer;

let guitarBouncer;
let vocalBouncer;
let synthBouncer;


// --------------------------------------------------
// SETUP BOUNCERS
// Called once from setup() in musicbrain.js.
// --------------------------------------------------

function setupBounceSwitchers() {
  bassTrackBouncer = new WallSwitchBouncer(
    width * 0.2,
    height * 0.3,
    46,
    0.75,
    0.55,
    "bassTrack"
  );

  bassMuteBouncer = new WallSwitchBouncer(
    width * 0.2,
    height * 0.65,
    30,
    0.55,
    -0.42,
    "bassMute"
  );

  drumTrackBouncer = new WallSwitchBouncer(
    width * 0.8,
    height * 0.3,
    46,
    -0.35,
    0.28,
    "drumTrack"
  );

  drumMuteBouncer = new WallSwitchBouncer(
    width * 0.8,
    height * 0.65,
    30,
    -0.28,
    -0.24,
    "drumMute"
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

  synthBouncer = new WallSwitchBouncer(
    width * 0.65,
    height * 0.78,
    42,
    -0.55,
    -0.42,
    "synth"
  );
}


// --------------------------------------------------
// UPDATE BOUNCERS
// Called every frame from draw() in musicbrain.js.
// --------------------------------------------------

function updateBounceSwitchers() {
  if (bassTrackBouncer) bassTrackBouncer.update();
  if (bassMuteBouncer) bassMuteBouncer.update();

  if (drumTrackBouncer) drumTrackBouncer.update();
  if (drumMuteBouncer) drumMuteBouncer.update();

  if (guitarBouncer) guitarBouncer.update();
  if (vocalBouncer) vocalBouncer.update();
  if (synthBouncer) synthBouncer.update();
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
  if (bassMuteBouncer) drawOneBounceSwitcher(bassMuteBouncer);

  if (drumTrackBouncer) drawOneBounceSwitcher(drumTrackBouncer);
  if (drumMuteBouncer) drawOneBounceSwitcher(drumMuteBouncer);

  if (guitarBouncer) drawOneBounceSwitcher(guitarBouncer);
  if (vocalBouncer) drawOneBounceSwitcher(vocalBouncer);
  if (synthBouncer) drawOneBounceSwitcher(synthBouncer);
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

    let wallHit = "";

    if (this.x - this.size / 2 <= 0) {
      this.x = this.size / 2;
      this.speedX *= -1;
      wallHit = "left";
    }

    if (this.x + this.size / 2 >= width) {
      this.x = width - this.size / 2;
      this.speedX *= -1;
      wallHit = "right";
    }

    if (this.y - this.size / 2 <= 0) {
      this.y = this.size / 2;
      this.speedY *= -1;
      wallHit = "top";
    }

    if (this.y + this.size / 2 >= height) {
      this.y = height - this.size / 2;
      this.speedY *= -1;
      wallHit = "bottom";
    }

    if (wallHit !== "" && this.hitCooldown <= 0) {
      this.handleWallHit(wallHit);

      // Bigger cooldown = fewer repeated switches = less lag.
      this.hitCooldown = 45;
    }

    this.flash *= 0.88;
  }


  handleWallHit(wall) {
    this.flash = 80;

    if (this.type === "bassTrack") {
      this.handleBassTrackWall(wall);
    }

    if (this.type === "bassMute") {
      this.handleBassMuteWall(wall);
    }

    if (this.type === "drumTrack") {
      this.handleDrumTrackWall(wall);
    }

    if (this.type === "drumMute") {
      this.handleDrumMuteWall(wall);
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
  }


  // --------------------------------------------------
  // BASS TRACK
  // right  = Bass 1
  // bottom = Bass 2
  // top    = Bass 3
  // left   = Bass 4
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
  // BASS ON/OFF
  // left/top      = Bass Off
  // right/bottom  = Bass On
  // --------------------------------------------------

  handleBassMuteWall(wall) {
    if (wall === "left" || wall === "top") {
      safeBounceAction("mute bass", function() {
        if (typeof muteBass === "function") {
          muteBass();
        }
      });

      this.lastActionText = "Bass Off";
    }

    if (wall === "right" || wall === "bottom") {
      safeBounceAction("unmute bass", function() {
        let currentTrack = 0;

        if (typeof activeBassTrack !== "undefined") {
          currentTrack = activeBassTrack;
        }

        if (typeof switchBassTrack === "function") {
          switchBassTrack(currentTrack);
        }
      });

      this.lastActionText = "Bass On";
    }
  }


  // --------------------------------------------------
  // DRUM TRACK
  // right  = Drum 1
  // bottom = Drum 2
  // top    = Drum 3
  // left   = Drum 4
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
  // DRUM ON/OFF
  // left/top      = Drums Off
  // right/bottom  = Drums On
  // --------------------------------------------------

  handleDrumMuteWall(wall) {
    if (wall === "left" || wall === "top") {
      safeBounceAction("mute drum", function() {
        if (typeof muteDrum === "function") {
          muteDrum();
        }
      });

      this.lastActionText = "Drums Off";
    }

    if (wall === "right" || wall === "bottom") {
      safeBounceAction("unmute drum", function() {
        let currentTrack = 0;

        if (typeof activeDrumTrack !== "undefined") {
          currentTrack = activeDrumTrack;
        }

        if (typeof switchDrumTrack === "function") {
          switchDrumTrack(currentTrack);
        }
      });

      this.lastActionText = "Drums On";
    }
  }


  // --------------------------------------------------
  // GUITAR ON/OFF
  // left/top      = Guitar Off
  // right/bottom  = Guitar On
  // --------------------------------------------------

  handleGuitarWall(wall) {
    if (wall === "left" || wall === "top") {
      safeBounceAction("mute guitar", function() {
        if (typeof muteGuitar === "function") {
          muteGuitar();
        }
      });

      this.lastActionText = "Guitar Off";
    }

    if (wall === "right" || wall === "bottom") {
      safeBounceAction("unmute guitar", function() {
        if (typeof unmuteGuitar === "function") {
          unmuteGuitar();
        }
      });

      this.lastActionText = "Guitar On";
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
    }

    if (wall === "top") {
      safeBounceAction("vocal 2 only", function() {
        turnOnOnlyVocal(1);
      });

      this.lastActionText = "Vocal 2";
    }

    if (wall === "right") {
      safeBounceAction("vocal 3 only", function() {
        turnOnOnlyVocal(2);
      });

      this.lastActionText = "Vocal 3";
    }

    if (wall === "bottom") {
      safeBounceAction("mute all vocals", function() {
        if (typeof muteAllVocals === "function") {
          muteAllVocals();
        }
      });

      this.lastActionText = "Vocals Off";
    }
  }


  // --------------------------------------------------
  // SYNTH CONTROL
  // left/top      = F#4
  // right/bottom  = B4
  // --------------------------------------------------

  handleSynthWall(wall) {
    if (wall === "left" || wall === "top") {
      safeBounceAction("set synth F#", function() {
        setSynthNoteSafe(0, 66);
      });

      this.lastActionText = "Synth F#";
    }

    if (wall === "right" || wall === "bottom") {
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

function getBounceStartText(type) {
  if (type === "bassTrack") return "Bass Track";
  if (type === "bassMute") return "Bass On/Off";

  if (type === "drumTrack") return "Drum Track";
  if (type === "drumMute") return "Drum On/Off";

  if (type === "guitar") return "Guitar";
  if (type === "vocal") return "Vocals";
  if (type === "synth") return "Synth";

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