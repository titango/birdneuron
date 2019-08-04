class Circle {

  constructor(wallIndex){
    this.i = 0;
    this.j = 0;

    // Score is how many frames it's been alive
    this.step = 0;
    
    this.index = 0;

    this.w = 100;

    this.hit = false;

    this.previousMove = -1;
    this.currentMove = -1;

    this.previousIndex = 0;
    this.generation = 0;
    this.indexMove = [];

    //Color
    this.r = Math.floor(Math.random() * Math.floor(255));
    this.b = Math.floor(Math.random() * Math.floor(255));
    this.g = Math.floor(Math.random() * Math.floor(255));

    if(wallIndex)
    {
      this.wallIndexes = wallIndex;  
    }else
    {
      this.wallIndexes = [];
    }
    

    // if(visited)
    // {
    //   this.visitedIndex = visited;
    // }else
    // {
      this.visitedIndex = [];
    // }

    // this.highestIndexCount = 0;
  }


  copy(){
    return new Circle(this.wallIndexes);
  }

  draw(){
    mazeP5.noStroke();
    mazeP5.fill(this.r,this.b,this.g);// green
    mazeP5.ellipse(0.5*w+w*this.i,0.5*w+w*this.j,w/2,w/2);
  }

  predict(){
    var top = cells[this.index].walls[0] ? 1 : 0;
    var right = cells[this.index].walls[1] ? 1 : 0;
    var bottom = cells[this.index].walls[2] ? 1 : 0;
    var left = cells[this.index].walls[3] ? 1 : 0;
    var visited = this.visitedIndex.length;
    var steps = this.step;

    var predict = [top, right, bottom, left, visited];
    // console.log("predict: ", predict);

    return predict;
  }

  do(outputs){
    // console.log("outputs: ", outputs);

    var max  = Math.max.apply(null, outputs);
    var index = outputs.indexOf(max);

    // // console.log("index output: ", index);
    // // console.log("");  

    // // console.log("this.indexMove: ", this.indexMove);

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

      console.log("this.wallIndexes: ", this.wallIndexes);

      this.i = cells[this.index].i;
      this.j = cells[this.index].j;
      this.index = cells[this.index].index;
      
      var check = this.visitedIndex.indexOf(this.index);
      
      this.step++;

      if(check == -1){
        // console.log("check: ", check);
        this.visitedIndex.push(this.index);
        this.score += 100;
        // if(this.score > highestScore){
        //   highestScore = this.score;
        // }
      }
      // this.score = (this.score + (this.visitedIndex.length * 10)) + (this.step * 10);
      // console.log("score: ", this.score);
      this.previousIndex = this.index;
      if(this.index == longest.index && !gameEnd){
        alert("You win!!!!!");
        gameEnd = true;
      }
  }

  moveUp(){

    if(cells[this.index].walls[0])
    {
      if(this.avoidWallIndex(this.index, 0))
      {
        this.moveDifferentWallDirection(0);  
      }else
      {
        this.hit = true;
        this.addNewWallIndex(this.index, 0);
      }
    }else
    {
      this.index = this.index - cols;
      this.checkRepeatedSteps();
      this.storeIndexMove(this.index, 0);
      this.updateCircle();
    }
  }

  moveRight(){

    if(cells[this.index].walls[1])
    {
      if(this.avoidWallIndex(this.index, 1))
      {
        this.moveDifferentWallDirection(1);  
      }else
      {
        this.hit = true;
        this.addNewWallIndex(this.index, 1);
      }
      
    }else
    {
      this.index = this.index + 1;
      this.checkRepeatedSteps();
      this.storeIndexMove(this.index, 1);
      this.updateCircle();
    }
  }

  moveBottom(){

    if(cells[this.index].walls[2])
    {
      if(this.avoidWallIndex(this.index,2))
      {
        this.moveDifferentWallDirection(2);  
      }else
      {
        this.hit = true; 
        this.addNewWallIndex(this.index, 2);
      }
    }else
    {
      this.index = this.index + cols;
      this.checkRepeatedSteps();
      this.storeIndexMove(this.index, 2);
      this.updateCircle();
    }
  }

  moveLeft(){
    if(cells[this.index].walls[3])
    {
      if(this.avoidWallIndex(this.index,3))
      {
        this.moveDifferentWallDirection(3);  
      }else
      {
        this.hit = true;
        this.addNewWallIndex(this.index, 3);
      }
    }else
    {
      this.index = this.index - 1;
      this.checkRepeatedSteps();
      this.storeIndexMove(this.index, 3);
      this.updateCircle(); 
    }
  }

  moveRandomOtherDirections(wallIndex)
  {
    // var weird = Math.random(1);
    // console.log("wallIndex: ", wallIndex);
    var newWallIndex;
    do
    {
      newWallIndex = Math.floor(Math.random() * Math.floor(4)); // random 0 to 3
    }while(newWallIndex == wallIndex);
    
    // console.log("newWallIndex: ", newWallIndex);
    // console.log("");

    if(newWallIndex == 0){
      this.moveUp();
    }else if(newWallIndex == 1){
      this.moveRight();
    }else if(newWallIndex == 2){
      this.moveBottom();
    }else{
      this.moveLeft(); 
    }
  }

  moveDifferentWallDirection(cellIndex)
  {
    var tempIndex = [];
    for(var i = 0; i < this.wallIndexes.length; i++)
    {
      if(this.wallIndexes[i].index == cellIndex)
      {
        tempIndex.push(this.wallIndexes[i].direction);
      }
    }

    var newIndex;
    do
    {
      newIndex = Math.floor(Math.random() * Math.floor(4)); // random 0 to 3
    }while(tempIndex.indexOf(newIndex) != -1);

    if(newIndex == 0){
      this.moveUp();
    }else if(newIndex == 1){
      this.moveRight();
    }else if(newIndex == 2){
      this.moveBottom();
    }else{
      this.moveLeft(); 
    }

  }

  storeIndexMove(ind, direction)
  {
    var foundIndexMove = this.indexMove.find(function(d){
      return d.index == ind;
    });

    if(typeof foundIndexMove == 'undefined') // not find -> new
    {
      var newIndexItem = {
        index: ind,
        direction, direction,
        count: 1
      };
      this.indexMove.push(newIndexItem);

    }else // Found
    {
      foundIndexMove.count += 1;
    }
  }

  checkRepeatedSteps()
  {
    var that = this;
    var foundRepeated = this.indexMove.find(function(d){
      return d.count > 6;
    });  

    if(typeof foundRepeated != 'undefined') // found
    {
      // console.log("move random repeated");
      // this.indexMove.splice(this.indexMove.indexOf(foundRepeated),1);
      // this.moveRandomOtherDirections(foundRepeated.direction);
      this.hit = true;
    }
  }

  addNewWallIndex(index, direction)
  {
    var newWall = {
      index: index,
      direction: direction
    }
    this.wallIndexes.push(newWall);
  }

  avoidWallIndex(index, direction)
  {
    var foundWall = this.wallIndexes.find(function(d){
      return d.index == index && d.direction == direction;
    });

    if(typeof foundWall != 'undefined')
    {
      return true;
    }else
    {
      return false;
    }
  }

}