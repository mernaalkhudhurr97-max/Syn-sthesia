// --------------------------------------------------
// FINAL VISUAL BACKGROUND
// Uses real outputs from full.js:
// bass hits, drum hits, guitar hits, strings hits,
// synth FFT energy, vocal pitch, instrumentEnergy
// --------------------------------------------------

let mv_particles = [];
let mv_glowDots = [];
let mv_orbiters = [];
let mv_pendulums = [];
let mv_ripples = [];
let mv_shards = [];
let mv_pRings = [];
let mv_hexCells = [];

let mv_t = 0;
let mv_nOff = 0;
let mv_ready = false;

let MV_COLS = [
  [255, 20, 90], [255, 100, 20], [255, 210, 20], [100, 255, 20],
  [20, 255, 140], [20, 200, 255], [20, 100, 255], [160, 20, 255],
  [255, 20, 200], [255, 80, 140], [0, 255, 200], [255, 240, 60],
  [80, 200, 255], [200, 80, 255], [255, 160, 60], [60, 255, 160],
  [255, 60, 255], [60, 255, 255], [200, 255, 60], [255, 255, 60]
];

// --------------------------------------------------
// REAL OUTPUT MAPPING
// --------------------------------------------------

function mv_B() {
  let bassHit =
    typeof instrumentEnergy !== "undefined" && instrumentEnergy.bass
      ? instrumentEnergy.bass
      : 0;

  let synthBass =
    typeof synth1BassEnergy !== "undefined"
      ? synth1BassEnergy / 255
      : 0;

  return constrain(max(bassHit, synthBass), 0, 1);
}

function mv_D() {
  let drumHit =
    typeof instrumentEnergy !== "undefined" && instrumentEnergy.drums
      ? instrumentEnergy.drums
      : 0;

  let synthHigh =
    typeof synth1HighEnergy !== "undefined"
      ? synth1HighEnergy / 255
      : 0;

  return constrain(max(drumHit, synthHigh), 0, 1);
}

function mv_G() {
  return typeof instrumentEnergy !== "undefined" && instrumentEnergy.guitar
    ? constrain(instrumentEnergy.guitar, 0, 1)
    : 0;
}

function mv_S() {
  return typeof instrumentEnergy !== "undefined" && instrumentEnergy.strings
    ? constrain(instrumentEnergy.strings, 0, 1)
    : 0;
}

function mv_M() {
  let synthMid =
    typeof synth1MidEnergy !== "undefined"
      ? synth1MidEnergy / 255
      : 0;

  return constrain(max(mv_G(), mv_S(), synthMid), 0, 1);
}

function mv_H() {
  let high =
    typeof synth1HighEnergy !== "undefined"
      ? synth1HighEnergy / 255
      : 0;

  return constrain(max(high, mv_D()), 0, 1);
}

function mv_C() {
  if (typeof synth1CentroidFreq !== "undefined") {
    return constrain(map(synth1CentroidFreq, 200, 6000, 0, 1), 0, 1);
  }

  return 0;
}

function mv_VocalEnergy() {
  if (typeof vocalFreq === "undefined" || typeof vocalMuted === "undefined") {
    return 0;
  }

  let total = 0;

  for (let i = 0; i < vocalFreq.length; i++) {
    if (!vocalMuted[i] && vocalFreq[i] > 0) {
      total += map(constrain(vocalFreq[i], 80, 1200), 80, 1200, 0.2, 1, true);
    }
  }

  return constrain(total / 3, 0, 1);
}

// --------------------------------------------------
// HELPERS
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

// --------------------------------------------------
// SETUP
// Call this inside setup()
// --------------------------------------------------

function mv_setup() {
  mv_ready = true;
  mv_t = 0;
  mv_nOff = random(1000);

  mv_hexCells = [];

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

  mv_particles = [];
  let particleCount = width < 1000 ? 350 : 650;
  for (let i = 0; i < particleCount; i++) {
    mv_particles.push(new MV_Particle());
  }

  mv_glowDots = [];
  for (let i = 0; i < 60; i++) {
    mv_glowDots.push(new MV_GlowDot());
  }

  mv_pendulums = [];
  for (let i = 0; i < 10; i++) {
    mv_pendulums.push(new MV_Pendulum());
  }

  mv_orbiters = [];
  for (let i = 0; i < 50; i++) {
    mv_orbiters.push(new MV_Orbiter());
  }
}

// --------------------------------------------------
// DRAW
// Call this inside draw()
// --------------------------------------------------

function mv_draw() {
  if (!mv_ready) return;

  mv_t++;
  mv_nOff += 0.0006;

  let bass = mv_B();
  let drums = mv_D();
  let mids = mv_M();
  let highs = mv_H();
  let centroid = mv_C();
  let vocals = mv_VocalEnergy();

  mv_drawReactiveBackground(bass, mids, highs, vocals);
  mv_drawAurora(bass, mids, centroid);
  mv_drawHex(bass, mids);
  mv_drawPlasma(bass, mids);
  mv_drawPRings(bass, vocals);
  mv_drawVocalTrails(vocals);

  for (let p of mv_particles) {
    p.update(bass, mids, vocals);
    p.show();
  }

  for (let g of mv_glowDots) {
    g.update(highs, vocals);
    g.show(highs);
  }

  for (let p of mv_pendulums) {
    p.update(bass);
    p.show();
  }

  for (let o of mv_orbiters) {
    o.update(bass, mids, highs, vocals);
    o.show();
  }

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

  mv_drawSpectrumBar(bass, centroid);
}

// --------------------------------------------------
// BACKGROUND RESPONDS TO FFT + INSTRUMENTS
// --------------------------------------------------

function mv_drawReactiveBackground(bass, mids, highs, vocals) {
  let r = map(bass, 0, 1, 5, 40);
  let g = map(mids, 0, 1, 8, 45);
  let b = map(highs + vocals, 0, 2, 18, 90);

  background(r, g, b, 70);

  noStroke();

  fill(70, 145, 255, 14 + bass * 35);
  ellipse(width * 0.22, height * 0.25, width * (0.45 + bass * 0.25));

  fill(255, 90, 220, 12 + vocals * 35);
  ellipse(width * 0.78, height * 0.65, width * (0.38 + vocals * 0.2));

  fill(190, 110, 255, 10 + mids * 30);
  ellipse(width * 0.5, height * 0.5, width * (0.35 + mids * 0.18));
}

// --------------------------------------------------
// AURORA
// --------------------------------------------------

function mv_drawAurora(bass, mids, centroid) {
  noFill();

  for (let a = 0; a < 8; a++) {
    let hue = (a * 36 + mv_t * 0.25 + centroid * 140 + bass * 60) % 360;
    let col = mv_hsl(hue, 90, 62);

    stroke(col[0], col[1], col[2], 8 + bass * 22 + mids * 10);
    strokeWeight(1.5 + bass * 1.5);

    beginShape();

    for (let x = -20; x <= width + 20; x += 16) {
      let n = noise(x * 0.0013, a * 0.55 + mv_nOff);
      let y = map(n, 0, 1, height * 0.02, height * 0.98);
      y += sin(mv_t * 0.006 + a * 1.2 + x * 0.009) * (22 + bass * 60 + mids * 30);
      curveVertex(x, y);
    }

    endShape();
  }
}

// --------------------------------------------------
// HEX GRID
// --------------------------------------------------

function mv_drawHex(bass, mids) {
  noFill();

  for (let h of mv_hexCells) {
    let pulse = noise(h.s, mv_t * 0.007);
    let hue = (mv_t * 0.35 + h.s * 0.18 + mids * 80) % 360;
    let col = mv_hsl(hue, 80, 60);

    stroke(col[0], col[1], col[2], map(pulse, 0, 1, 2, 12 + bass * 24));
    strokeWeight(0.7 + bass * 0.8);

    beginShape();

    for (let i = 0; i < 6; i++) {
      let ang = map(i, 0, 6, 0, TWO_PI) - PI / 6;
      let r = h.sz * (0.82 + pulse * 0.2 + bass * 0.22 + mids * 0.1);
      vertex(h.x + cos(ang) * r, h.y + sin(ang) * r);
    }

    endShape(CLOSE);
  }
}

// --------------------------------------------------
// PLASMA
// --------------------------------------------------

function mv_drawPlasma(bass, mids) {
  let step = 36;

  noStroke();

  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < height; y += step) {
      let v =
        sin(x * 0.02 + mv_t * 0.025) +
        sin(y * 0.02 + mv_t * 0.022) +
        sin((x + y) * 0.014 + mv_t * 0.018) +
        sin(dist(x, y, width * 0.5, height * 0.5) * 0.022 - mv_t * 0.035);

      let hue = (v * 42 + mv_t * 0.7 + bass * 80 + mids * 70 + 180) % 360;
      let col = mv_hsl(hue, 100, 58);

      fill(col[0], col[1], col[2], 4 + bass * 7 + mids * 4);
      rect(x, y, step, step);
    }
  }
}

// --------------------------------------------------
// PULSE RINGS
// --------------------------------------------------

function mv_drawPRings(bass, vocals) {
  if (mv_t % max(18, floor(65 - bass * 35 - vocals * 20)) === 0) {
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

    p.r += 2.5 + bass * 8 + vocals * 4;
    p.life -= 2;

    stroke(p.col[0], p.col[1], p.col[2], map(p.life, 0, 200, 0, 60));
    strokeWeight(1.5 + bass * 2);
    noFill();
    circle(p.x, p.y, p.r * 2);

    if (p.life <= 0) {
      mv_pRings.splice(i, 1);
    }
  }
}

// --------------------------------------------------
// VOCAL PITCH TRAILS
// --------------------------------------------------

function mv_drawVocalTrails(vocals) {
  if (
    typeof vocalFreq === "undefined" ||
    typeof vocalMuted === "undefined"
  ) {
    return;
  }

  for (let i = 0; i < vocalFreq.length; i++) {
    if (vocalMuted[i] || vocalFreq[i] <= 0) continue;

    let x = width * (0.25 + i * 0.25);
    let y = map(constrain(vocalFreq[i], 80, 1200), 80, 1200, height * 0.82, height * 0.18);
    let size = map(constrain(vocalFreq[i], 80, 1200), 80, 1200, 25, 110);

    let col = i === 0 ? [255, 130, 190] : i === 1 ? [255, 180, 160] : [220, 190, 255];

    noStroke();
    fill(col[0], col[1], col[2], 30);
    circle(x, y, size * 2.4);

    fill(col[0], col[1], col[2], 100);
    circle(x, y, size);

    fill(255, 230);
    textSize(12);

    if (typeof vocalNoteName !== "undefined") {
      text(vocalNoteName[i], x, y + size * 0.8);
    }
  }
}

// --------------------------------------------------
// FFT SPECTRUM BAR
// --------------------------------------------------

function mv_drawSpectrumBar(bass, centroid) {
  let spectrum = null;

  if (typeof synth1Spectrum !== "undefined" && synth1Spectrum && synth1Spectrum.length > 0) {
    spectrum = synth1Spectrum;
  }

  if (!spectrum) return;

  let bins = min(spectrum.length, 256);

  noStroke();

  for (let i = 0; i < bins; i++) {
    let amp = spectrum[i];
    let barH = map(amp, 0, 255, 0, height * 0.28 * (1 + bass * 0.7));
    let x = map(i, 0, bins, 0, width);
    let w2 = width / bins + 1;
    let hue = (map(i, 0, bins, 180, 320) + mv_t * 0.4 + centroid * 80) % 360;
    let col = mv_hsl(hue, 100, 62);

    fill(col[0], col[1], col[2], 40 + bass * 70);
    rect(x, height - barH, w2, barH);
  }
}

// --------------------------------------------------
// CLASSES
// --------------------------------------------------

class MV_Particle {
  constructor() {
    this.reset(true);
  }

  reset(any) {
    this.x = any ? random(width) : random(width);
    this.y = any ? random(height) : random(height);
    this.px = this.x;
    this.py = this.y;
    this.life = floor(random(60, 190));
    this.maxL = this.life;
    this.spd = random(0.6, 2.5);
    this.w = random(0.3, 1.3);
    this.seed = random(1000);
    this.col = random() < 0.75 ? [200, 220, 255] : mv_rc();
  }

  update(bass, mids, vocals) {
    this.px = this.x;
    this.py = this.y;

    let ang = noise(this.x * 0.0015, this.y * 0.0015, mv_nOff + this.seed * 0.01) * TWO_PI * 2.8;
    ang += bass * PI * 0.5 + vocals * PI * 0.25;

    this.x += cos(ang) * this.spd * (1 + bass * 1.8 + vocals);
    this.y += sin(ang) * this.spd * (1 + mids * 1.1);

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

  update(highs, vocals) {
    let ang =
      noise(this.x * 0.0014, this.y * 0.0014, mv_nOff + this.seed * 0.01) *
      TWO_PI *
      2;

    this.x += cos(ang) * (0.22 + highs * 0.8);
    this.y += sin(ang) * (0.22 + vocals * 0.6);

    this.life--;

    if (this.life <= 0) {
      this.reset();
    }
  }

  show(highs) {
    let a = map(this.life, 0, this.maxL * 0.15, 0, 1, true);
    let pulse = 1 + sin(mv_t * 0.06 + this.seed) * 0.28 + highs * 0.5;
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

  update(bass) {
    let grav = 0.002 + bass * 0.006;
    this.aVel = this.aVel * this.damp - grav * sin(this.angle);
    this.angle += this.aVel;
  }

  show() {
    let bx = this.ax + sin(this.angle) * this.len;
    let by = this.ay + cos(this.angle) * this.len;
    let c = this.col;
    let p = 1 + sin(mv_t * 0.04 + this.phase) * 0.18 + mv_B() * 0.4;

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

  update(bass, mids, highs, vocals) {
    this.angle += this.spd * (1 + bass * 2.2 + mids * 0.7 + vocals);
    this.rot += this.rSpd + highs * 0.02;
    this.pulse += 0.05 + vocals * 0.03;
  }

  show() {
    let p = this.pos(this.angle);
    let sz = this.sz * (1 + sin(this.pulse) * 0.14) * (1 + mv_B() * 0.45 + mv_VocalEnergy() * 0.4);

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
// SHAPES
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
        vertex(
          cos(a) * (i % 2 === 0 ? s : s * 0.42),
          sin(a) * (i % 2 === 0 ? s : s * 0.42)
        );
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
        let y = -s * 0.38 * (13 * cos(a) - 5 * cos(2 * a) - 2 * cos(3 * a) - cos(4 * a));
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
// RIPPLE + SHARDS
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
// HOOK REAL HITS INTO OBJECT SYSTEM
// Call this after createBassVisual, etc. exist
// --------------------------------------------------
// --------------------------------------------------
// AUDIO OUTPUT HOOKS
// These functions connect MIDI outputs from the
// bass, drums, guitar, and strings systems to the
// visual background effects.
// --------------------------------------------------

function mv_hookHits() {
  
  let oldBass = typeof createBassVisual === "function" ? createBassVisual : null;
  let oldDrum = typeof createDrumVisual === "function" ? createDrumVisual : null;
  let oldGuitar = typeof createGuitarVisual === "function" ? createGuitarVisual : null;
  let oldStrings = typeof createStringsVisual === "function" ? createStringsVisual : null;

  
  window.createBassVisual = function(note) {
    if (oldBass) oldBass(note);

    mv_ripples.push(
      new MV_Ripple(
        random(width * 0.3, width * 0.7),
        random(height * 0.3, height * 0.7),
        map(note.velocity, 0, 1, 100, 300),
        [70, 145, 255],
        map(note.velocity, 0, 1, 35, 80),
        3 + note.velocity * 2
      )
    );
  };

  window.createDrumVisual = function(note) {
    if (oldDrum) oldDrum(note);

    let cx = random(width * 0.15, width * 0.85);
    let cy = random(height * 0.15, height * 0.8);

    for (let i = 0; i < floor(map(note.velocity, 0, 1, 5, 24)); i++) {
      mv_shards.push(new MV_Shard(cx, cy, note.velocity, [255, 105, 75]));
    }
  };
  
// Guitar notes create yellow ripple effects.
// Higher note velocity creates larger visuals.
  
  window.createGuitarVisual = function(note) {
    if (oldGuitar) oldGuitar(note);

    mv_ripples.push(
      new MV_Ripple(
        random(width * 0.35, width * 0.65),
        random(height * 0.35, height * 0.65),
         map(note.velocity, 0, 1, 90, 280),
        [255, 210, 80],
        map(note.velocity, 0, 1, 28, 70),
        2.5
      )
    );
  };

  // Strings notes create large purple expanding rings.
// Used to emphasise sustained musical sections.

  window.createStringsVisual = function(note) {
    if (oldStrings) oldStrings(note);

    mv_ripples.push(
      new MV_Ripple(
        width / 2,
        height / 2,
        map(note.velocity, 0, 1, 140, 430),
        [190, 110, 255],
        map(note.velocity, 0, 1, 24, 65),
        1.5
      )
    );
  };
}
