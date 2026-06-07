// --------------------------------------------------
// TEAMMATE VISUAL LAYER - ADVANCED AUDIO REACTIVE VERSION
//
// This file should NOT contain setup() or draw().
// testvis.js should call:
// mv_setup();
// mv_hookHits();
// mv_draw();
//
// This file uses:
// wholeSubBassEnergy
// wholeBassEnergy
// wholeLowMidEnergy
// wholeMidEnergy
// wholePresenceEnergy
// wholeHighEnergy
// wholeCentroidFreq
// wholeSpectrum
//
// It also uses:
// vocalFreq
// vocalNoteName
// vocalMuted
//
// It hooks:
// createBassVisual()
// createDrumVisual()
// createGuitarVisual()
// createStringsVisual()
// playSynthNote()
// --------------------------------------------------


// --------------------------------------------------
// MAIN VISUAL STATE
// --------------------------------------------------

let mv_particles = [];
let mv_glowDots = [];
let mv_orbiters = [];
let mv_pendulums = [];
let mv_ripples = [];
let mv_shards = [];
let mv_pRings = [];
let mv_hexCells = [];

let mv_guitarTrails = [];
let mv_stringWaves = [];

let mv_t = 0;
let mv_nOff = 0;
let mv_ready = false;

let mv_bassGravityPulse = 0;
let mv_drumImpactPulse = 0;
let mv_synthPulse = 0;
let mv_synthHooked = false;


// --------------------------------------------------
// COLOUR PALETTE
// --------------------------------------------------

let MV_COLS = [
  [255, 20, 90],
  [255, 100, 20],
  [255, 210, 20],
  [100, 255, 20],
  [20, 255, 140],
  [20, 200, 255],
  [20, 100, 255],
  [160, 20, 255],
  [255, 20, 200],
  [255, 80, 140],
  [0, 255, 200],
  [255, 240, 60],
  [80, 200, 255],
  [200, 80, 255],
  [255, 160, 60],
  [60, 255, 160],
  [255, 60, 255],
  [60, 255, 255],
  [200, 255, 60],
  [255, 255, 60]
];


// --------------------------------------------------
// SMALL HELPERS
// --------------------------------------------------

function mv_hsl(h, s, l) {
  s /= 100;
  l /= 100;

  let a = s * min(l, 1 - l);

  function f(n) {
    let k = (n + h / 30) % 12;
    return l - a * max(-1, min(k - 3, 9 - k, 1));
  }

  return [f(0) * 255, f(8) * 255, f(4) * 255];
}


function mv_rc() {
  return random(MV_COLS);
}


function mv_E(v) {
  return typeof v !== "undefined" ? constrain(v / 255, 0, 1) : 0;
}


// --------------------------------------------------
// WHOLE FFT HELPERS
// --------------------------------------------------

function mv_Sub() {
  return mv_E(
    typeof wholeSubBassEnergy !== "undefined"
      ? wholeSubBassEnergy
      : 0
  );
}


function mv_B() {
  return mv_E(
    typeof wholeBassEnergy !== "undefined"
      ? wholeBassEnergy
      : 0
  );
}


function mv_LowMid() {
  return mv_E(
    typeof wholeLowMidEnergy !== "undefined"
      ? wholeLowMidEnergy
      : 0
  );
}


function mv_M() {
  return mv_E(
    typeof wholeMidEnergy !== "undefined"
      ? wholeMidEnergy
      : 0
  );
}


function mv_Presence() {
  return mv_E(
    typeof wholePresenceEnergy !== "undefined"
      ? wholePresenceEnergy
      : 0
  );
}


function mv_H() {
  return mv_E(
    typeof wholeHighEnergy !== "undefined"
      ? wholeHighEnergy
      : 0
  );
}


function mv_C() {
  return typeof wholeCentroidFreq !== "undefined"
    ? constrain(map(wholeCentroidFreq, 200, 6000, 0, 1), 0, 1)
    : 0;
}


// --------------------------------------------------
// NOTE COLOUR FOR VOCAL PLANETS
// --------------------------------------------------

function mv_noteColour(noteName) {
  if (noteName === "C") return [255, 70, 90];
  if (noteName === "C#") return [255, 120, 70];
  if (noteName === "D") return [255, 190, 70];
  if (noteName === "D#") return [220, 255, 80];
  if (noteName === "E") return [120, 255, 100];
  if (noteName === "F") return [80, 255, 180];
  if (noteName === "F#") return [80, 240, 255];
  if (noteName === "G") return [80, 170, 255];
  if (noteName === "G#") return [100, 100, 255];
  if (noteName === "A") return [150, 90, 255];
  if (noteName === "A#") return [220, 90, 255];
  if (noteName === "B") return [255, 80, 180];

  return [220, 230, 255];
}


// --------------------------------------------------
// SETUP VISUAL
// Called from testvis.js setup()
// --------------------------------------------------

function mv_setup() {
  mv_ready = true;
  mv_t = 0;
  mv_nOff = random(1000);

  mv_particles = [];
  mv_glowDots = [];
  mv_orbiters = [];
  mv_pendulums = [];
  mv_ripples = [];
  mv_shards = [];
  mv_pRings = [];
  mv_hexCells = [];
  mv_guitarTrails = [];
  mv_stringWaves = [];

  mv_bassGravityPulse = 0;
  mv_drumImpactPulse = 0;
  mv_synthPulse = 0;

  let sz = 55;
  let cols = ceil(width / (sz * 1.73)) + 2;
  let rows = ceil(height / (sz * 1.5)) + 2;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      mv_hexCells.push({
        x: c * sz * 1.73 + (r % 2) * sz * 0.866,
        y: r * sz * 1.5,
        sz: sz,
        s: random(1000),
        col: mv_rc()
      });
    }
  }

  for (let i = 0; i < 900; i++) {
    mv_particles.push(new MV_Particle());
  }

  for (let i = 0; i < 60; i++) {
    mv_glowDots.push(new MV_GlowDot());
  }

  for (let i = 0; i < 10; i++) {
    mv_pendulums.push(new MV_Pendulum());
  }

  for (let i = 0; i < 50; i++) {
    mv_orbiters.push(new MV_Orbiter());
  }
}


// --------------------------------------------------
// MAIN DRAW VISUAL
// Called from testvis.js draw()
// --------------------------------------------------

function mv_draw() {
  if (!mv_ready) {
    return;
  }

  if (!mv_synthHooked) {
    mv_hookSynth();
  }

  mv_t++;
  mv_nOff += 0.0006;

  let sub = mv_Sub();
  let b = mv_B();
  let lowMid = mv_LowMid();
  let m = mv_M();
  let presence = mv_Presence();
  let h = mv_H();
  let c = mv_C();

  mv_bassGravityPulse *= 0.92;
  mv_drumImpactPulse *= 0.88;
  mv_synthPulse *= 0.9;

  // full mix atmosphere
  mv_drawAurora(b, m, c);
  mv_drawHex(b + sub * 0.4, lowMid);
  mv_drawPlasma(b, m + presence * 0.5);
  mv_drawPRings();

  // stronger whole-output layers
  mv_drawBassGravity(sub, b);
  mv_drawWholeSpectrumRing(b, h, c);

  // original moving objects
  for (let p of mv_particles) {
    p.update(b, m);
    p.show();
  }

  for (let g of mv_glowDots) {
    g.update();
    g.show(h);
  }

  for (let p of mv_pendulums) {
    p.update(b + sub * 0.8);
    p.show();
  }

  for (let o of mv_orbiters) {
    o.update(b, m, h);
    o.show();
  }

  // event layers
  mv_drawGuitarTrails();
  mv_drawStringWaves();

  for (let i = mv_ripples.length - 1; i >= 0; i--) {
    mv_ripples[i].update();
    mv_ripples[i].show();

    if (mv_ripples[i].done) {
      mv_ripples.splice(i, 1);
    }
  }

  for (let i = mv_shards.length - 1; i >= 0; i--) {
    mv_shards[i].update();
    mv_shards[i].show();

    if (mv_shards[i].done) {
      mv_shards.splice(i, 1);
    }
  }

  // special outputs
  mv_drawSynthSignal();
  mv_drawVocalPlanets();

  // bottom spectrum
  mv_drawSpectrumBar(b, c);
}


// --------------------------------------------------
// AURORA - WHOLE FFT ATMOSPHERE
// --------------------------------------------------

function mv_drawAurora(b, m, c) {
  noFill();

  for (let a = 0; a < 8; a++) {
    let hue = (a * 36 + mv_t * 0.25 + c * 120) % 360;
    let col = mv_hsl(hue, 90, 62);

    stroke(col[0], col[1], col[2], 9 + b * 14);
    strokeWeight(1.8);

    beginShape();

    for (let x = -20; x <= width + 20; x += 16) {
      let n = noise(x * 0.0013, a * 0.55 + mv_nOff);
      let y = map(n, 0, 1, height * 0.02, height * 0.98);

      y += sin(mv_t * 0.006 + a * 1.2 + x * 0.009) * (22 + b * 28);

      curveVertex(x, y);
    }

    endShape();
  }
}


// --------------------------------------------------
// HEX GRID - LOW/MID BODY
// --------------------------------------------------

function mv_drawHex(b, lowMid) {
  noFill();

  for (let h of mv_hexCells) {
    let pulse = noise(h.s, mv_t * 0.007);
    let hue = (mv_t * 0.35 + h.s * 0.18 + lowMid * 80) % 360;
    let col = mv_hsl(hue, 80, 60);

    stroke(
      col[0],
      col[1],
      col[2],
      map(pulse, 0, 1, 2, 12 + b * 20 + lowMid * 25)
    );

    strokeWeight(0.7 + b * 0.5 + lowMid * 1.2);

    beginShape();

    for (let i = 0; i < 6; i++) {
      let ang = map(i, 0, 6, 0, TWO_PI) - PI / 6;
      let r = h.sz * (0.82 + pulse * 0.2 + b * 0.16 + lowMid * 0.12);

      vertex(
        h.x + cos(ang) * r,
        h.y + sin(ang) * r
      );
    }

    endShape(CLOSE);
  }
}


// --------------------------------------------------
// PLASMA - MID/PRESENCE ATMOSPHERE
// --------------------------------------------------

function mv_drawPlasma(b, m) {
  let step = 36;

  noStroke();

  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
      let v =
        sin(x * 0.02 + mv_t * 0.025) +
        sin(y * 0.02 + mv_t * 0.022) +
        sin((x + y) * 0.014 + mv_t * 0.018) +
        sin(dist(x, y, width * 0.5, height * 0.5) * 0.022 - mv_t * 0.035);

      let hue = (v * 42 + mv_t * 0.7 + b * 60 + m * 80 + 180) % 360;
      let col = mv_hsl(hue, 100, 58);

      fill(col[0], col[1], col[2], 5 + b * 6 + m * 4);
      rect(x, y, step, step);
    }
  }
}


// --------------------------------------------------
// RANDOM PULSE RINGS
// --------------------------------------------------

function mv_drawPRings() {
  if (mv_t % 65 === 0) {
    mv_pRings.push({
      x: random(width),
      y: random(height),
      r: 0,
      col: mv_rc(),
      life: 200
    });
  }

  for (let i = mv_pRings.length - 1; i >= 0; i--) {
    let p = mv_pRings[i];

    p.r += 2.5 + mv_B() * 5;
    p.life -= 2;

    stroke(
      p.col[0],
      p.col[1],
      p.col[2],
      map(p.life, 0, 200, 0, 60)
    );

    strokeWeight(1.5);
    noFill();

    circle(p.x, p.y, p.r * 2);

    if (p.life <= 0) {
      mv_pRings.splice(i, 1);
    }
  }
}


// --------------------------------------------------
// BASS / SUB BASS = GRAVITY FIELD
// --------------------------------------------------

function mv_drawBassGravity(sub, b) {
  push();

  translate(width / 2, height / 2);
  noFill();
  blendMode(ADD);

  let pulse = sub * 180 + mv_bassGravityPulse * 140;

  stroke(70, 145, 255, 35 + sub * 90);
  strokeWeight(2 + sub * 5);
  circle(0, 0, 260 + pulse);

  stroke(20, 200, 255, 22 + b * 70);
  strokeWeight(1.5);
  circle(0, 0, 380 + b * 240);

  stroke(255, 255, 255, 12 + mv_bassGravityPulse * 80);
  strokeWeight(1);
  circle(0, 0, 520 + mv_bassGravityPulse * 260);

  pop();
}


// --------------------------------------------------
// WHOLE FFT = CIRCULAR SPECTRUM RING
// --------------------------------------------------

function mv_drawWholeSpectrumRing(b, h, c) {
  if (
    typeof wholeSpectrum === "undefined" ||
    !wholeSpectrum ||
    wholeSpectrum.length === 0
  ) {
    return;
  }

  push();

  translate(width / 2, height / 2);
  rotate(mv_t * 0.002 + c * 0.5);

  noFill();
  blendMode(ADD);

  let bins = min(wholeSpectrum.length, 512);
  let step = max(1, floor(bins / 150));

  let col = mv_hsl(190 + c * 130, 100, 62);

  stroke(col[0], col[1], col[2], 80 + h * 120);
  strokeWeight(1.5 + h * 2);

  beginShape();

  for (let i = 0; i < bins; i += step) {
    let amp = wholeSpectrum[i];
    let angle = map(i, 0, bins, 0, TWO_PI);

    let radius = 170 + map(amp, 0, 255, 0, 155) + b * 55;

    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    curveVertex(x, y);
  }

  endShape(CLOSE);

  pop();
}


// --------------------------------------------------
// BOTTOM SPECTRUM BAR
// --------------------------------------------------

function mv_drawSpectrumBar(b, c) {
  if (
    typeof wholeSpectrum === "undefined" ||
    !wholeSpectrum ||
    wholeSpectrum.length === 0
  ) {
    return;
  }

  let bins = min(wholeSpectrum.length, 256);

  noStroke();

  for (let i = 0; i < bins; i++) {
    let amp = wholeSpectrum[i];
    let barH = map(amp, 0, 255, 0, height * 0.3 * (1 + b * 0.7));
    let x = map(i, 0, bins, 0, width);
    let w2 = width / bins + 1;
    let hue = (map(i, 0, bins, 180, 320) + mv_t * 0.4 + c * 80) % 360;
    let col = mv_hsl(hue, 100, 62);

    fill(col[0], col[1], col[2], 50 + b * 60);
    rect(x, height - barH, w2, barH);
  }
}


// --------------------------------------------------
// GUITAR = GOLDEN TRAILS
// --------------------------------------------------

function mv_drawGuitarTrails() {
  for (let i = mv_guitarTrails.length - 1; i >= 0; i--) {
    let tr = mv_guitarTrails[i];

    let a = map(tr.life, 0, tr.maxLife, 0, tr.alpha);

    push();

    blendMode(ADD);
    noFill();

    stroke(255, 210, 80, a);
    strokeWeight(tr.weight);

    beginShape();
    curveVertex(tr.x1, tr.y1);
    curveVertex(tr.x1, tr.y1);
    curveVertex(tr.cx, tr.cy);
    curveVertex(tr.x2, tr.y2);
    curveVertex(tr.x2, tr.y2);
    endShape();

    pop();

    tr.life--;

    if (tr.life <= 0) {
      mv_guitarTrails.splice(i, 1);
    }
  }
}


// --------------------------------------------------
// STRINGS = SLOW PURPLE WAVES
// --------------------------------------------------

function mv_drawStringWaves() {
  for (let i = mv_stringWaves.length - 1; i >= 0; i--) {
    let w = mv_stringWaves[i];

    let a = map(w.life, 0, w.maxLife, 0, w.alpha);
    let progress = 1 - w.life / w.maxLife;

    push();

    translate(width / 2, height / 2);
    blendMode(ADD);
    noFill();

    stroke(190, 110, 255, a);
    strokeWeight(1.5);

    let radius = w.radius + progress * 280;

    beginShape();

    for (let ang = 0; ang <= TWO_PI + 0.1; ang += 0.12) {
      let wobble = sin(ang * 5 + mv_t * 0.03 + w.seed) * 18;
      let x = cos(ang) * (radius + wobble);
      let y = sin(ang) * (radius + wobble * 0.6);

      curveVertex(x, y);
    }

    endShape(CLOSE);

    pop();

    w.life--;

    if (w.life <= 0) {
      mv_stringWaves.splice(i, 1);
    }
  }
}


// --------------------------------------------------
// SYNTH = SPECIAL SIGNAL CORE
// --------------------------------------------------

function mv_drawSynthSignal() {
  if (mv_synthPulse <= 0.01) {
    return;
  }

  push();

  translate(width / 2, height / 2);
  blendMode(ADD);

  let size = 40 + mv_synthPulse * 220;

  noStroke();

  fill(80, 240, 255, 30 + mv_synthPulse * 120);
  circle(0, 0, size * 2.4);

  fill(255, 255, 255, 120 + mv_synthPulse * 100);
  circle(0, 0, size * 0.45);

  noFill();
  stroke(80, 240, 255, 120 + mv_synthPulse * 100);
  strokeWeight(2);
  circle(0, 0, size);

  pop();
}


// --------------------------------------------------
// VOCALS = PITCH PLANETS
// --------------------------------------------------

function mv_drawVocalPlanets() {
  if (
    typeof vocalFreq === "undefined" ||
    typeof vocalNoteName === "undefined" ||
    typeof vocalMuted === "undefined"
  ) {
    return;
  }

  push();

  blendMode(ADD);

  for (let i = 0; i < vocalFreq.length; i++) {
    if (vocalMuted[i]) {
      continue;
    }

    let freq = vocalFreq[i];
    let noteName = vocalNoteName[i];

    let angle = mv_t * (0.012 + i * 0.004) + i * TWO_PI / 3;
    let orbitRadius = 95 + i * 70;

    if (freq > 0) {
      orbitRadius += map(constrain(freq, 80, 1200), 80, 1200, 0, 110);
    }

    let x = width / 2 + cos(angle) * orbitRadius;
    let y = height / 2 + sin(angle) * orbitRadius * 0.72;

    let col = mv_noteColour(noteName);

    let size;

    if (freq > 0 && noteName !== "-") {
      size = map(constrain(freq, 80, 1200), 80, 1200, 18, 70);
    } else {
      size = 18 + sin(mv_t * 0.05 + i) * 5;
      col = [180, 190, 210];
    }

    noStroke();

    fill(col[0], col[1], col[2], 28);
    circle(x, y, size * 3.4);

    fill(col[0], col[1], col[2], 90);
    circle(x, y, size * 1.8);

    fill(col[0], col[1], col[2], 220);
    circle(x, y, size);

    fill(255, 220);
    textAlign(CENTER, CENTER);
    textSize(12);

    if (noteName && noteName !== "-") {
      text("V" + (i + 1) + " " + noteName, x, y + size + 16);
    } else {
      text("V" + (i + 1), x, y + size + 16);
    }
  }

  pop();
}


// --------------------------------------------------
// PARTICLE CLASS
// --------------------------------------------------

class MV_Particle {
  constructor() {
    this.reset(true);
  }

  reset(any) {
    this.x = any ? random(width) : random(width * 0.05, width * 0.5);
    this.y = any ? random(height) : random(height * 0.0, height * 0.45);
    this.px = this.x;
    this.py = this.y;
    this.life = floor(random(60, 190));
    this.maxL = this.life;
    this.spd = random(0.6, 2.5);
    this.w = random(0.3, 1.3);
    this.seed = random(1000);
    this.col = random() < 0.75 ? [200, 220, 255] : mv_rc();
  }

  update(b, m) {
    this.px = this.x;
    this.py = this.y;

    let ang =
      noise(
        this.x * 0.0015,
        this.y * 0.0015,
        mv_nOff + this.seed * 0.01
      ) *
      TWO_PI *
      2.8;

    ang += b * PI * 0.5;

    this.x += cos(ang) * this.spd * (1 + b * 1.5);
    this.y += sin(ang) * this.spd * (1 + m * 0.8);

    this.life--;

    if (
      this.life <= 0 ||
      this.x < -40 ||
      this.x > width + 40 ||
      this.y < -40 ||
      this.y > height + 40
    ) {
      this.reset(false);
    }
  }

  show() {
    let a = map(this.life, 0, this.maxL * 0.2, 0, 1, true) * 170;

    stroke(this.col[0], this.col[1], this.col[2], a);
    strokeWeight(this.w);
    line(this.px, this.py, this.x, this.y);
  }
}


// --------------------------------------------------
// GLOW DOT CLASS
// --------------------------------------------------

class MV_GlowDot {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(width);
    this.y = random(height);
    this.r = random(1.5, 5);
    this.seed = random(1000);
    this.life = floor(random(100, 300));
    this.maxL = this.life;
    this.col = random() < 0.6 ? [220, 230, 255] : mv_rc();
  }

  update() {
    let ang =
      noise(
        this.x * 0.0014,
        this.y * 0.0014,
        mv_nOff + this.seed * 0.01
      ) *
      TWO_PI *
      2;

    this.x += cos(ang) * 0.22;
    this.y += sin(ang) * 0.22;

    this.life--;

    if (this.life <= 0) {
      this.reset();
    }
  }

  show(h) {
    let a = map(this.life, 0, this.maxL * 0.15, 0, 1, true);
    let pulse = 1 + sin(mv_t * 0.06 + this.seed) * 0.28 + h * 0.3;
    let c = this.col;

    noStroke();

    fill(c[0], c[1], c[2], 18 * a);
    circle(this.x, this.y, this.r * 5 * pulse);

    fill(c[0], c[1], c[2], 55 * a);
    circle(this.x, this.y, this.r * 2.4 * pulse);

    fill(c[0], c[1], c[2], 200 * a);
    circle(this.x, this.y, this.r * pulse);
  }
}


// --------------------------------------------------
// PENDULUM CLASS
// --------------------------------------------------

class MV_Pendulum {
  constructor() {
    this.reset();
  }

  reset() {
    this.ax = random(width * 0.05, width * 0.9);
    this.ay = random(-height * 0.05, height * 0.12);
    this.len = random(height * 0.2, height * 0.68);
    this.angle = random(-PI * 0.4, PI * 0.4);
    this.aVel = random(-0.015, 0.015);
    this.damp = random(0.9988, 0.9999);
    this.r = random(10, 30);
    this.phase = random(TWO_PI);
    this.col = mv_rc();
  }

  update(b) {
    let grav = 0.002 + b * 0.004;

    this.aVel = this.aVel * this.damp - grav * sin(this.angle);
    this.angle += this.aVel;
  }

  show() {
    let bx = this.ax + sin(this.angle) * this.len;
    let by = this.ay + cos(this.angle) * this.len;
    let c = this.col;
    let p = 1 + sin(mv_t * 0.04 + this.phase) * 0.18;

    stroke(c[0], c[1], c[2], 40);
    strokeWeight(0.8);
    line(this.ax, this.ay, bx, by);

    noStroke();

    fill(c[0], c[1], c[2], 14);
    circle(bx, by, this.r * 3.8 * p);

    fill(c[0], c[1], c[2], 32);
    circle(bx, by, this.r * 2.2 * p);

    fill(c[0], c[1], c[2], 210);
    circle(bx, by, this.r * 2 * p);
  }
}


// --------------------------------------------------
// ORBITER CLASS
// --------------------------------------------------

class MV_Orbiter {
  constructor() {
    this.cx = random(width * 0.1, width * 0.9);
    this.cy = random(height * 0.1, height * 0.9);
    this.rx = random(55, min(width, height) * 0.36);
    this.ry = this.rx * random(0.3, 1.0);
    this.tilt = random(TWO_PI);
    this.spd = random(0.0015, 0.006) * (random() < 0.5 ? 1 : -1);
    this.angle = random(TWO_PI);
    this.sz = random(8, 22);
    this.col = mv_rc();
    this.col2 = mv_rc();
    this.type = floor(random(8));
    this.rot = random(TWO_PI);
    this.rSpd = random(-0.025, 0.025);
    this.pulse = random(TWO_PI);
  }

  pos(a) {
    let px = cos(a) * this.rx;
    let py = sin(a) * this.ry;

    return createVector(
      px * cos(this.tilt) - py * sin(this.tilt) + this.cx,
      px * sin(this.tilt) + py * cos(this.tilt) + this.cy
    );
  }

  update(b, m, h) {
    this.angle += this.spd * (1 + b * 2.2 + m * 0.7);
    this.rot += this.rSpd + h * 0.015;
    this.pulse += 0.05;
  }

  show() {
    let p = this.pos(this.angle);
    let sz = this.sz * (1 + sin(this.pulse) * 0.14) * (1 + mv_B() * 0.45);

    noStroke();

    fill(this.col[0], this.col[1], this.col[2], 16);
    circle(p.x, p.y, sz * 4.2);

    push();

    translate(p.x, p.y);
    rotate(this.rot);
    mv_drawShape(this.type, sz, this.col, this.col2);

    pop();
  }
}


// --------------------------------------------------
// SHAPE DRAWER
// --------------------------------------------------

function mv_drawShape(type, s, c1, c2) {
  switch (type) {
    case 0:
      fill(c1[0], c1[1], c1[2], 215);
      stroke(c2[0], c2[1], c2[2], 200);
      strokeWeight(1);

      beginShape();

      for (let i = 0; i < 10; i++) {
        let a = map(i, 0, 10, 0, TWO_PI) - HALF_PI;
        let radius = i % 2 === 0 ? s : s * 0.42;

        vertex(cos(a) * radius, sin(a) * radius);
      }

      endShape(CLOSE);
      break;

    case 1:
      noStroke();

      fill(c1[0], c1[1], c1[2], 28);
      circle(0, 0, s * 3.2);

      fill(c1[0], c1[1], c1[2], 88);
      circle(0, 0, s * 1.8);

      fill(c1[0], c1[1], c1[2], 215);
      circle(0, 0, s);
      break;

    case 2:
      fill(c1[0], c1[1], c1[2], 210);
      stroke(c2[0], c2[1], c2[2], 200);
      strokeWeight(1.2);

      beginShape();
      vertex(0, -s);
      vertex(s * 0.65, 0);
      vertex(0, s);
      vertex(-s * 0.65, 0);
      endShape(CLOSE);
      break;

    case 3:
      noFill();
      stroke(c1[0], c1[1], c1[2], 210);
      strokeWeight(2.2);
      circle(0, 0, s * 2);
      break;

    case 4:
      fill(c1[0], c1[1], c1[2], 185);
      stroke(c2[0], c2[1], c2[2], 200);
      strokeWeight(1.1);

      beginShape();
      vertex(0, -s);
      vertex(s * 0.48, -s * 0.18);
      vertex(s * 0.32, s);
      vertex(-s * 0.32, s);
      vertex(-s * 0.48, -s * 0.18);
      endShape(CLOSE);
      break;

    case 5:
      noStroke();

      for (let i = 0; i < 8; i++) {
        let a = map(i, 0, 8, 0, TWO_PI);
        let c = i % 2 === 0 ? c1 : c2;

        fill(c[0], c[1], c[2], 195);

        push();
        translate(cos(a) * s * 0.52, sin(a) * s * 0.52);
        rotate(a);
        ellipse(0, 0, s * 0.6, s * 0.3);
        pop();
      }

      fill(255, 230, 60, 215);
      circle(0, 0, s * 0.42);
      break;

    case 6:
      noStroke();
      fill(c1[0], c1[1], c1[2], 215);

      beginShape();

      for (let a = 0; a < TWO_PI; a += 0.06) {
        let x = s * 0.38 * (16 * pow(sin(a), 3));
        let y =
          -s *
          0.38 *
          (13 * cos(a) -
            5 * cos(2 * a) -
            2 * cos(3 * a) -
            cos(4 * a));

        vertex(x / 5, y / 5);
      }

      endShape(CLOSE);
      break;

    case 7:
      noFill();
      stroke(c1[0], c1[1], c1[2], 190);
      strokeWeight(1.1);

      beginShape();

      for (let a = 0; a < TWO_PI * 3.2; a += 0.08) {
        let r = (a / (TWO_PI * 3.2)) * s;
        curveVertex(cos(a) * r, sin(a) * r);
      }

      endShape();
      break;
  }
}


// --------------------------------------------------
// RIPPLE CLASS
// --------------------------------------------------

class MV_Ripple {
  constructor(x, y, targetR, col, maxA, sw) {
    this.x = x;
    this.y = y;
    this.r = 0;
    this.tR = targetR;
    this.col = col;
    this.maxA = maxA;
    this.sw = sw;
    this.life = 1.0;
  }

  get done() {
    return this.life < 0.015;
  }

  update() {
    this.r = lerp(this.r, this.tR, 0.11);
    this.life = lerp(this.life, 0, 0.042);
  }

  show() {
    let a = this.life * this.maxA;

    stroke(this.col[0], this.col[1], this.col[2], a);
    strokeWeight(this.sw);
    noFill();
    circle(this.x, this.y, this.r * 2);
  }
}


// --------------------------------------------------
// SHARD CLASS
// --------------------------------------------------

class MV_Shard {
  constructor(x, y, v, col) {
    this.x = x;
    this.y = y;

    let a = random(TWO_PI);
    let sp = random(2, 5 + v * 8);

    this.vx = cos(a) * sp;
    this.vy = sin(a) * sp;
    this.life = random(0.5, 1.0);
    this.col = col;
    this.sz = random(4, 12 + v * 10);
    this.rot = random(TWO_PI);
    this.rSpd = random(-0.18, 0.18);
  }

  get done() {
    return this.life < 0.015;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    this.vy += 0.14;

    this.vx *= 0.97;
    this.vy *= 0.97;

    this.rot += this.rSpd;
    this.life = lerp(this.life, 0, 0.055);
  }

  show() {
    let a = this.life * 210;

    push();

    translate(this.x, this.y);
    rotate(this.rot);

    fill(this.col[0], this.col[1], this.col[2], a);
    noStroke();
    rect(0, 0, this.sz, this.sz, 2);

    pop();
  }
}


// --------------------------------------------------
// HOOK MIDI HIT FUNCTIONS
// Called once from testvis.js setup()
// --------------------------------------------------

function mv_hookHits() {
  let _oB = typeof createBassVisual === "function" ? createBassVisual : null;
  let _oD = typeof createDrumVisual === "function" ? createDrumVisual : null;
  let _oG = typeof createGuitarVisual === "function" ? createGuitarVisual : null;
  let _oS = typeof createStringsVisual === "function" ? createStringsVisual : null;

  window.createBassVisual = function(note) {
    if (_oB) {
      _oB(note);
    }

    mv_bassGravityPulse = max(mv_bassGravityPulse, note.velocity);

    mv_ripples.push(
      new MV_Ripple(
        width / 2,
        height / 2,
        map(note.velocity, 0, 1, 100, 340),
        [70, 145, 255],
        map(note.velocity, 0, 1, 40, 95),
        3
      )
    );
  };

  window.createDrumVisual = function(note) {
    if (_oD) {
      _oD(note);
    }

    mv_drumImpactPulse = max(mv_drumImpactPulse, note.velocity);

    let cx = random(width * 0.15, width * 0.85);
    let cy = random(height * 0.15, height * 0.8);

    let shardCount = floor(map(note.velocity, 0, 1, 6, 28));

    for (let i = 0; i < shardCount; i++) {
      mv_shards.push(
        new MV_Shard(
          cx,
          cy,
          note.velocity,
          [255, 105, 75]
        )
      );
    }

    mv_ripples.push(
      new MV_Ripple(
        cx,
        cy,
        map(note.velocity, 0, 1, 50, 190),
        [255, 105, 75],
        map(note.velocity, 0, 1, 30, 80),
        2.2
      )
    );
  };

  window.createGuitarVisual = function(note) {
    if (_oG) {
      _oG(note);
    }

    let side = random() < 0.5 ? -1 : 1;

    mv_guitarTrails.push({
      x1: width / 2,
      y1: height / 2,
      cx: width / 2 + side * random(80, 260),
      cy: random(height * 0.2, height * 0.8),
      x2: random(width * 0.1, width * 0.9),
      y2: random(height * 0.15, height * 0.9),
      life: 55,
      maxLife: 55,
      alpha: map(note.velocity, 0, 1, 50, 180),
      weight: map(note.velocity, 0, 1, 1, 3)
    });

    mv_ripples.push(
      new MV_Ripple(
        width / 2,
        height / 2,
        map(note.velocity, 0, 1, 70, 220),
        [255, 210, 80],
        map(note.velocity, 0, 1, 25, 70),
        2.5
      )
    );
  };

  window.createStringsVisual = function(note) {
    if (_oS) {
      _oS(note);
    }

    mv_stringWaves.push({
      radius: map(note.velocity, 0, 1, 100, 260),
      life: 120,
      maxLife: 120,
      alpha: map(note.velocity, 0, 1, 22, 80),
      seed: random(1000)
    });

    mv_ripples.push(
      new MV_Ripple(
        width / 2,
        height / 2,
        map(note.velocity, 0, 1, 140, 420),
        [190, 110, 255],
        map(note.velocity, 0, 1, 18, 55),
        1.5
      )
    );
  };
}


// --------------------------------------------------
// HOOK SYNTH NOTE
// Makes playSynthNote() create a visible centre pulse
// --------------------------------------------------

function mv_hookSynth() {
  if (mv_synthHooked) {
    return;
  }

  if (typeof playSynthNote !== "function") {
    return;
  }

  let originalPlaySynthNote = playSynthNote;

  window.playSynthNote = function() {
    originalPlaySynthNote();
    mv_synthPulse = 1;
  };

  mv_synthHooked = true;
}