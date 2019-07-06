// Contributed by Henry
class Cell {
  
  constructor(i, j){
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true];
    this.visited = false;
    this.w = 20;
  }

  // index(i, j) {
  //   console.log("im here too");
  //   if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
  //     return -1;
  //   }
  //   return i + j * cols;
  // }


  checkNeighbors(){
    var neighbors = [];
    var top = grid[index(this.i, this.j - 1)];
    var right = grid[index(this.i + 1, this.j)];
    var bottom = grid[index(this.i, this.j + 1)];
    var left = grid[index(this.i - 1, this.j)];

    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }
    if (neighbors.length > 0) {
      var r = Math.floor(Math.random() * neighbors.length);
      return neighbors[r];
    } else {
      return undefined;
    }
  }

  highlight() {
    var x = this.i * this.w;
    var y = this.j * this.w;
    var w = this.w;
    mazeP5.noStroke();
    mazeP5.fill(0, 0, 255, 100);  
    mazeP5.rect(x, y, w, w);

  }

  show() {
    var x = this.i * this.w;
    var y = this.j * this.w;
    var w = this.w;
    mazeP5.stroke(255);
    if (this.walls[0]) {
      mazeP5.line(x, y, x + w, y);
    }
    if (this.walls[1]) {
      mazeP5.line(x + w, y, x + w, y + w);
    }
    if (this.walls[2]) {
      mazeP5.line(x + w, y + w, x, y + w);
    }
    if (this.walls[3]) {
      mazeP5.line(x, y + w, x, y);
    }

    if (this.visited) {
      mazeP5.noStroke();
      mazeP5.fill(255, 0, 255, 100);
      mazeP5.rect(x, y, w, w);
    }
  }

}