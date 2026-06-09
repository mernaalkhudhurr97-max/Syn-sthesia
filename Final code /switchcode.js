// --------------------------------------------------
// BOUNCING WALL SWITCHERS - CRASH-SAFE VERSION
// Creative Coding Final Project
//
// This version prevents the whole sketch from crashing
// if one backend function has an error.
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
// --------------------------------------------------

function setupBounceSwitchers() {
  console.log("setupBounceSwitchers called");

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
    -0.85,
    0.62,
    "drumTrack"
  );

  drumMuteBouncer = new WallSwitchBouncer(
    width * 0.8,
    height * 0.65,
    30,
    -0.58,
    -0.48,
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
// --------------------------------------------------

function drawBounceSwitchers() {
  if (bassTrackBouncer) bassTrackBouncer.display();
  if (bassMuteBouncer) bassMuteBouncer.display();

  if (drumTrackBouncer) drumTrackBouncer.display();
  if (drumMuteBouncer) drumMuteBouncer.display();

  if (guitarBouncer) guitarBouncer.display();
  if (vocalBouncer) vocalBouncer.display();
  if (synthBouncer) synthBouncer.display();
}


// --------------------------------------------------
// SAFE FUNCTION CALLER
//
// If one backend function crashes, the whole sketch will not stop.
// Instead, the error appears in the console.
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
    this.lastActionText = this.getStartText();

    // Prevents corner collisions from triggering 2-4 actions at once.
    this.hitCooldown = 0;
  }


  getStartText() {
    if (this.type === "bassTrack") return "Bass Track";
    if (this.type === "bassMute") return "Bass On/Off";

    if (this.type === "drumTrack") return "Drum Track";
    if (this.type === "drumMute") return "Drum On/Off";

    if (this.type === "guitar") return "Guitar";
    if (this.type === "vocal") return "Vocals";
    if (this.type === "synth") return "Synth";

    return "";
  }


  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.hitCooldown > 0) {
      this.hitCooldown--;
    }

    let wallHit = "";

    // Left wall
    if (this.x - this.size / 2 <= 0) {
      this.x = this.size / 2;
      this.speedX *= -1;
      wallHit = "left";
    }

    // Right wall
    if (this.x + this.size / 2 >= width) {
      this.x = width - this.size / 2;
      this.speedX *= -1;
      wallHit = "right";
    }

    // Top wall
    if (this.y - this.size / 2 <= 0) {
      this.y = this.size / 2;
      this.speedY *= -1;
      wallHit = "top";
    }

    // Bottom wall
    if (this.y + this.size / 2 >= height) {
      this.y = height - this.size / 2;
      this.speedY *= -1;
      wallHit = "bottom";
    }

    if (wallHit !== "" && this.hitCooldown <= 0) {
      this.handleWallHit(wallHit);
      this.hitCooldown = 8;
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
  // VOCALS
  // left   = Vocal 1 only
  // top    = Vocal 2 only
  // right  = Vocal 3 only
  // bottom = All vocals off
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
  // SYNTH
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


  display() {
    push();

    translate(this.x, this.y);

    let colour = this.getColour();

    noStroke();
    fill(colour[0], colour[1], colour[2], 235);

    if (this.type === "bassTrack" || this.type === "bassMute") {
      circle(0, 0, this.size);
    } else if (this.type === "drumTrack" || this.type === "drumMute") {
      rectMode(CENTER);
      rect(0, 0, this.size, this.size, 4);
    } else if (this.type === "guitar") {
      rotate(PI / 4);
      rectMode(CENTER);
      rect(0, 0, this.size * 0.8, this.size * 0.8, 4);
    } else if (this.type === "vocal") {
      circle(0, 0, this.size);
      noFill();
      stroke(255, 220);
      strokeWeight(2);
      circle(0, 0, this.size * 1.3);
    } else if (this.type === "synth") {
      circle(0, 0, this.size * 0.85);
      noFill();
      stroke(255, 220);
      strokeWeight(2);
      circle(0, 0, this.size * 1.25);
    }

    // Flash ring
    noFill();
    stroke(255, 160 + this.flash);
    strokeWeight(2);
    circle(0, 0, this.size + this.flash * 0.35);

    // Object label
    noStroke();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(10);
    text(this.getShortLabel(), 0, 0);

    pop();

    // Action label
    push();
    noStroke();
    fill(255, 220);
    textAlign(CENTER, CENTER);
    textSize(11);
    text(this.lastActionText, this.x, this.y + this.size * 0.85);
    pop();
  }


  getColour() {
    if (this.type === "bassTrack") return [60, 150, 255];
    if (this.type === "bassMute") return [30, 90, 180];

    if (this.type === "drumTrack") return [255, 90, 60];
    if (this.type === "drumMute") return [170, 45, 35];

    if (this.type === "guitar") return [255, 215, 75];
    if (this.type === "vocal") return [255, 90, 220];
    if (this.type === "synth") return [80, 245, 255];

    return [255, 255, 255];
  }


  getShortLabel() {
    if (this.type === "bassTrack") return "B";
    if (this.type === "bassMute") return "B/O";

    if (this.type === "drumTrack") return "D";
    if (this.type === "drumMute") return "D/O";

    if (this.type === "guitar") return "GTR";
    if (this.type === "vocal") return "VOC";
    if (this.type === "synth") return "SYN";

    return "";
  }
}


// --------------------------------------------------
// HELPER: WALL TO FOUR TRACKS
// right  = 0
// bottom = 1
// top    = 2
// left   = 3
// --------------------------------------------------

function wallToFourTrack(wall) {
  if (wall === "right") return 0;
  if (wall === "bottom") return 1;
  if (wall === "top") return 2;
  if (wall === "left") return 3;

  return 0;
}


// --------------------------------------------------
// HELPER: VOCAL ONLY
// --------------------------------------------------

function turnOnOnlyVocal(index) {
  if (typeof muteAllVocals === "function") {
    muteAllVocals();
  }

  if (typeof unmuteVocal === "function") {
    unmuteVocal(index);
  }
}


// --------------------------------------------------
// HELPER: SYNTH NOTE SAFE
//
// Supports both versions of your synth backend:
// setSynthNote(index)
// or
// setSynthMidiNote(midiNumber)
// --------------------------------------------------

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