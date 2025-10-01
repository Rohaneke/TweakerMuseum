// Random Flow Field Particles — p5.js
// Click to reshuffle everything. Press 'S' to save a frame, 'C' to clear trails.

// Performance tips:
// - On low-powered devices, reduce PARTICLE_DENSITY_MULT or set pixelDensity(1).

let cols, rows;
let scaleStep = 64;        // Grid cell size (smaller => more detail)
let inc = 0.11;            // Noise sampling increment (spatial)
let zoff = 0;              // Noise z-offset (time)
let zinc = 0.0035;         // Noise time step
let flowfield;             // Array of p5.Vector per grid cell

let particles = [];
let bgColor;
let palette = [];
let seed;

const PARTICLE_DENSITY_MULT = 1; // Particles per pixel
const MAX_PARTICLES = 8000;
const MIN_PARTICLES = 6000;

// UI/feel toggles
let fadeTrails = true;     // If true, draw a faint translucent rect each frame

function setup() {
  // For consistent perf across displays
  pixelDensity(Math.min(1, window.devicePixelRatio));

  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 1);

  resetSketch(true);
}

function resetSketch(newSeed = false) {
  if (newSeed) seed = Math.floor(Math.random() * 1e9);
  randomSeed(seed);
  noiseSeed(seed);

  // Randomize parameters a bit each shuffle
  scaleStep = random([18, 22, 26, 28, 30, 34, 40]);
  inc = random(0.07, 0.15);
  zinc = random(0.010, 0.006);
  zoff = random(1000);

  bgColor = color(random([220, 230, 240, 250, 260, 270]), 25, random(4, 12));
  background(bgColor);

  palette = pickPalette();
  setupFieldAndParticles();
}

function setupFieldAndParticles() {
  cols = floor(width / scaleStep) + 1;
  rows = floor(height / scaleStep) + 1;
  flowfield = new Array(cols * rows);

  const count = constrain(
    floor(width * height * PARTICLE_DENSITY_MULT),
    MIN_PARTICLES,
    MAX_PARTICLES
  );

  particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function pickPalette() {
  // A few curated ranges + random harmonies
  const mode = random(['cool', 'warm', 'candy', 'ocean', 'neon', 'harmony']);
  let pals = [];

  if (mode === 'cool') {
    pals = [
      color(210, 60, 85, 0.8),
      color(195, 45, 90, 0.8),
      color(230, 50, 80, 0.8),
      color(260, 40, 85, 0.8)
    ];
  } else if (mode === 'warm') {
    pals = [
      color(15, 70, 95, 0.85),
      color(35, 80, 95, 0.85),
      color(5, 80, 95, 0.85),
      color(345, 70, 90, 0.85)
    ];
  } else if (mode === 'candy') {
    pals = [
      color(330, 70, 95, 0.85),
      color(280, 60, 95, 0.85),
      color(200, 60, 95, 0.85),
      color(50, 70, 95, 0.85)
    ];
  } else if (mode === 'ocean') {
    pals = [
      color(180, 60, 90, 0.85),
      color(200, 70, 85, 0.85),
      color(160, 50, 80, 0.85),
      color(220, 40, 85, 0.85)
    ];
  } else if (mode === 'neon') {
    pals = [
      color(120, 80, 95, 0.9),
      color(200, 80, 95, 0.9),
      color(300, 80, 95, 0.9),
      color(40, 90, 95, 0.9)
    ];
  } else {
    // 'harmony': pick a random base hue and generate analogs/triads
    const h = random(0, 360);
    const offsets = [0, 30, -30, 180];
    pals = offsets.map(off => color((h + off + 360) % 360, random(45, 85), random(80, 98), 0.85));
  }

  // Shuffle for variety
  return shuffle(pals);
}

function draw() {
  if (fadeTrails) {
    // Soft fade to create trailing effect
    noStroke();
    fill(hue(bgColor), saturation(bgColor), brightness(bgColor), 0.04);
    rect(0, 0, width, height);
  }

  // Recompute the flow field for the current z slice
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      const idx = x + y * cols;
      const angle = noise(xoff, yoff, zoff) * TWO_PI * 4; // Multiplier controls curliness
      const v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[idx] = v;
      xoff += inc;
    }
    yoff += inc;
  }
  zoff += zinc;

  // Draw particles
  for (let p of particles) {
    p.follow(flowfield, cols);
    p.update();
    p.show();
    p.edges();
  }
}

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D().mult(random(0.2, 1));
    this.acc = createVector(0, 0);
    this.maxspeed = random(1.2, 2.6);
    this.prev = this.pos.copy();
    this.hue = hue(random(palette));
    this.col = random(palette);
    this.weight = random(0.6, 1.8);
    this.life = random(260, 1000);
    this.age = 0;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  follow(field, cols) {
    const x = floor(this.pos.x / scaleStep);
    const y = floor(this.pos.y / scaleStep);
    const idx = constrain(x + y * cols, 0, field.length - 1);
    const force = field[idx];
    if (force) this.applyForce(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.age++;
  }

  edges() {
    let bounced = false;
    if (this.pos.x > width) { this.pos.x = 0; this.bounce(); bounced = true; }
    if (this.pos.x < 0)     { this.pos.x = width; this.bounce(); bounced = true; }
    if (this.pos.y > height){ this.pos.y = 0; this.bounce(); bounced = true; }
    if (this.pos.y < 0)     { this.pos.y = height; this.bounce(); bounced = true; }

    if (bounced) this.prev = this.pos.copy();

    // Soft respawn to keep things lively
    if (this.age > this.life) {
      this.pos.set(random(width), random(height));
      this.prev = this.pos.copy();
      this.age = 0;
      this.life = random(0, 1000);
      this.col = random(palette);
    }
  }

  show() {
    stroke(this.col);
    strokeWeight(this.weight);

    // Slight color drift
    const h = (hue(this.col) + sin(frameCount * 0.005 + this.pos.x * 0.002) * 6) % 360;
    const s = constrain(saturation(this.col) + sin(frameCount * 0.004 + this.pos.y * 1) * 5, 35, 100);
    const b = brightness(this.col);

    // Secondary additive stroke for glow
    const alphaMain = 0.35;
    const alphaGlow = 0.08;

    stroke(h, s, b, alphaMain);
    line(this.pos.x, this.pos.y, this.prev.x, this.prev.y);

    stroke(h, s, 100, alphaGlow);
    strokeWeight(this.weight * 3.2);
    line(this.pos.x, this.pos.y, this.prev.x, this.prev.y);

    this.updatePrev();
  }

  bounce() {
    this.vel.mult(0.92);
  }

  updatePrev() {
    this.prev.x = this.pos.x;
    this.prev.y = this.pos.y;
  }
}

function mousePressed() {
  resetSketch(true);
}

function keyPressed() {
  if (key === 'S' || key === 's') {
    saveCanvas('flowfield-' + seed, 'png');
  } else if (key === 'C' || key === 'c') {
    background(bgColor);
  } else if (key === 'F' || key === 'f') {
    fadeTrails = !fadeTrails;
    if (!fadeTrails) background(bgColor);
  } else if (key === 'R' || key === 'r') {
    resetSketch(true);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(bgColor);
  setupFieldAndParticles();
}