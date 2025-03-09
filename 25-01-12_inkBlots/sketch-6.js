//inkBlots; january, 2025. 

//i thought about the most basic ink blot — a blob on the screen that spreads. 

let inkParticles = [];
let radius = 1;
let spreadSpeed = 0.5;

var textToPoints = [];

let font;

function preload() {
  font = loadFont('fonts/Esteban-Regular.ttf');
}

function setup() {
  // createCanvas(800, 800, webGL); // reset coordinates to (- x/2, - y/2)
  createCanvas(800, 800);
  background(255);
  rectMode(CENTER);

  fill(0);
  //textToPoints = convertLetterToPoints("i tried to speak \n but you wouldn't listen", width/2, height/2, width, height, 5, 90, font, CENTER, CENTER);
  angleMode(DEGREES);

}

function draw() {

  for (let i = 0; i < inkParticles.length; i++) {

    beginShape();

    inkParticles[i].display();
    inkParticles[i].move();

    endShape();

  }


  /*
  
  for (let p of inkParticles) {
  beginShape(); 
  p.display();
  p.expand();
  endShape();
  
  if (p.radius < p.maxRadius) {
  p.move();
  }else{
  inkBlots.splice(p,1);
  }
  
  }
  
  */

}

function mousePressed() {
  if (mousePressed) {
    for (let i = 0; i < 360; i++) {
      let angle = degrees(i);
      let x = mouseX + sin(angle) * radius;
      let y = mouseY + cos(angle) * radius;
      inkParticles.push(new InkParticle(x, y, angle, radius));
    }
  }
}

class InkParticle {
  constructor(x, y, angle, radius) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.radius = radius;

    this.maxRadius = int(random(180, 360));


  }

  display() {
    noStroke();
    stroke(0, 5);
    strokeWeight(10);

    point(this.x, this.y);
  }

  move() {
    const scaleMax = 1; //scale noise from 0,1 to 0,max. 
    const noiseRangeShift = scaleMax / 2; //shift the range from 0,max to -max/2 to max/2. 

    let noiseX = noise(this.x * 0.01, this.y * 0.01) * scaleMax - noiseRangeShift;
    let noiseY = noise(this.y * 0.01, this.x * 0.01) * scaleMax - noiseRangeShift;

    this.x += sin(this.angle) * spreadSpeed + noiseX;
    this.y += cos(this.angle) * spreadSpeed + noiseY;
  }

  expand() {
    this.radius += spreadSpeed;
  }

}
