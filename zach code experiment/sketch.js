let drum;
let reverb;
let isLoaded = false;
let maxDistance;

function preload() {
  soundFormats('wav');
  drum = loadSound('../assessment code/assets/DrumWav/Drum 1.wav', () => {
    isLoaded = true;
  }, () => {
    console.error('Failed to load drum sound');
  });
}

function setup() {
  createCanvas(400, 400);
  maxDistance = dist(0, 0, width / 2, height / 2);
  reverb = new p5.Reverb();
  reverb.process(drum, 3, 2);
  reverb.drywet(0);
  textAlign(CENTER, CENTER);
  textSize(16);
}

function draw() {
  background(25);

  const centerX = width / 2;
  const centerY = height / 2;
  const distanceFromCenter = dist(mouseX, mouseY, centerX, centerY);
  const normalizedDistance = constrain(distanceFromCenter / maxDistance, 0, 1);
  const circleSize = lerp(120, 30, normalizedDistance);
  const wetAmount = normalizedDistance;
  const panAmount = map(mouseX, 0, width, -1, 1);

  reverb.drywet(wetAmount);
  drum.pan(panAmount);

  push();
  stroke(255, 100);
  strokeWeight(2);
  noFill();
  ellipse(centerX, centerY, width * 0.9);
  pop();

  push();
  noStroke();
  fill(80, 180, 230, 220);
  ellipse(mouseX, mouseY, circleSize);
  pop();

  fill(255);
  noStroke();
  text('Click to play drum', centerX, 24);
  text(`Wet: ${nf(wetAmount, 1, 2)}  Pan: ${nf(panAmount, 1, 2)}`, centerX, height - 30);
  text('Move mouse to control position, size, wetness, and pan', centerX, 50);
  text('Center = large/dry | Edge = small/wet', centerX, 70);

  if (!isLoaded) {
    fill(255, 200, 0);
    text('Loading drum sound...', centerX, centerY + 80);
  }
}

function mousePressed() {
  if (!isLoaded) {
    return;
  }

  userStartAudio();

  if (drum.isPlaying()) {
    drum.stop();
  }

  drum.play();
}
