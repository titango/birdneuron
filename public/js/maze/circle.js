class Circle {

  constructor(){
    this.i = 0;
    this.j = 0;

    this.step = 0;
    
    this.index = 0;

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

    this.visitedIndexCount = [];

    this.highestIndexCount = 0;
  }


  copy(){
    return new Circle();
  }

  draw(){
    mazeP5.noStroke();
    mazeP5.fill(255,0,255);// green
    mazeP5.ellipse(0.5*w+w*this.i,0.5*w+w*this.j,w/2,w/2);
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

    if(this.isStuck() ){
      // console.log(cells[this.index]);
      var top = cells[this.index].walls[0] ? 1 : 0;
      var right = cells[this.index].walls[1] ? 1 : 0;
      var bottom = cells[this.index].walls[2] ? 1 : 0;
      var left = cells[this.index].walls[3] ? 1 : 0;
      var ableToMove = true;
      if(top == 0 && ableToMove){
          var checkVisited = this.visitedIndex.indexOf(this.index - cols);
          if(checkVisited == -1){
            this.moveUp();
            ableToMove = false;
          }
      } 

      if(right == 0 && ableToMove){
        var checkVisited = this.visitedIndex.indexOf(this.index + 1);
          if(checkVisited == -1){
            this.moveRight();
            ableToMove = false;
          }

      }

       if(bottom == 0 && ableToMove){
        var checkVisited = this.visitedIndex.indexOf(this.index + cols);
          if(checkVisited == -1){
          this.moveBottom();
          ableToMove = false;
          }

      }
      if(left == 0 && ableToMove){
        var checkVisited = this.visitedIndex.indexOf(this.index - 1);
          if(checkVisited == -1){
          this.moveLeft();
          ableToMove = false;
        }
      }

      if(ableToMove){ 
        this.hit = true;
      }

    }else if(this.aStartCheck()){

      var checkIndex = pathIndex.indexOf(this.index);
      var nextIndex = pathIndex[checkIndex - 1];

      if(this.index == 0){
        var nextIndex = pathIndex[pathIndex.length - 1];
      }

      if(nextIndex == this.index - cols){
          this.moveUp();
      }else if(nextIndex == this.index + 1){
          this.moveRight();
      }else if (nextIndex == this.index + cols){
          this.moveBottom();
      }else if (nextIndex == this.index - 1){
          this.moveLeft();
      }else{
        this.hit = true;
      }

    }else {

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

  }

  updateCircle(){

      this.i = cells[this.index].i;
      this.j = cells[this.index].j;
      this.index = cells[this.index].index;
      
      var check = this.visitedIndex.indexOf(this.index);
      
      if(check == -1){
        this.visitedIndex.push(this.index);

        var rightIndex = pathIndex.indexOf(this.index);
        
        

        if(rightIndex != -1){
          this.score += 1;
          this.step += 1;
        }


        this.visitedIndexCount.push(1);

        this.highestIndexCount = 0;

      }else{
        this.visitedIndexCount[check] = this.visitedIndexCount[check] + 1;
      }
      

      this.previousIndex = this.index;
      if(this.index == longest.index && !gameEnd){
        alert("You win!!!!!");
        gameEnd = true;
      }
  }

  moveUp(){
    var check = this.visitedIndex.indexOf(this.index - cols);
    if(check != -1){
      this.hit = true;

    }else if(!cells[this.index].walls[0] && this.step < 100){
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
    var check = this.visitedIndex.indexOf(this.index + 1);
    
    if(check != -1){
      this.hit = true;
    }else
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
    var check = this.visitedIndex.indexOf(this.index + cols);
    
    if(check != -1 ){
      this.hit = true;

    }else if(!cells[this.index].walls[2] && this.step < 100){
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
    var check = this.visitedIndex.indexOf(this.index - 1);
    if(check != -1){
      this.hit = true;

    }else if(!cells[this.index].walls[3] && this.step < 100){
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

  isStuck(){
    if(this.generation > 10 && (this.score == highestScore || this.score == highestScore - 1)){
      return true;
    }

    return false;
  }

  aStartCheck(){

    var rand = Math.floor(Math.random() * 100) + 11;
    var check = Math.round(Math.random());
    if(this.generation > rand && check == 0){
      return true;
    }

    return false;
  }

}