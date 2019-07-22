// Contributed by Henry

//Using bird neuron
let bn = new BirdNeuron();

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
var solveMazeFinished = false;
var runBestButton;
var solveGame = false;
var solveButton;
var finder = undefined;
var circle1 = new Circle();
var generation = 0;
var pathIndex = [];


document.onkeydown = function(e) {
  event.preventDefault();
    switch (e.keyCode) {
        case 37:
             circle1.moveLeft();
            break;
        case 38:
              circle1.moveUp();
            break;
        case 39:
              circle1.moveRight();
            break;
        case 40:
              circle1.moveBottom();
            break;
    }
    // circle1.draw();
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
    // solveButton = sketch.select('#solve');
    // solveButton.mousePressed(sketch.toggleState1);
    
    // Create a population
    bn.totalPopulation = 500;
    bn.inputlayer = 5;
    bn.hiddenlayer = 8;
    bn.outputlayer = 4;

    //Create circles
    var tempCircles = [];
    for (let i = 0; i < bn.totalPopulation; i++) {
      let circle = new Circle();
      // console.log("bird: ", bird);
      tempCircles.push(circle);
    }

    // console.log(bn);
    bn.input(tempCircles);


    //set up maze
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

    //
  };

  // Function to actually draw the game here
  sketch.draw = function()
  {
    sketch.background(mazebackground);
    drawMaze();
    //generate the maze
    if(runBest && !genFinished){
      generateMaze();
      // console.log(circle1);

      // if(finder){
      //     finder.draw();
      //     // console.log(finder.paths);
      //   }else{
      //     finder = new Finder();
      //   }

    }else if(genFinished && !solveMazeFinished){

        if(finder){
          finder.draw();
          // console.log(finder.paths[0].pathIndex);
          pathIndex = (finder.paths[0].pathIndex);
          // console.log(pathIndex);
        }else{
          finder = new Finder();
        }

    }else if(solveMazeFinished){

      // console.log(bn.activePopulation);
        for (let i = bn.activePopulation.length - 1; i >= 0; i--) {
          let circle = bn.activePopulation[i];
          // Bird uses its brain!
          circle.inputs = circle.predict();
          // console.log(circle.inputs);
          // console.log("bird.inputs: ", bird.inputs);
          var actions = circle.outputs();
          // console.log("actions: ", actions);
          if(actions) circle.do(actions);
          // circle1.update();
          circle.generation = generation;
          // circle.draw();

          if(circle.hit){
            bn.activePopulation.splice(i, 1);
          }
          
      }

      if (bn.activePopulation.length == 0) {
          bn.nextGeneration();
          generation++;
          // console.log("generation: " + generation);
      }

      // if(finder){
      //     finder.draw();
      //     // console.log(finder.paths[0].pathIndex);
      //     pathIndex = (finder.paths[0].pathIndex);
      //     // console.log(pathIndex);
      //   }else{
      //     finder = new Finder();
      //   }

    }
    // circle1.draw();

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

function checkIndex(i, j) {

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