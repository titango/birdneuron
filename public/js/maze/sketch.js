// Contributed by Henry
var cols, rows;
var w = 20;
var grid = [];
var current;
var stack = [];
var mazebackground = 51;


var s = function(sketch)
{
  // Load images
  sketch.preload = function() {
    // birdmodel = sketch.loadImage('images/birdmodel.png');
    
  }

  sketch.setup = function()
  {
    sketch.angleMode(sketch.DEGREES);
    var canvas = sketch.createCanvas(600, 400);

    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('maze-canvas');

    // Access the interface elements - FOR SLIDER
    // NOTE look at Flappy bird code

    // speedSlider = sketch.select('#speedSlider');
    // speedSpan = sketch.select('#speed');
    // highScoreSpan = sketch.select('#hs');
    // allTimeHighScoreSpan = sketch.select('#ahs');
    // runBestButton = sketch.select('#best');
    // runBestButton.mousePressed(sketch.toggleState);
    
    cols = Math.floor(canvas.width / w);
    rows = Math.floor(canvas.height / w);
      //frameRate(5);

      for (var j = 0; j < rows; j++) {
        for (var i = 0; i < cols; i++) {
          var cell = new Cell(i, j);
          grid.push(cell);
        }
      }

      current = grid[0];

  };

  // Function to actually draw the game here
  sketch.draw = function()
  {
    sketch.background(mazebackground);
    
    drawMaze();
    //generate the maze
    generateMaze();


  };
}

function drawMaze(){
  for (var i = 0; i < grid.length; i++) {
      grid[i].show();
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
    } else if (stack.length > 0) {
      current = stack.pop();
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