//inkBlots; january, 2025. 

//in this exploration, i wanted to look at a paintbrush being pressed on a surface, and then the mark spreading because of the nature of the paper. this is inspired by watercolour paper and how ink actually 'blots'. 

let brushMarks = [];

function setup() {
  createCanvas(1000, 562); //in 16:9 aspect ratio. 
  background(255);
  angleMode(DEGREES);

  //dummy object: 
  brushMarks[0] = new BrushMark(width / 2, height / 2);
}

function draw() {

  brushMarks[0].display();

}

class BrushMark {
  constructor(centerX, centerY) {
    this.centerX = centerX;
    this.centerY = centerY;

    this.r = 40;

    const displacementRange = 10;
  }

  display() {

    push();

    beginShape();
    translate(this.centerX, this.centerY);

    for (let a = 0; a <= 360; a++) {
      var x = this.r * sin(a);
      var y = this.r * cos(a) + this.displacement;

      stroke(0);
      fill(0);
      strokeWeight(2);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();


  }

  spread() {

  }
}

/*
//x = r*cos(a)
//y = r*sin(a)

push(); 

translate (this.centerX, this.centerY); 

for (let a = 0; a<=360; a+=this.gap){
var x = this.r*cos(a); 
var y = this.r*sin(a); 

stroke(255); 
strokeWeight (2); 
point(x, y); 
}
pop(); 
*/