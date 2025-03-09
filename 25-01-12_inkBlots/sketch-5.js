//inkBlots; january, 2025. 

//i wasn't making a lot of progress so i asked chatgpt for a sketch. it made a shit sketch but gave me ideas for the InkBlot object. 

let inkBlots = [];

function setup() {
  createCanvas(600, 600);
  background(240); // Light gray to simulate paper
  noStroke();

  // Create an initial ink blot
  inkBlots.push(new InkBlot(width / 2, height / 2));
}

function draw() {
  for (let blot of inkBlots) {
    blot.spread();
    blot.display();
  }

  // Occasionally add a new ink drop
  if (random() < 0.01) {
    inkBlots.push(new InkBlot(random(width), random(height)));
  }
}

class InkBlot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.points = [];
    this.maxSize = random(30, 100); // Maximum size of the blot
    this.size = 0; // Current size
    this.growthRate = random(0.5, 1.5); // How quickly the blot spreads

    for (let i = 0; i < 360; i += 5) {
      let angle = radians(i);
      this.points.push({
        angle: angle,
        offset: random(5, 10), // Offset to create an uneven edge
      });
    }
  }

  spread() {
    if (this.size < this.maxSize) {
      this.size += this.growthRate; // Increase the size over time

      for (let p of this.points) {
        p.offset += noise(frameCount * 0.01, p.angle) * 0.5; // Add organic movement
      }
    }
  }

  display() {
    fill(0, 50); // Black with slight transparency
    beginShape();
    for (let p of this.points) {
      let x = this.x + cos(p.angle) * (this.size + p.offset);
      let y = this.y + sin(p.angle) * (this.size + p.offset);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
}
