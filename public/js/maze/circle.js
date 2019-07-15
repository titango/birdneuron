class Circle {

  constructor(){
    this.i = 0;
    this.j = 0;

    // Score is how many frames it's been alive
    this.step = 0;

    // Fitness is normalized version of score
    this.fitness = 0;
    
    this.index = 0

    this.w = 100;
  }


  draw(){
    mazeP5.noStroke();

    mazeP5.fill(255,0,255);// green
    mazeP5.ellipse(0.5*w+w*this.i,0.5*w+w*this.j,w/2,w/2);
    mazeP5.noStroke();
  }

    updateCircle(){
        this.i = cells[this.index].i;
        this.j = cells[this.index].j;
        this.index = cells[this.index].index;
        this.step += 1;
    }

    moveUp(){
    
      if(!cells[this.index].walls[0]){
        this.index = this.index - cols;
        this.updateCircle();
      }
    }

  moveRight(){
    if(!cells[this.index].walls[1]){
      this.index = this.index + 1;
      this.updateCircle();
    }
  }

  moveBottom(){
    if(!cells[this.index].walls[2]){
      this.index = this.index + cols;
      this.updateCircle();
    }
  }

  moveLeft(){
    if(!cells[this.index].walls[3]){
      this.index = this.index - 1;
      this.updateCircle();
    }
  }

}