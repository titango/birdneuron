// Contributed by Henry
var cols, rows;
var w = 100;
var cells = [];
var current;
var stack = [];
var mazebackground = 51;
//path finding
var distance = 0, longdist = 0;
var longest;
var genFinished = false;
var runBest = false;
var runBestButton;
var solveGame = false;
var solveButton;
var finder = undefined;


document.onkeydown = function(e) {
  event.preventDefault();
  // console.log(current);
  var index = current.index;
    switch (e.keyCode) {
        case 37:
            // alert('left');
            // current.i--;
             if((index - 1) >= 0){
                index = index - 1;
             } 
            break;
        case 38:
            // alert('up');
            // current.j--;
            if((index - cols) >= 0){
              index = index - cols;
            }
            break;
        case 39:
            // alert('right');
            // current.i++;
            if((index + 1) < (cols * rows)){
                index = index + 1;
             }
            break;
        case 40:
            // alert('down');
            // current.j++;
            if((index + cols) < (cols * rows)){
              index = index + cols;
            }
            
            break;
    }
    // ellipse(0.5*w+w*current.i,0.5*w+w*current.j,w/2,w/2);
    //         fill(255,0,255);
    current = cells[index];
    // console.log(cols);
    // console.log(rows);
    // console.log(index);
    // console.log("cells");
    // console.log(cells);
};

var s = function(sketch)
{
  // Load images
  sketch.preload = function() {
    // birdmodel = sketch.loadImage('images/birdmodel.png');
    
  }

  sketch.setup = function()
  {
    sketch.angleMode(sketch.DEGREES);
    var canvas = sketch.createCanvas(1000, 400);

    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('maze-canvas');

    // Access the interface elements - FOR SLIDER
    // NOTE look at Flappy bird code

    // speedSlider = sketch.select('#speedSlider');
    // speedSpan = sketch.select('#speed');
    // highScoreSpan = sketch.select('#hs');
    // allTimeHighScoreSpan = sketch.select('#ahs');
    runBestButton = sketch.select('#best');
    runBestButton.mousePressed(sketch.toggleState);
    solveButton = sketch.select('#solve');
    solveButton.mousePressed(sketch.toggleState1);
    
    cols = Math.floor(canvas.width / w);
    rows = Math.floor(canvas.height / w);
      //frameRate(5);
      var countIndex =0
      for (var j = 0; j < rows; j++) {
        for (var i = 0; i < cols; i++) {
          var cell = new Cell(i, j, countIndex);
          cells.push(cell);
          countIndex++;
        }
      }

      current = cells[0];
      longest = current;
  };

  // Function to actually draw the game here
  sketch.draw = function()
  {
    sketch.background(mazebackground);
    
    drawMaze();
    //generate the maze
    if(runBest && !genFinished){
      generateMaze();
    }else if(genFinished && solveGame){
        if(finder){
          finder.draw();
          // console.log(finder.paths);
        }else{
          finder = new Finder();
        }
    }

  };

  sketch.toggleState = function()
  {
    runBest = !runBest;
  }

  sketch.toggleState1 = function()
  {
    solveGame = !solveGame;
  }

}


function drawMaze(){
  for (var i = 0; i < cells.length; i++) {
      cells[i].show();
    }
}

function generateMaze(){
  current.visited = true;
    current.highlight();
    // STEP 1
    var next = current.checkNeighbors();
    if (next) {
      next.visited = true;

      // STEP 2
      stack.push(current);

      // STEP 3
      removeWalls(current, next);

      // STEP 4
      current = next;

      distance++;

    } else {
      if (stack.length > 0) {
        current = stack.pop();
      }else{
        current = cells[0];
        genFinished = true;
      }
      distance--;
    }

    if(longdist<distance){
        longdist = distance;
        longest = current;
    }
}

function index(i, j) {

  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;

}


function removeWalls(a, b) {
  var x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  var y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

var mazeP5 = new p5(s);