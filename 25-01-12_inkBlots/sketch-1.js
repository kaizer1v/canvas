/**
 * inkBlots; january, 2025. 
 * vivek and shobhan challenged me to create the feeling of an ink blot spreading out.
 * when i first looked at an ink blot, it felt like a bunch of random walkers (on the edges) spreading out in circular fashion. hence, this exploration that uses a circular group of individual walkers. 
 * i think it would be interesting to make walkers 'flock'; so every 'x' angle, walkers follow similar behaviour of a 'master' walker. 
*/

let walkers = [];

function setup() {
  createCanvas(1000, 562); //in 16:9 aspect ratio. 
  background(255);
  angleMode(DEGREES);

  const initX = width / 2;
  const initY = height / 2;

  for (let a = 0; a <= 360; a++) {
    const r = 5;

    var x = initX + sin(a) * r;
    var y = initY + cos(a) * r;

    walkers.push(new Walker(x, y));
  }
}

function draw() {
  for (let i = 0; i < walkers.length; i++) {
    walkers[i].display();
    walkers[i].move();
  }

  console.log(walkers.length);

}


class Walker {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    //if you change the dist to move, it changes the 'feel' of it. 
    this.distToMove = 5;
  }

  display() {
    strokeWeight(1);
    stroke(0, 100);
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