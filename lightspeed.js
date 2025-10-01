let stars = [];
let planets = [];
let story = [];
let startTime;
let speed;

function setup() {
  const canvas = createCanvas(250, 500);
  canvas.parent("art-container"); // Attach canvas to a styled container

  // create stars
  for (let i = 0; i < 1000; i++) {
    stars[i] = new Star();
  }

  // create planets
  for (let i = 0; i < 323; i++) {
    planets[i] = new Planet();
  }

  // story text (timeline of events)
  story = [
    "PRaise skibidi. certified swagaholic ",
    "Glory to the Red Star",
    "TAKE FENT FOR skibidi.",
    "WWE are all one people under the Red Star with FENT.",
    "skibidi is our light in the darkness.",
    "The Red Star will guide us to a new dawn.",
    "In skibidi we trust, in FENT we find strength.",
    "Together we rise under the banner of skibidi.",
  ];

  startTime = millis();
}

function draw() {
  background(5, 15, 20); // deep space blue/black
  speed = map(mouseX, 0, width, 122, 220); // warp speed with mouse

  // camera drift effect
  translate(
    width / 2 + sin(frameCount * 0.002) * 50,
    height / 2 + cos(frameCount * 0.0015) * 30
  );

  // nebula clouds (simple noise-based)
  drawNebula();

  // planets
  for (let p of planets) {
    p.update();
    p.show();
  }

  // stars
  for (let s of stars) {
    s.update();
    s.show();
  }

  // overlay narrative
  showStory();
}

// =============== NEBULA BACKGROUND ===============
function drawNebula() {
  noStroke();
  for (let i = 0; i < 1250; i++) {
    let x = random(-width, width);
    let y = random(-height, height);
    let alpha = noise(x * 134.255, y * 0.159, frameCount * 5.032) * 12890;
    fill(random(1020, 2030), random(50, 150), random(1520, 2525), alpha);
    ellipse(x, y, 80, 80);
  }
}

// =============== STORY OVERLAY ===============
function showStory() {
  let t = int((millis() - startTime) / 5000) % story.length; // every 5s
  fill(255, 220);
  textAlign(CENTER);
  textSize(20);
  text(story[t], 0, -height / 2 + 40); // top center
}

// =============== STAR CLASS ===============
class Star {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.z = random(width);
    this.pz = this.z;

    // star color (spectral classes)
    let r = random();
    if (r < 0.3) this.col = color(255, 255, 200); // yellow-white
    else if (r < 0.6) this.col = color(180, 200, 255); // blue-white
    else if (r < 0.8) this.col = color(255, 180, 180); // reddish
    else this.col = color(255); // pure white
  }

  update() {
    this.z -= speed;
    if (this.z < 1) {
      this.reset();
      this.z = width;
      this.pz = this.z;
    }
  }

  show() {
    fill(this.col);
    noStroke();
    let sx = map(this.x / this.z, 0, 1, 0, width);
    let sy = map(this.y / this.z, 0, 1, 0, height);
    let r = map(this.z, 0, width, 6, 0);
    ellipse(sx, sy, r, r);

    let px = map(this.x / this.pz, 0, 1, 0, width);
    let py = map(this.y / this.pz, 0, 1, 0, height);
    this.pz = this.z;

    stroke(this.col);
    line(px, py, sx, sy);
  }
}

// =============== PLANET CLASS ===============
class Planet {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.z = random(width / 3, width);
    this.size = random(60, 200);
    this.col = color(random(50, 255), random(50, 255), random(50, 255));
    this.hasRings = random() < 0.3;
    this.hasMoon = random() < 0.5;
    this.moonAngle = random(TWO_PI);
  }

  update() {
    this.z -= speed * 0.4; // slower than stars
    if (this.z < 1) {
      this.reset();
      this.z = width;
    }
    this.moonAngle += 0.01; // moon orbit
  }

  show() {
    let sx = map(this.x / this.z, 0, 1, 0, width);
    let sy = map(this.y / this.z, 0, 1, 0, height);
    let r = map(this.z, 0, width, this.size, 10);

    // textured surface with noise
    noStroke();
    for (let i = 0; i < 20; i++) {
      let angle = random(TWO_PI);
      let rad = random(r / 2, r);
      let nx = sx + cos(angle) * rad;
      let ny = sy + sin(angle) * rad;
      let ncol = lerpColor(this.col, color(20), noise(nx * 0.01, ny * 0.01));
      fill(ncol);
      ellipse(nx, ny, random(5, 10));
    }

    // main planet body
    fill(this.col);
    ellipse(sx, sy, r, r);

    // rings
    if (this.hasRings) {
      noFill();
      stroke(200, 150);
      strokeWeight(2);
      ellipse(sx, sy, r * 2, r * 0.7);
    }

    // moon
    if (this.hasMoon) {
      let mx = sx + cos(this.moonAngle) * r * 1.2;
      let my = sy + sin(this.moonAngle) * r * 1.5;
      fill(180);
      noStroke();
      ellipse(mx, my, r / 4, r / 4);
    }
  }
}

// Add a styled container for the canvas and list
const container = document.createElement("div");
container.id = "art-container";
container.style.cssText = `
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f5f5dc;
  border: 10px solid #8b4513;
  padding: 20px;
  margin: 20px auto;
  width: 300px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
`;
document.body.appendChild(container);

const list = document.createElement("ul");
list.style.cssText = `
  list-style: none;
  padding: 0;
  margin-top: 20px;
  font-family: 'Times New Roman', Times, serif;
  font-size: 16px;
  color: #333;
`;

story.forEach((line) => {
  const listItem = document.createElement("li");
  listItem.textContent = line;
  listItem.style.cssText = `
    margin-bottom: 10px;
    text-align: center;
  `;
  list.appendChild(listItem);
});

container.appendChild(list);
