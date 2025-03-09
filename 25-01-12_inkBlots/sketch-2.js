//inkBlots; january, 2025. 

//using my walker ink blot, for text. 

let walkers = [];

var textToPoints = [];

let font;

function preload() {
  font = loadFont('fonts/Esteban-Regular.ttf');
}

function setup() {
  createCanvas(1000, 562); //in 16:9 aspect ratio. 

  rectMode(CENTER);

  background(255);

  fill(0, 100);
  textToPoints = convertLetterToPoints("i tried to speak \n but you wouldn't listen", width / 2, height / 2, width, height, 5, 90, font, CENTER, CENTER);

  //text forms the base layer. 

  //background (255); 

  //background(255);
  angleMode(DEGREES);

  //blendMode(BURN); 

  const initX = width / 2;
  const initY = height / 2;

  for (let a = 0; a <= 360; a++) {
    const r = 1;

    var x = initX + sin(a) * r;
    var y = initY + cos(a) * r;

    //walkers.push(new Walker (x,y)); 
  }
}

function draw() {

  //every 5 seconds, add a new walker
  if (frameCount % 60 == 0) {
    const n = int(random(0, textToPoints.length));

    const initX = textToPoints[n].x;
    const initY = textToPoints[n].y;

    for (let a = 0; a <= 360; a++) {
      const r = 1;

      var x = initX + sin(a) * r;
      var y = initY + cos(a) * r;

      walkers.push(new Walker(x, y));
    }
  }

  for (let i = 0; i < walkers.length; i++) {
    walkers[i].display();
    walkers[i].move();
  }

}


class Walker {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    //if you change the dist to move, it changes the 'feel' of it. 
    this.distToMove = 2;
  }

  display() {
    strokeWeight(1);
    stroke(0, 150);
    noFill();
    point(this.x, this.y);
  }

  move() {
    this.prob = random([1, 3, 5, 7]);

    //probability - clockwise
    if (this.prob == 0) {
      //diagonally left-top
      this.x -= this.distToMove;
      this.y -= this.distToMove;

    } else if (this.prob == 1) {
      //top
      this.y -= this.distToMove;

    } else if (this.prob == 2) {
      //diagonally right-top
      this.x += this.distToMove;;
      this.y -= this.distToMove;
    } else if (this.prob == 3) {
      //right
      this.x += this.distToMove;;
    } else if (this.prob == 4) {
      //diagonally right-bottom   
      this.x += this.distToMove;;
      this.y += this.distToMove;;
    } else if (this.prob == 5) {
      //down
      this.y += this.distToMove;;
    } else if (this.prob == 6) {
      //diagonally left-bottom
      this.x -= this.distToMove;
      this.y += this.distToMove;;
    } else if (this.prob == 7) {
      //left
      this.x -= this.distToMove;
    }
  }
}