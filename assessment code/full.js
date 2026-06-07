// --------------------------------------------------
// FINAL AUDIO-REACTIVE VISUAL LAYER
// Copy-paste this as teammateVisual.js
//
// This file should NOT contain setup() or draw().
// testvis.js should call:
//
// mv_setup();
// mv_hookHits();
// mv_draw();
// --------------------------------------------------


// --------------------------------------------------
// GLOBAL STATE
// --------------------------------------------------

let mv_ready = false;
let mv_t = 0;

let mv_particles = [];
let mv_hexCells = [];
let mv_orbiters = [];
let mv_bassWaves = [];
let mv_drumShards = [];
let mv_drumBursts = [];
let mv_guitarTrails = [];
let mv_stringWaves = [];

let mv_bassHitPulse = 0;
let mv_drumHitPulse = 0;
let mv_guitarHitPulse = 0;
let mv_stringsHitPulse = 0;
let mv_synthPulse = 0;

let mv_wholeRingRotation = 0;
let mv_synthRingRotation1 = 0;
let mv_synthRingRotation2 = 0;

let mv_hitsHooked = false;
let mv_synthHooked = false;


// --------------------------------------------------
// COLOURS
// --------------------------------------------------

let MV_DEEP_BG = [4, 6, 22];

let MV_BASS_BLUE = [60, 150, 255];
let MV_BASS_CYAN = [40, 240, 255];

let MV_DRUM_RED = [255, 70, 60];
let MV_DRUM_ORANGE = [255, 135, 45];

let MV_GUITAR_GOLD = [255, 215, 75];
let MV_GUITAR_YELLOW = [255, 245, 150];

let MV_STRINGS_PURPLE = [190, 110, 255];
let MV_STRINGS_PINK = [255, 120, 230];

let MV_SYNTH_CYAN = [80, 245, 255];
let MV_SYNTH_PINK = [255, 80, 220];

let MV_GREEN = [120, 255, 160];

let MV_WHITE = [255, 255, 255];


// --------------------------------------------------
// SAFE OUTPUT HELPERS
// --------------------------------------------------

function mv_energy(value) {
  if (typeof value === "undefined") {
    return 0;
  }

  return constrain(value / 255, 0, 1);
}

function mv_sub() {
  return mv_energy(
    typeof wholeSubBassEnergy !== "undefined" ? wholeSubBassEnergy : 0
  );
}

function mv_bass() {
  return mv_energy(
    typeof wholeBassEnergy !== "undefined" ? wholeBassEnergy : 0
  );
}

function mv_lowMid() {
  return mv_energy(
    typeof wholeLowMidEnergy !== "undefined" ? wholeLowMidEnergy : 0
  );
}

function mv_mid() {
  return mv_energy(
    typeof wholeMidEnergy !== "undefined" ? wholeMidEnergy : 0
  );
}

function mv_presence() {
  return mv_energy(
    typeof wholePresenceEnergy !== "undefined" ? wholePresenceEnergy : 0
  );
}

function mv_high() {
  return mv_energy(
    typeof wholeHighEnergy !== "undefined" ? wholeHighEnergy : 0
  );
}

function mv_centroid() {
  if (typeof wholeCentroidFreq === "undefined") {
    return 0;
  }

  return constrain(map(wholeCentroidFreq, 200, 6000, 0, 1), 0, 1);
}

function mv_synth1Amount() {
  let mid = typeof synth1MidEnergy !== "undefined" ? synth1MidEnergy : 0;
  let high = typeof synth1HighEnergy !== "undefined" ? synth1HighEnergy : 0;

  return constrain((mid + high) / 510, 0, 1);
}

function mv_synth2Amount() {
  let lowMid =
    typeof synth2LowMidEnergy !== "undefined" ? synth2LowMidEnergy : 0;

  let presence =
    typeof synth2PresenceEnergy !== "undefined" ? synth2PresenceEnergy : 0;

  return constrain((lowMid + presence) / 510, 0, 1);
}

function mv_synth1HighAmount() {
  return mv_energy(
    typeof synth1HighEnergy !== "undefined" ? synth1HighEnergy : 0
  );
}

function mv_synth2HighAmount() {
  return mv_energy(
    typeof synth2HighEnergy !== "undefined" ? synth2HighEnergy : 0
  );
}

function mv_synth1Centroid() {
  if (typeof synth1CentroidFreq === "undefined") {
    return 0;
  }

  return constrain(map(synth1CentroidFreq, 0, 8000, 0, 1), 0, 1);
}

function mv_synth2Centroid() {
  if (typeof synth2CentroidFreq === "undefined") {
    return 0;
  }

  return constrain(map(synth2CentroidFreq, 0, 8000, 0, 1), 0, 1);
}

function mv_lerpColour(a, b, amt) {
  return [
    lerp(a[0], b[0], amt),
    lerp(a[1], b[1], amt),
    lerp(a[2], b[2], amt)
  ];
}

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
// SETUP VISUAL SYSTEM
// --------------------------------------------------

function mv_setup() {
  mv_ready = true;
  mv_t = 0;

  mv_particles = [];
  mv_hexCells = [];
  mv_orbiters = [];
  mv_bassWaves = [];
  mv_drumShards = [];
  mv_drumBursts = [];
  mv_guitarTrails = [];
  mv_stringWaves = [];

  mv_bassHitPulse = 0;
  mv_drumHitPulse = 0;
  mv_guitarHitPulse = 0;
  mv_stringsHitPulse = 0;
  mv_synthPulse = 0;

  mv_wholeRingRotation = 0;
  mv_synthRingRotation1 = 0;
  mv_synthRingRotation2 = 0;

  let hexSize = 58;
  let cols = ceil(width / (hexSize * 1.73)) + 3;
  let rows = ceil(height / (hexSize * 1.5)) + 3;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      mv_hexCells.push({
        x: col * hexSize * 1.73 + (row % 2) * hexSize * 0.866,
        y: row * hexSize * 1.5,
        size: hexSize,
        row: row,
        col: col,
        index: row * cols + col
      });
    }
  }

  for (let i = 0; i < 360; i++) {
    mv_particles.push(new MV_AudioParticle(i));
  }

  for (let i = 0; i < 30; i++) {
    mv_orbiters.push(new MV_AudioOrbiter(i));
  }
}


// --------------------------------------------------
// MAIN DRAW FUNCTION
// --------------------------------------------------

function mv_draw() {
  if (!mv_ready) {
    return;
  }

  if (!mv_synthHooked) {
    mv_hookSynth();
  }

  mv_t++;

  let sub = mv_sub();
  let bass = mv_bass();
  let lowMid = mv_lowMid();
  let mid = mv_mid();
  let presence = mv_presence();
  let high = mv_high();
  let centroid = mv_centroid();

  let synth1 = mv_synth1Amount();
  let synth2 = mv_synth2Amount();

  mv_bassHitPulse *= 0.92;
  mv_drumHitPulse *= 0.88;
  mv_guitarHitPulse *= 0.9;
  mv_stringsHitPulse *= 0.94;
  mv_synthPulse *= 0.9;

  mv_drawWorldBackground(sub, bass, lowMid, mid, presence, high, centroid);
  mv_drawBassBlueWorld(sub, bass);
  mv_drawHexGrid(lowMid, presence, centroid);
  mv_drawAuroraLayer(mid, presence, high, centroid);

  mv_drawWholeSpectrumRing(bass, high, centroid);
  mv_drawSynthFFTRings(synth1, synth2);

  mv_drawOrbiters(bass, mid, high, synth1, synth2);
  mv_drawParticles(bass, mid, presence, high);

  mv_drawBassWaves();
  mv_drawDrumBursts();
  mv_drawDrumShards();
  mv_drawGuitarTrails();
  mv_drawStringWaves();

  mv_drawSynthSignal();
  mv_drawVocalPlanets();

  mv_drawBottomSpectrum(bass, high, centroid);
}


// --------------------------------------------------
// FULL MIX BACKGROUND
// --------------------------------------------------

function mv_drawWorldBackground(sub, bass, lowMid, mid, presence, high, centroid) {
  push();

  noStroke();

  let base = mv_lerpColour([4, 6, 22], [10, 18, 48], bass);
  let warm = mv_lerpColour(base, [45, 10, 55], centroid * 0.7);

  fill(warm[0], warm[1], warm[2], 105);
  rect(0, 0, width, height);

  blendMode(ADD);

  fill(30, 105, 255, 18 + bass * 35 + mv_bassHitPulse * 40);
  circle(
    width / 2,
    height / 2,
    420 + sub * 320 + bass * 260 + mv_bassHitPulse * 260
  );

  fill(255, 60, 210, 8 + high * 26 + centroid * 18);
  circle(
    width * 0.7,
    height * 0.25,
    240 + high * 250 + centroid * 160
  );

  fill(50, 255, 190, 8 + presence * 30);
  circle(
    width * 0.22,
    height * 0.5,
    220 + presence * 320 + mid * 120
  );

  pop();
}


// --------------------------------------------------
// BASS WORLD
// --------------------------------------------------

function mv_drawBassBlueWorld(sub, bass) {
  push();

  translate(width / 2, height / 2);
  blendMode(ADD);
  noFill();

  let deepPressure = sub * 190 + bass * 90 + mv_bassHitPulse * 280;

  stroke(50, 150, 255, 35 + sub * 110);
  strokeWeight(2 + sub * 6);
  circle(0, 0, 270 + deepPressure);

  stroke(60, 235, 255, 25 + bass * 95);
  strokeWeight(1.5 + bass * 3);
  circle(0, 0, 400 + bass * 260 + mv_bassHitPulse * 170);

  stroke(255, 255, 255, 12 + mv_bassHitPulse * 100);
  strokeWeight(1);
  circle(0, 0, 560 + mv_bassHitPulse * 340);

  pop();
}


// --------------------------------------------------
// HEX GRID
// --------------------------------------------------

function mv_drawHexGrid(lowMid, presence, centroid) {
  push();

  noFill();
  blendMode(ADD);

  for (let cell of mv_hexCells) {
    let d = dist(cell.x, cell.y, width / 2, height / 2);

    let wave =
      sin(d * 0.018 - mv_t * (0.015 + lowMid * 0.04)) * 0.5 + 0.5;

    let sizeControl =
      0.62 +
      wave * 0.16 +
      lowMid * 0.28 +
      presence * 0.14 +
      mv_bassHitPulse * 0.12;

    let colourShift = (centroid + cell.index * 0.005) % 1;
    let col = mv_lerpColour(MV_BASS_CYAN, MV_SYNTH_PINK, colourShift);

    stroke(
      col[0],
      col[1],
      col[2],
      7 + lowMid * 45 + presence * 35
    );

    strokeWeight(0.45 + lowMid * 2.6 + presence * 1.5);

    beginShape();

    for (let i = 0; i < 6; i++) {
      let a = map(i, 0, 6, 0, TWO_PI) - PI / 6;
      let r = cell.size * sizeControl;

      vertex(cell.x + cos(a) * r, cell.y + sin(a) * r);
    }

    endShape(CLOSE);
  }

  pop();
}


// --------------------------------------------------
// AURORA
// --------------------------------------------------

function mv_drawAuroraLayer(mid, presence, high, centroid) {
  push();

  noFill();
  blendMode(ADD);

  for (let layer = 0; layer < 7; layer++) {
    let col = mv_lerpColour(
      MV_BASS_CYAN,
      layer % 2 === 0 ? MV_SYNTH_PINK : MV_GREEN,
      (centroid + layer * 0.12) % 1
    );

    stroke(
      col[0],
      col[1],
      col[2],
      12 + mid * 30 + presence * 35 + high * 20
    );

    strokeWeight(1 + presence * 2.2);

    beginShape();

    for (let x = -30; x <= width + 30; x += 18) {
      let yBase = map(layer, 0, 6, height * 0.08, height * 0.78);

      let motion =
        sin(
          x * (0.005 + centroid * 0.004) +
          mv_t * (0.006 + mid * 0.04) +
          layer * 0.8
        ) *
        (24 + mid * 95);

      let sharp =
        sin(x * 0.018 - mv_t * (0.012 + presence * 0.03)) *
        (8 + presence * 42);

      curveVertex(x, yBase + motion + sharp);
    }

    endShape();
  }

  pop();
}


// --------------------------------------------------
// WHOLE SPECTRUM RING
// --------------------------------------------------

function mv_drawWholeSpectrumRing(bass, high, centroid) {
  if (
    typeof wholeSpectrum === "undefined" ||
    !wholeSpectrum ||
    wholeSpectrum.length === 0
  ) {
    return;
  }

  push();

  translate(width / 2, height / 2);

  mv_wholeRingRotation += 0.001 + centroid * 0.012 + high * 0.008;
  rotate(mv_wholeRingRotation);

  blendMode(ADD);
  noFill();

  let bins = min(wholeSpectrum.length, 512);
  let step = max(1, floor(bins / 160));

  let col = mv_lerpColour(MV_BASS_CYAN, MV_SYNTH_PINK, centroid);

  stroke(col[0], col[1], col[2], 90 + high * 120);
  strokeWeight(1.4 + high * 2.6);

  beginShape();

  for (let i = 0; i < bins; i += step) {
    let angle = map(i, 0, bins, 0, TWO_PI);
    let amp = wholeSpectrum[i];

    let radius =
      170 +
      bass * 70 +
      map(amp, 0, 255, 0, 165);

    let x = cos(angle) * radius;
    let y = sin(angle) * radius;

    curveVertex(x, y);
  }

  endShape(CLOSE);

  pop();
}


// --------------------------------------------------
// SYNTH / PIANO FFT RINGS
// --------------------------------------------------

function mv_drawSynthFFTRings(synth1, synth2) {
  if (
    typeof synth1Spectrum === "undefined" ||
    typeof synth2Spectrum === "undefined"
  ) {
    return;
  }

  let c1 = mv_synth1Centroid();
  let c2 = mv_synth2Centroid();

  let h1 = mv_synth1HighAmount();
  let h2 = mv_synth2HighAmount();

  mv_synthRingRotation1 += 0.002 + c1 * 0.018 + synth1 * 0.01;
  mv_synthRingRotation2 -= 0.002 + c2 * 0.02 + synth2 * 0.012;

  mv_drawSpectrumCircle(
    synth1Spectrum,
    width / 2,
    height / 2,
    125 + synth1 * 110,
    50 + synth1 * 80,
    mv_synthRingRotation1,
    MV_SYNTH_CYAN,
    70 + h1 * 140
  );

  mv_drawSpectrumCircle(
    synth2Spectrum,
    width / 2,
    height / 2,
    90 + synth2 * 95,
    45 + synth2 * 75,
    mv_synthRingRotation2,
    MV_SYNTH_PINK,
    70 + h2 * 140
  );
}

function mv_drawSpectrumCircle(
  spectrum,
  cx,
  cy,
  baseRadius,
  movementAmount,
  rotationAmount,
  colour,
  alpha
) {
  if (!spectrum || spectrum.length === 0) {
    return;
  }

  push();

  translate(cx, cy);
  rotate(rotationAmount);
  blendMode(ADD);

  noFill();
  stroke(colour[0], colour[1], colour[2], alpha);
  strokeWeight(1.8);

  beginShape();

  let bins = min(spectrum.length, 512);
  let step = max(1, floor(bins / 120));

  for (let i = 0; i < bins; i += step) {
    let angle = map(i, 0, bins, 0, TWO_PI);
    let amp = spectrum[i];

    let radius = baseRadius + map(amp, 0, 255, 0, movementAmount);

    curveVertex(cos(angle) * radius, sin(angle) * radius);
  }

  endShape(CLOSE);

  pop();
}


// --------------------------------------------------
// OBJECT SYSTEMS
// --------------------------------------------------

function mv_drawOrbiters(bass, mid, high, synth1, synth2) {
  for (let orb of mv_orbiters) {
    orb.update(bass, mid, high, synth1, synth2);
    orb.show(bass, high, synth1, synth2);
  }
}

function mv_drawParticles(bass, mid, presence, high) {
  for (let p of mv_particles) {
    p.update(mid, presence, high);
    p.show(high, presence);
  }
}


// --------------------------------------------------
// BASS WAVES
// --------------------------------------------------

function mv_drawBassWaves() {
  for (let i = mv_bassWaves.length - 1; i >= 0; i--) {
    let wave = mv_bassWaves[i];

    wave.life--;
    let progress = 1 - wave.life / wave.maxLife;
    let alpha = map(wave.life, 0, wave.maxLife, 0, wave.alpha);

    push();

    translate(width / 2, height / 2);
    blendMode(ADD);
    noFill();

    stroke(MV_BASS_BLUE[0], MV_BASS_BLUE[1], MV_BASS_BLUE[2], alpha);
    strokeWeight(2 + wave.velocity * 4);
    circle(0, 0, wave.radius + progress * wave.expansion);

    stroke(MV_BASS_CYAN[0], MV_BASS_CYAN[1], MV_BASS_CYAN[2], alpha * 0.6);
    strokeWeight(1);
    circle(0, 0, wave.radius * 0.65 + progress * wave.expansion * 0.7);

    pop();

    if (wave.life <= 0) {
      mv_bassWaves.splice(i, 1);
    }
  }
}


// --------------------------------------------------
// DRUM BURSTS / SHARDS
// --------------------------------------------------

function mv_drawDrumBursts() {
  for (let i = mv_drumBursts.length - 1; i >= 0; i--) {
    let burst = mv_drumBursts[i];

    burst.life--;

    let alpha = map(burst.life, 0, burst.maxLife, 0, burst.alpha);
    let progress = 1 - burst.life / burst.maxLife;

    push();

    translate(burst.x, burst.y);
    blendMode(ADD);
    noFill();

    stroke(MV_DRUM_RED[0], MV_DRUM_RED[1], MV_DRUM_RED[2], alpha);
    strokeWeight(2 + burst.velocity * 3);

    let size = burst.size + progress * burst.size * 2.4;

    rectMode(CENTER);
    rotate(burst.rotation + progress * 1.2);
    rect(0, 0, size, size, 3);

    stroke(MV_DRUM_ORANGE[0], MV_DRUM_ORANGE[1], MV_DRUM_ORANGE[2], alpha * 0.8);
    line(-size * 0.7, 0, size * 0.7, 0);
    line(0, -size * 0.7, 0, size * 0.7);

    pop();

    if (burst.life <= 0) {
      mv_drumBursts.splice(i, 1);
    }
  }
}

function mv_drawDrumShards() {
  for (let i = mv_drumShards.length - 1; i >= 0; i--) {
    let shard = mv_drumShards[i];

    shard.update();
    shard.show();

    if (shard.done) {
      mv_drumShards.splice(i, 1);
    }
  }
}


// --------------------------------------------------
// GUITAR TRAILS
// --------------------------------------------------

function mv_drawGuitarTrails() {
  for (let i = mv_guitarTrails.length - 1; i >= 0; i--) {
    let trail = mv_guitarTrails[i];

    trail.life--;

    let alpha = map(trail.life, 0, trail.maxLife, 0, trail.alpha);
    let progress = 1 - trail.life / trail.maxLife;

    push();

    blendMode(ADD);
    noFill();

    stroke(MV_GUITAR_GOLD[0], MV_GUITAR_GOLD[1], MV_GUITAR_GOLD[2], alpha);
    strokeWeight(trail.weight + progress * 2);

    beginShape();
    curveVertex(trail.x1, trail.y1);
    curveVertex(trail.x1, trail.y1);
    curveVertex(
      trail.cx + sin(mv_t * 0.035 + trail.seed) * 60,
      trail.cy + cos(mv_t * 0.032 + trail.seed) * 42
    );
    curveVertex(trail.x2, trail.y2);
    curveVertex(trail.x2, trail.y2);
    endShape();

    stroke(MV_GUITAR_YELLOW[0], MV_GUITAR_YELLOW[1], MV_GUITAR_YELLOW[2], alpha * 0.55);
    strokeWeight(1);
    line(trail.x1, trail.y1, trail.x2, trail.y2);

    pop();

    if (trail.life <= 0) {
      mv_guitarTrails.splice(i, 1);
    }
  }
}


// --------------------------------------------------
// STRING WAVES
// --------------------------------------------------

function mv_drawStringWaves() {
  for (let i = mv_stringWaves.length - 1; i >= 0; i--) {
    let wave = mv_stringWaves[i];

    wave.life--;

    let alpha = map(wave.life, 0, wave.maxLife, 0, wave.alpha);
    let progress = 1 - wave.life / wave.maxLife;

    push();

    translate(width / 2, height / 2);
    blendMode(ADD);
    noFill();

    stroke(MV_STRINGS_PURPLE[0], MV_STRINGS_PURPLE[1], MV_STRINGS_PURPLE[2], alpha);
    strokeWeight(1.5 + progress * 1.5);

    beginShape();

    let radius = wave.radius + progress * wave.expansion;

    for (let angle = 0; angle <= TWO_PI + 0.1; angle += 0.1) {
      let wobble =
        sin(angle * 5 + mv_t * 0.025 + wave.seed) *
        (14 + mv_stringsHitPulse * 32);

      let x = cos(angle) * (radius + wobble);
      let y = sin(angle) * (radius + wobble * 0.65);

      curveVertex(x, y);
    }

    endShape(CLOSE);

    stroke(MV_STRINGS_PINK[0], MV_STRINGS_PINK[1], MV_STRINGS_PINK[2], alpha * 0.45);
    circle(0, 0, radius * 1.3);

    pop();

    if (wave.life <= 0) {
      mv_stringWaves.splice(i, 1);
    }
  }
}


// --------------------------------------------------
// SYNTH SIGNAL
// --------------------------------------------------

function mv_drawSynthSignal() {
  if (mv_synthPulse <= 0.01) {
    return;
  }

  push();

  translate(width / 2, height / 2);
  blendMode(ADD);

  let size = 45 + mv_synthPulse * 240;

  noStroke();

  fill(MV_SYNTH_CYAN[0], MV_SYNTH_CYAN[1], MV_SYNTH_CYAN[2], 25 + mv_synthPulse * 130);
  circle(0, 0, size * 2.3);

  fill(MV_WHITE[0], MV_WHITE[1], MV_WHITE[2], 120 + mv_synthPulse * 120);
  circle(0, 0, size * 0.42);

  noFill();
  stroke(MV_SYNTH_CYAN[0], MV_SYNTH_CYAN[1], MV_SYNTH_CYAN[2], 120 + mv_synthPulse * 120);
  strokeWeight(2);
  circle(0, 0, size);

  pop();
}


// --------------------------------------------------
// VOCAL PLANETS
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
    let hasPitch = freq > 0 && noteName !== "-";

    let freqAmount = hasPitch
      ? constrain(map(freq, 80, 1200, 0, 1), 0, 1)
      : 0;

    let angle =
      mv_t * (0.007 + i * 0.004 + freqAmount * 0.006) +
      i * TWO_PI / 3;

    let orbitRadius = 105 + i * 78 + freqAmount * 130;

    let x = width / 2 + cos(angle) * orbitRadius;
    let y = height / 2 + sin(angle) * orbitRadius * 0.72;

    let colour = hasPitch ? mv_noteColour(noteName) : [160, 170, 190];

    let size = hasPitch
      ? 20 + freqAmount * 58
      : 18 + sin(mv_t * 0.05 + i) * 4;

    noStroke();

    fill(colour[0], colour[1], colour[2], 24);
    circle(x, y, size * 3.7);

    fill(colour[0], colour[1], colour[2], 78);
    circle(x, y, size * 1.9);

    fill(colour[0], colour[1], colour[2], 225);
    circle(x, y, size);

    fill(255, 225);
    textAlign(CENTER, CENTER);
    textSize(12);

    if (hasPitch) {
      text("V" + (i + 1) + " " + noteName, x, y + size + 16);
    } else {
      text("V" + (i + 1), x, y + size + 16);
    }
  }

  pop();
}


// --------------------------------------------------
// BOTTOM SPECTRUM
// --------------------------------------------------

function mv_drawBottomSpectrum(bass, high, centroid) {
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

    let barHeight =
      map(amp, 0, 255, 0, height * 0.24) *
      (1 + bass * 0.7);

    let x = map(i, 0, bins, 0, width);
    let barWidth = width / bins + 1;

    let colour = mv_lerpColour(
      MV_BASS_CYAN,
      MV_SYNTH_PINK,
      (i / bins + centroid) % 1
    );

    fill(
      colour[0],
      colour[1],
      colour[2],
      45 + bass * 65 + high * 45
    );

    rect(x, height - barHeight, barWidth, barHeight);
  }
}


// --------------------------------------------------
// CLASSES
// --------------------------------------------------

class MV_AudioParticle {
  constructor(index) {
    this.index = index;

    this.x = random(width);
    this.y = random(height);

    this.previousX = this.x;
    this.previousY = this.y;

    this.baseSpeed = random(0.35, 1.7);
    this.baseSize = random(0.7, 2.4);
    this.angleOffset = random(TWO_PI);

    this.colour = random([
      MV_BASS_CYAN,
      MV_SYNTH_PINK,
      MV_GUITAR_GOLD,
      MV_STRINGS_PURPLE,
      MV_GREEN
    ]);
  }

  update(mid, presence, high) {
    this.previousX = this.x;
    this.previousY = this.y;

    let angle =
      this.angleOffset +
      sin(mv_t * (0.004 + mid * 0.035) + this.index * 0.09) *
        (1.1 + presence * 2.4);

    let speed =
      this.baseSpeed *
      (0.6 + mid * 2.4 + presence * 1.6 + high * 1.2);

    this.x += cos(angle) * speed;
    this.y += sin(angle) * speed;

    if (this.x < -40) this.x = width + 40;
    if (this.x > width + 40) this.x = -40;
    if (this.y < -40) this.y = height + 40;
    if (this.y > height + 40) this.y = -40;
  }

  show(high, presence) {
    let alpha = 60 + high * 145 + presence * 60;

    stroke(
      this.colour[0],
      this.colour[1],
      this.colour[2],
      alpha
    );

    strokeWeight(this.baseSize + high * 1.4);

    line(this.previousX, this.previousY, this.x, this.y);
  }
}


class MV_AudioOrbiter {
  constructor(index) {
    this.index = index;

    this.cx = random(width * 0.15, width * 0.85);
    this.cy = random(height * 0.15, height * 0.85);

    this.rx = random(60, min(width, height) * 0.28);
    this.ry = this.rx * random(0.35, 0.95);

    this.angle = random(TWO_PI);
    this.tilt = random(TWO_PI);

    this.baseSpeed = random(0.0015, 0.006) * (random() < 0.5 ? -1 : 1);
    this.size = random(8, 24);

    this.colourA = random([MV_BASS_CYAN, MV_SYNTH_PINK, MV_GUITAR_GOLD, MV_STRINGS_PURPLE]);
    this.colourB = random([MV_WHITE, MV_BASS_BLUE, MV_SYNTH_CYAN, MV_DRUM_ORANGE]);

    this.shapeType = floor(random(5));
    this.rotation = random(TWO_PI);
  }

  update(bass, mid, high, synth1, synth2) {
    let synthDrive = synth1 * 0.8 + synth2 * 0.8;

    this.angle += this.baseSpeed * (1 + bass * 2.8 + mid * 1.4 + synthDrive);
    this.rotation += 0.004 + high * 0.05 + synthDrive * 0.035;
  }

  show(bass, high, synth1, synth2) {
    let px = cos(this.angle) * this.rx;
    let py = sin(this.angle) * this.ry;

    let x = px * cos(this.tilt) - py * sin(this.tilt) + this.cx;
    let y = px * sin(this.tilt) + py * cos(this.tilt) + this.cy;

    let synthDrive = synth1 + synth2;

    let size =
      this.size *
      (1 + bass * 0.55 + high * 0.35 + synthDrive * 0.48);

    push();

    translate(x, y);
    rotate(this.rotation);
    blendMode(ADD);

    noStroke();

    fill(
      this.colourA[0],
      this.colourA[1],
      this.colourA[2],
      28 + high * 55
    );

    circle(0, 0, size * 4);

    fill(
      this.colourA[0],
      this.colourA[1],
      this.colourA[2],
      215
    );

    if (this.shapeType === 0) {
      circle(0, 0, size);
    } else if (this.shapeType === 1) {
      rectMode(CENTER);
      rect(0, 0, size, size, 3);
    } else if (this.shapeType === 2) {
      beginShape();
      vertex(0, -size);
      vertex(size * 0.65, 0);
      vertex(0, size);
      vertex(-size * 0.65, 0);
      endShape(CLOSE);
    } else if (this.shapeType === 3) {
      noFill();
      stroke(
        this.colourA[0],
        this.colourA[1],
        this.colourA[2],
        220
      );
      strokeWeight(2);
      circle(0, 0, size * 1.8);
    } else {
      beginShape();

      for (let i = 0; i < 10; i++) {
        let a = map(i, 0, 10, 0, TWO_PI) - HALF_PI;
        let r = i % 2 === 0 ? size : size * 0.45;
        vertex(cos(a) * r, sin(a) * r);
      }

      endShape(CLOSE);
    }

    pop();
  }
}


class MV_DrumShard {
  constructor(x, y, velocity) {
    this.x = x;
    this.y = y;

    let angle = random(TWO_PI);
    let speed = random(2, 5 + velocity * 8);

    this.vx = cos(angle) * speed;
    this.vy = sin(angle) * speed;

    this.size = random(4, 12 + velocity * 12);
    this.life = random(0.45, 1);
    this.rotation = random(TWO_PI);
    this.rotationSpeed = random(-0.18, 0.18);
  }

  get done() {
    return this.life < 0.015;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    this.vy += 0.12;

    this.vx *= 0.97;
    this.vy *= 0.97;

    this.rotation += this.rotationSpeed;
    this.life = lerp(this.life, 0, 0.058);
  }

  show() {
    push();

    translate(this.x, this.y);
    rotate(this.rotation);
    blendMode(ADD);

    noStroke();

    fill(
      MV_DRUM_ORANGE[0],
      MV_DRUM_ORANGE[1],
      MV_DRUM_ORANGE[2],
      this.life * 220
    );

    rectMode(CENTER);
    rect(0, 0, this.size, this.size, 2);

    fill(
      MV_DRUM_RED[0],
      MV_DRUM_RED[1],
      MV_DRUM_RED[2],
      this.life * 150
    );

    rect(0, 0, this.size * 0.55, this.size * 0.55, 2);

    pop();
  }
}


// --------------------------------------------------
// HOOK MIDI OUTPUTS
// --------------------------------------------------

function mv_hookHits() {
  if (mv_hitsHooked) {
    return;
  }

  let oldBassVisual =
    typeof createBassVisual === "function" ? createBassVisual : null;

  let oldDrumVisual =
    typeof createDrumVisual === "function" ? createDrumVisual : null;

  let oldGuitarVisual =
    typeof createGuitarVisual === "function" ? createGuitarVisual : null;

  let oldStringsVisual =
    typeof createStringsVisual === "function" ? createStringsVisual : null;


  window.createBassVisual = function(note) {
    if (oldBassVisual) {
      oldBassVisual(note);
    }

    mv_bassHitPulse = max(mv_bassHitPulse, note.velocity);

    mv_bassWaves.push({
      radius: map(note.velocity, 0, 1, 120, 280),
      expansion: map(note.velocity, 0, 1, 260, 620),
      velocity: note.velocity,
      alpha: map(note.velocity, 0, 1, 55, 130),
      life: 95,
      maxLife: 95
    });
  };


  window.createDrumVisual = function(note) {
    if (oldDrumVisual) {
      oldDrumVisual(note);
    }

    mv_drumHitPulse = max(mv_drumHitPulse, note.velocity);

    let x = random(width * 0.15, width * 0.85);
    let y = random(height * 0.15, height * 0.8);

    mv_drumBursts.push({
      x: x,
      y: y,
      size: map(note.velocity, 0, 1, 35, 150),
      velocity: note.velocity,
      rotation: random(TWO_PI),
      alpha: map(note.velocity, 0, 1, 50, 150),
      life: 35,
      maxLife: 35
    });

    let shardCount = floor(map(note.velocity, 0, 1, 8, 34));

    for (let i = 0; i < shardCount; i++) {
      mv_drumShards.push(new MV_DrumShard(x, y, note.velocity));
    }
  };


  window.createGuitarVisual = function(note) {
    if (oldGuitarVisual) {
      oldGuitarVisual(note);
    }

    mv_guitarHitPulse = max(mv_guitarHitPulse, note.velocity);

    let pitchAmount = 0.5;

    if (typeof note.midi !== "undefined") {
      pitchAmount = constrain(map(note.midi, 40, 90, 0, 1), 0, 1);
    }

    let side = pitchAmount < 0.5 ? -1 : 1;

    mv_guitarTrails.push({
      x1: width / 2,
      y1: height / 2,
      cx: width / 2 + side * map(pitchAmount, 0, 1, 90, 330),
      cy: map(pitchAmount, 0, 1, height * 0.8, height * 0.2),
      x2: map(pitchAmount, 0, 1, width * 0.12, width * 0.88),
      y2: random(height * 0.18, height * 0.88),
      seed: random(1000),
      life: 65,
      maxLife: 65,
      alpha: map(note.velocity, 0, 1, 60, 200),
      weight: map(note.velocity, 0, 1, 1, 4)
    });
  };


  window.createStringsVisual = function(note) {
    if (oldStringsVisual) {
      oldStringsVisual(note);
    }

    mv_stringsHitPulse = max(mv_stringsHitPulse, note.velocity);

    mv_stringWaves.push({
      radius: map(note.velocity, 0, 1, 120, 300),
      expansion: map(note.velocity, 0, 1, 300, 680),
      alpha: map(note.velocity, 0, 1, 30, 105),
      seed: random(1000),
      life: 145,
      maxLife: 145
    });
  };

  mv_hitsHooked = true;
}


// --------------------------------------------------
// HOOK SYNTH OUTPUT
// --------------------------------------------------

function mv_hookSynth() {
  if (mv_synthHooked) {
    return;
  }

  if (typeof playSynthNote !== "function") {
    return;
  }

  let oldPlaySynthNote = playSynthNote;

  window.playSynthNote = function() {
    oldPlaySynthNote();
    mv_synthPulse = 1;
  };

  mv_synthHooked = true;
}