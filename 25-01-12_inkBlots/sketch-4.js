//inkBlots; january, 2025. 

//i thought about the most basic ink blot — a circle on the screen that spreads. 

let inkBlots = [];

function setup() {
  createCanvas(1000, 562); //in 16:9 aspect ratio. 

  angleMode(DEGREES);
  background(255);

  inkBlots[0] = new InkBlot(width / 2, height / 2);

}

function draw() {

  for (let inkblot of inkBlots) {
    inkblot.display();
    inkblot.spread();
  }

}

class InkBlot {
  constructor(centerX, centerY) {
    this.centerX = centerX;
    this.centerY = centerY;

    this.r = 1;

    this.noisy = [];

    for (let a = 0; a <= 360; a++) {
      this.noisy.push(noise(a * 0.6) * 10);
    }

    this.grow = true;

  }

  display() {

    fill(0);
    noStroke();

    beginShape();

    for (let a = 0; a <= 360; a++) {
      var x = this.centerX + this.r * sin(a) + this.noisy[a];
      var y = this.centerY + this.r * cos(a) + this.noisy[a];

      vertex(x, y);
    }
    endShape(CLOSE);

  }

  spread() {
    if (this.grow == true) {
      this.r++;
    }
  }

  stop() {
    if (this.x < 0 || this.x > width) {
      this.grow == false;
    }
  }
}

