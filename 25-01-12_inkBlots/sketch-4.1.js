//inkBlots; january, 2025. 

//i thought about the most basic ink blot — a circle on the screen that spreads. 

let inkBlots = [];

var textToPoints = [];

let font;

function preload() {
  font = loadFont('fonts/Esteban-Regular.ttf');
}


function setup() {
  createCanvas(1000, 562); // 16:9 aspect ratio.
  angleMode(DEGREES);

  background(255);

  rectMode(CENTER);
  fill(0, 100);
  textToPoints = convertLetterToPoints("i tried to speak \n but you wouldn't listen", width / 2, height / 2, width, height, 5, 90, font, CENTER, CENTER);
}

function draw() {

  //every 5 seconds, add a new ink blot
  if (frameCount % 60 == 0) {
    const n = int(random(0, textToPoints.length));

    const initX = textToPoints[n].x;
    const initY = textToPoints[n].y;

    inkBlots.push(new InkBlot(initX, initY));
  }

  for (let inkblot of inkBlots) {
    inkblot.display();
    inkblot.spread();
    inkblot.stop();
  }

}

class InkBlot {
  constructor(centerX, centerY) {
    this.centerX = centerX;
    this.centerY = centerY;

    this.r = 1;

    this.numVertices = 72; //reduced number of vertices for efficiency. 
    this.noisy = [];
    this.angles = [];

    //compute noise and angles only once, instead of computing it all the time. 
    for (let i = 0; i < this.numVertices; i++) {
      let angle = map(i, 0, this.numVertices, 0, 360);
      this.angles.push({ sin: sin(angle), cos: cos(angle) });
      this.noisy.push(noise(i * random(0.1, 0.6)) * random(5, 20));
    }

    this.grow = true;

    this.maxRadius = int(random(this.r, width / 2));
  }

  display() {
    fill(0, 50);
    noStroke();

    beginShape();
    for (let i = 0; i < this.numVertices; i++) {
      let x = this.centerX + (this.r + this.noisy[i]) * this.angles[i].sin;
      let y = this.centerY + (this.r + this.noisy[i]) * this.angles[i].cos;
      vertex(x, y);
    }
    endShape(CLOSE);
  }

  spread() {
    if (this.grow) {
      this.r += 0.2; // reduce this number for smoother / slower growth. 
    }
  }

  stop() {
    if (this.r > this.maxRadius) {
      this.grow = false;
    }
  }
}
