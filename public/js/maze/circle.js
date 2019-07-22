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

    this.previousMove = -1;
    this.currentMove = -1;

    this.previousIndex = 0;

    this.visitedIndex = [];
    this.generation = 0;
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
    var distance = pathIndex.length - this.visitedIndex.length;

    return [top, right, bottom, left, distance];
  }

  do(outputs){
    var max  = Math.max.apply(null, outputs);
    var index = outputs.indexOf(max);
    // var index = Math.floor(Math.random()*4);
    // console.log(index);
    // if(this.generation != 0 && this.generation % 5 == 0 ){
      // var checkIndex = pathIndex.indexOf(this.index);
      // var nextIndex = pathIndex[checkIndex - 1];

      // if(this.index == 0){
      //   var nextIndex = pathIndex[pathIndex.length - 1];
      // }

      // if(nextIndex == this.index - cols){
      //     this.moveUp();
      // }else if(nextIndex == this.index + 1){
      //     this.moveRight();
      // }else if (nextIndex == this.index + cols){
      //     this.moveBottom();
      // }else if (nextIndex == this.index - 1){
      //     this.moveLeft();
      // }


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
      
      var check = this.visitedIndex.indexOf(this.index);
      this.step += 1;
      if(check == -1){
        this.visitedIndex.push(this.index);
        // this.step += 1;
        // this.score++;

        var rightIndex = pathIndex.indexOf(this.index);
        if(rightIndex != -1){
          this.score++;
        }

      }
      
      
      this.draw();

      this.previousIndex = this.index;
  }

  moveUp(){
    if(!cells[this.index].walls[0] && this.step < 100){
      this.index = this.index - cols;
      this.updateCircle();
      this.moveUpCount++;
      this.currentMove = 0;
      // console.log("up");
    }else{
      this.hit = true;
      // console.log("no up");
    }
  }

  moveRight(){
    if(!cells[this.index].walls[1] && this.step < 100){
      this.index = this.index + 1;
      this.updateCircle();
      this.moveRightCount++;
      // console.log("right");
      this.currentMove = 1;

    }else{
      this.hit = true;
      // console.log("no right");
    }
  }

  moveBottom(){
    if(!cells[this.index].walls[2] && this.step < 100){
      this.index = this.index + cols;
      this.updateCircle();
      this.moveBottomCount++;
      // console.log("bottom");
      this.currentMove = 2;
    }else{
      this.hit = true;
      // console.log("no bottom");
    }
  }

  moveLeft(){
    if(!cells[this.index].walls[3] && this.step < 100){
      this.index = this.index - 1;
      this.updateCircle();
      this.moveLeftCount++;
      // console.log("left");
      this.currentMove = 3;
    }else{
      this.hit = true;
      // console.log("no left");
    }
  }

}