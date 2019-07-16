class Circle {

  constructor(){
    this.i = 0;
    this.j = 0;

    // Score is how many frames it's been alive
    this.step = 0;
    
    this.index = 0

    this.w = 100;

    this.hit = false;

    this.moveUpCount = 0;
    this.moveRightCount = 0;
    this.moveBottomCount = 0;
    this.moveLeftCount = 0;

  }


  copy(){
    return new Circle();
  }

  draw(){
    mazeP5.noStroke();

    mazeP5.fill(255,0,255);// green
    mazeP5.ellipse(0.5*w+w*this.i,0.5*w+w*this.j,w/2,w/2);
    mazeP5.noStroke();
  }


  predict(){
    var top = cells[this.index].walls[0] ? 1 : 0;
    var right = cells[this.index].walls[1] ? 1 : 0;
    var bottom = cells[this.index].walls[2] ? 1 : 0;
    var left = cells[this.index].walls[3] ? 1 : 0;

    return [top, right, bottom, left];
  }

  do(outputs){
    var max  = Math.max.apply(null, outputs);
    var index = outputs.indexOf(max);
    // console.log(index);
    if(index == 0){
      // console.log("op up");
      this.moveUp();
    }else if(index == 1){
      // console.log("op right");
      this.moveRight();
    }else if(index == 2){
      // console.log("op bottom");
      this.moveBottom();
    }else{
      // console.log("op left");
      this.moveLeft();
      
    }
  }

  updateCircle(){
      this.i = cells[this.index].i;
      this.j = cells[this.index].j;
      this.index = cells[this.index].index;
      this.step += 1;
      // this.draw();
      this.score++;
  }

  moveUp(){
    if(!cells[this.index].walls[0] && this.moveUpCount < cols){
      this.index = this.index - cols;
      this.updateCircle();
      this.moveUpCount++;
      // console.log("up");
    }else{
      this.hit = true;
      // console.log("no up");
    }
  }

  moveRight(){
    if(!cells[this.index].walls[1] && this.moveRightCount < cols){
      this.index = this.index + 1;
      this.updateCircle();
      this.moveRightCount++;
      // console.log("right");
    }else{
      this.hit = true;
      // console.log("no right");
    }
  }

  moveBottom(){
    if(!cells[this.index].walls[2] && this.moveBottomCount < cols){
      this.index = this.index + cols;
      this.updateCircle();
      this.moveBottomCount++;
      // console.log("bottom");
    }else{
      this.hit = true;
      // console.log("no bottom");
    }
  }

  moveLeft(){
    if(!cells[this.index].walls[3] && this.moveLeftCount < cols){
      this.index = this.index - 1;
      this.updateCircle();
      this.moveLeftCount++;
      // console.log("left");
    }else{
      this.hit = true;
      // console.log("no left");
    }
  }

}