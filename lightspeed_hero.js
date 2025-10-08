// Lightspeed p5 sketch for hero section - using instance mode to avoid conflicts
const lightspeedSketch = (p) => {
  let stars = [];
  let planets = [];
  let story = [];
  let startTime;
  let speed;

  p.setup = () => {
    // Always attach to #p5-canvas and match its size
    const hero = document.getElementById("p5-canvas");
    let w = hero ? hero.offsetWidth : window.innerWidth;
    let h = hero ? hero.offsetHeight : window.innerHeight * 0.7;
    
    const canvas = p.createCanvas(w, h);
    if (hero) {
      canvas.parent(hero);
    } else {
      canvas.parent(document.body);
    }

    // Responsive resize
    window.addEventListener('resize', () => {
      const heroDiv = document.getElementById('p5-canvas');
      let w = heroDiv ? heroDiv.offsetWidth : window.innerWidth;
      let h = heroDiv ? heroDiv.offsetHeight : window.innerHeight * 0.7;
      p.resizeCanvas(w, h);
    });

    // create stars
    for (let i = 0; i < 1000; i++) {
      stars[i] = new Star(p);
    }

    // create planets
    for (let i = 0; i < 323; i++) {
      planets[i] = new Planet(p);
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

    startTime = p.millis();
  };

  p.draw = () => {
    p.background(5, 15, 20); // deep space blue/black
    speed = p.map(p.mouseX, 0, p.width, 122, 220); // warp speed with mouse

    // camera drift effect
    p.translate(
      p.width / 2 + p.sin(p.frameCount * 0.002) * 50,
      p.height / 2 + p.cos(p.frameCount * 0.0015) * 30
    );

    // nebula clouds (simple noise-based)
    drawNebula(p);

    // planets
    for (let planet of planets) {
      planet.update();
      planet.show();
    }

    // stars
    for (let star of stars) {
      star.update();
      star.show();
    }

    // overlay narrative
    showStory(p);
  };

  // =============== NEBULA BACKGROUND ===============
  function drawNebula(p) {
    p.noStroke();
    for (let i = 0; i < 1250; i++) {
      let x = p.random(-p.width, p.width);
      let y = p.random(-p.height, p.height);
      let alpha = p.noise(x * 0.00255, y * 0.00159, p.frameCount * 0.0032) * 128;
      p.fill(p.random(102, 203), p.random(50, 150), p.random(152, 255), alpha);
      p.ellipse(x, y, 80, 80);
    }
  }

  // =============== STORY OVERLAY ===============
  function showStory(p) {
    let t = p.int((p.millis() - startTime) / 5000) % story.length; // every 5s
    p.fill(255, 220);
    p.textAlign(p.CENTER);
    p.textSize(20);
    p.text(story[t], 0, -p.height / 2 + 40); // top center
  }

  // =============== STAR CLASS ===============
  class Star {
    constructor(p) {
      this.p = p;
      this.reset();
    }

    reset() {
      this.x = this.p.random(-this.p.width, this.p.width);
      this.y = this.p.random(-this.p.height, this.p.height);
      this.z = this.p.random(this.p.width);
      this.pz = this.z;

      // star color (spectral classes)
      let r = this.p.random();
      if (r < 0.3) this.col = this.p.color(255, 255, 200); // yellow-white
      else if (r < 0.6) this.col = this.p.color(180, 200, 255); // blue-white
      else if (r < 0.8) this.col = this.p.color(255, 180, 180); // reddish
      else this.col = this.p.color(255); // pure white
    }

    update() {
      this.z -= speed;
      if (this.z < 1) {
        this.reset();
        this.z = this.p.width;
        this.pz = this.z;
      }
    }

    show() {
      this.p.fill(this.col);
      this.p.noStroke();
      let sx = this.p.map(this.x / this.z, 0, 1, 0, this.p.width);
      let sy = this.p.map(this.y / this.z, 0, 1, 0, this.p.height);
      let r = this.p.map(this.z, 0, this.p.width, 6, 0);
      this.p.ellipse(sx, sy, r, r);

      let px = this.p.map(this.x / this.pz, 0, 1, 0, this.p.width);
      let py = this.p.map(this.y / this.pz, 0, 1, 0, this.p.height);
      this.pz = this.z;

      this.p.stroke(this.col);
      this.p.line(px, py, sx, sy);
    }
  }

  // =============== PLANET CLASS ===============
  class Planet {
    constructor(p) {
      this.p = p;
      this.reset();
    }

    reset() {
      this.x = this.p.random(-this.p.width, this.p.width);
      this.y = this.p.random(-this.p.height, this.p.height);
      this.z = this.p.random(this.p.width / 3, this.p.width);
      this.size = this.p.random(60, 200);
      this.col = this.p.color(this.p.random(50, 255), this.p.random(50, 255), this.p.random(50, 255));
      this.hasRings = this.p.random() < 0.3;
      this.hasMoon = this.p.random() < 0.5;
      this.moonAngle = this.p.random(this.p.TWO_PI);
    }

    update() {
      this.z -= speed * 0.4; // slower than stars
      if (this.z < 1) {
        this.reset();
        this.z = this.p.width;
      }
      this.moonAngle += 0.01; // moon orbit
    }

    show() {
      let sx = this.p.map(this.x / this.z, 0, 1, 0, this.p.width);
      let sy = this.p.map(this.y / this.z, 0, 1, 0, this.p.height);
      let r = this.p.map(this.z, 0, this.p.width, this.size, 10);

      // textured surface with noise
      this.p.noStroke();
      for (let i = 0; i < 20; i++) {
        let angle = this.p.random(this.p.TWO_PI);
        let rad = this.p.random(r / 2, r);
        let nx = sx + this.p.cos(angle) * rad;
        let ny = sy + this.p.sin(angle) * rad;
        let ncol = this.p.lerpColor(this.col, this.p.color(20), this.p.noise(nx * 0.01, ny * 0.01));
        this.p.fill(ncol);
        this.p.ellipse(nx, ny, this.p.random(5, 10));
      }

      // main planet body
      this.p.fill(this.col);
      this.p.ellipse(sx, sy, r, r);

      // rings
      if (this.hasRings) {
        this.p.noFill();
        this.p.stroke(200, 150);
        this.p.strokeWeight(2);
        this.p.ellipse(sx, sy, r * 2, r * 0.7);
      }

      // moon
      if (this.hasMoon) {
        let mx = sx + this.p.cos(this.moonAngle) * r * 1.2;
        let my = sy + this.p.sin(this.moonAngle) * r * 1.5;
        this.p.fill(180);
        this.p.noStroke();
        this.p.ellipse(mx, my, r / 4, r / 4);
      }
    }
  }
};

// Initialize the lightspeed sketch when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  new p5(lightspeedSketch);
});