// --------------------------------------------------
// SWITCH VISUAL FILE
// Person 2 works on this file.
//
// This file controls ONLY how the bouncing objects look.
// It does not switch audio, detect walls, or change tracks.
//
// The logic file passes each bouncer into:
// drawOneBounceSwitcher(bouncer)
//
// The bouncer object contains:
// bouncer.x
// bouncer.y
// bouncer.size
// bouncer.type
// bouncer.flash
// bouncer.lastActionText
// --------------------------------------------------


// --------------------------------------------------
// DRAW ONE BOUNCER
// Called from switchLogic.js.
// --------------------------------------------------

function drawOneBounceSwitcher(bouncer) {
  push();

  translate(bouncer.x, bouncer.y);

  let colour = getBounceColour(bouncer.type);

  drawBounceGlow(bouncer, colour);
  drawBounceShape(bouncer, colour);
  drawBounceFlash(bouncer);
  drawBounceInsideLabel(bouncer);

  pop();

  drawBounceActionText(bouncer);
}


// --------------------------------------------------
// DRAW GLOW BEHIND OBJECT
// --------------------------------------------------

function drawBounceGlow(bouncer, colour) {
  noStroke();

  fill(colour[0], colour[1], colour[2], 45);
  circle(0, 0, bouncer.size * 2.2);

  fill(colour[0], colour[1], colour[2], 25);
  circle(0, 0, bouncer.size * 3.4);
}


// --------------------------------------------------
// DRAW MAIN SHAPE
// --------------------------------------------------

function drawBounceShape(bouncer, colour) {
  noStroke();
  fill(colour[0], colour[1], colour[2], 235);

  if (bouncer.type === "bassTrack" || bouncer.type === "bassMute") {
    circle(0, 0, bouncer.size);
  }

  else if (bouncer.type === "drumTrack" || bouncer.type === "drumMute") {
    rectMode(CENTER);
    rect(0, 0, bouncer.size, bouncer.size, 4);
  }

  else if (bouncer.type === "guitar") {
    push();
    rotate(PI / 4);
    rectMode(CENTER);
    rect(0, 0, bouncer.size * 0.82, bouncer.size * 0.82, 4);
    pop();
  }

  else if (bouncer.type === "vocal") {
    circle(0, 0, bouncer.size);

    noFill();
    stroke(255, 220);
    strokeWeight(2);
    circle(0, 0, bouncer.size * 1.3);
  }

  else if (bouncer.type === "synth") {
    circle(0, 0, bouncer.size * 0.85);

    noFill();
    stroke(255, 220);
    strokeWeight(2);
    circle(0, 0, bouncer.size * 1.25);
  }
}


// --------------------------------------------------
// DRAW FLASH AFTER WALL HIT
// --------------------------------------------------

function drawBounceFlash(bouncer) {
  noFill();
  stroke(255, 160 + bouncer.flash);
  strokeWeight(2);
  circle(0, 0, bouncer.size + bouncer.flash * 0.35);
}


// --------------------------------------------------
// DRAW LABEL INSIDE THE OBJECT
// --------------------------------------------------

function drawBounceInsideLabel(bouncer) {
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(10);
  text(getBounceShortLabel(bouncer.type), 0, 0);
}


// --------------------------------------------------
// DRAW ACTION TEXT UNDER OBJECT
// --------------------------------------------------

function drawBounceActionText(bouncer) {
  push();

  noStroke();
  fill(255, 220);
  textAlign(CENTER, CENTER);
  textSize(11);

  text(
    bouncer.lastActionText,
    bouncer.x,
    bouncer.y + bouncer.size * 0.85
  );

  pop();
}


// --------------------------------------------------
// COLOUR BY TYPE
// Visual person can safely change these colours.
// --------------------------------------------------

function getBounceColour(type) {
  if (type === "bassTrack") return [60, 150, 255];
  if (type === "bassMute") return [30, 90, 180];

  if (type === "drumTrack") return [255, 90, 60];
  if (type === "drumMute") return [170, 45, 35];

  if (type === "guitar") return [255, 215, 75];

  if (type === "vocal") return [255, 90, 220];

  if (type === "synth") return [80, 245, 255];

  return [255, 255, 255];
}


// --------------------------------------------------
// SHORT LABEL BY TYPE
// --------------------------------------------------

function getBounceShortLabel(type) {
  if (type === "bassTrack") return "B";
  if (type === "bassMute") return "B/O";

  if (type === "drumTrack") return "D";
  if (type === "drumMute") return "D/O";

  if (type === "guitar") return "GTR";

  if (type === "vocal") return "VOC";

  if (type === "synth") return "SYN";

  return "";
}