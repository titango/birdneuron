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
var highestScore = 0; 
let speedSlider;
let speedSpan;
let gameEnd = false;
let generationSpan;
let findIntersection = false;
//Models save in mongodb
let dataSaved;
let initialTime;
let importCompleted = false;

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
    generationSpan = sketch.select('#generation');
    // allTimeHighScoreSpan = sketch.select('#ahs');
    runBestButton = sketch.select('#best');
    runBestButton.mousePressed(sketch.toggleState);
    // solveButton = sketch.select('#solve');
    // solveButton.mousePressed(sketch.toggleState1);

    speedSlider = sketch.select('#speedSlider');
    speedSpan = sketch.select('#speed');

    exportmodelBtn = sketch.select("#exportmodel");
    exportmodelBtn.mousePressed(sketch.exportModel);

    importmodelBtn = sketch.select("#importmodel");
    importmodelBtn.mousePressed(sketch.importModel);
    
    // Create a population
    bn.totalPopulation = 500;
    bn.inputlayer = 5;
    bn.hiddenlayer = 8;
    bn.outputlayer = 4;

    //Model init
    dataSaved = {};
    generation = 1;
    time = 0;
    initialTime = (new Date).getTime();

    //Create circles
    let tempCircles = [];
    for (let i = 0; i < bn.totalPopulation; i++) {
      let circle = new Circle();
      tempCircles.push(circle);
    }

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
    // Should we speed up cycles per frame
    let cycles = speedSlider.value();
    // console.log("cycles:", cycles);
    speedSpan.html(cycles);

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
          for (var i = 0; i < 100; i++) {
            finder.draw();
            pathIndex = (finder.paths[0].pathIndex);
          }
          
        }else{
          finder = new Finder();
        }

    }else if(solveMazeFinished && !gameEnd){

        for (let n = 0; n < cycles; n++) {

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
                // console.log(actions);
                bn.activePopulation.splice(i, 1);
                if(circle.score > highestScore){
                    highestScore = circle.score;
                    // console.log("highestScore: " + highestScore);
                    console.log(circle.index);
                }
              }

            }

        }

      // console.log(bn.activePopulation);
        for (let i = bn.activePopulation.length - 1; i >= 0; i--) {
          let circle = bn.activePopulation[i];
          circle.draw();
        }

      if (bn.activePopulation.length == 0) {

        var stopTime = (new Date).getTime();
          time = stopTime - initialTime;
          saveModelGeneration(generation, time, highestScore, dataSaved);

        if(!importCompleted){
          bn.nextGeneration();
          
        }else{
          
          bn.refreshPopulation();
          //Reset variables
          time = stopTime;
        }
          generation++;
          // Update DOM Elements
          generationSpan.html(generation);
          if(generation % 10 == 0){
              highestScore = 0;
          }

          
          
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

  sketch.exportModel = function()
  {
    bn.exportBest();
  }

  sketch.importModel = function()
  {
    bn.import(Circle, function(){ 
      gameEnd = false;
      // bn.refreshPopulation();
      importCompleted = true;
      generation = 1;
      
    }); 
    // pipes = [];
    // gameEnd = false;
  }

}

// function runBestCircle(){
  
// }

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

function saveModelGeneration(genNumber, time, scores, modelArray)
{
  if(!modelArray.topScore)
  {
    modelArray.topScore = 0;
  }

  if(!modelArray.data)
  {
    modelArray.data = [];
  }

  if(modelArray.topScore < scores)
  {
    modelArray.topScore = scores;
  }

  var newData = {
    generation: genNumber,
    time: time, 
    score: scores
  }
  modelArray.data.push(newData);
  // console.log(modelArray);
  drawLineChart(modelArray);
  
}

function drawLineChart(modelArray)
{
  //Reset
  var lineDiv = document.getElementById("linechart");
  lineDiv.innerHTML = "";

  var margin = {top: 20, right: 50, bottom: 80, left: 50}
  , width = lineDiv.clientWidth - margin.left - margin.right // Use the window's width 
  , height = lineDiv.clientHeight - margin.top - margin.bottom; // Use the window's height

  var n = 21;

// 5. X scale will use the index of our data
var xScale = d3.scaleLinear()
    .domain([0, modelArray.data[modelArray.data.length-1].generation]) // input
    .range([0, width]); // output

// var xAxis = d3.svg.axis()
//       .scale(xScale)
//       .tickSize(0,0)
//       .ticks(5)
//       .tickPadding(6)
//       .orient("bottom")
//       .tickFormat(function(d){return d});

// 6. Y scale will use the randomly generate number 
var yScale = d3.scaleLinear()
    .domain([0,modelArray.topScore]) // input 
    .range([height, 0]); // output 

// 7. d3's line generator
var line = d3.line()
    .x(function(d, i) { return xScale(i); }) // set the x values for the line generator
    .y(function(d) { return yScale(d.y); }) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line

// 8. An array of objects of length N. Each object has key -> value pair, the key being "y" and the value is a random number
// var dataset = d3.range(n).map(function(d) { return {"y": d3.randomUniform(1)() } })
var dataset = modelArray.data.map(function(d) { 
  return {"y": d.score } 
});

// 1. Add the SVG to the page and employ #2
var svg = d3.select("#linechart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 3. Call the x axis in a group tag
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickFormat(function(d){ 
      var t = d;
      if(typeof modelArray.data[d] == 'undefined')
      {
        return;
      }
      return t+1 + "(" + modelArray.data[d].time + ")";
    })); // Create an axis component with d3.axisBottom

svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height - margin.top + margin.bottom - 20) + ")")
      .style("text-anchor", "middle")
      .text("Generation with Time");


// 4. Call the y axis in a group tag
svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Score");    

// 9. Append the path, bind the data, and call the line generator 
svg.append("path")
    .datum(dataset) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line); // 11. Calls the line generator 

// 12. Appends a circle for each datapoint 
svg.selectAll(".dot")
    .data(dataset)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d, i) { return xScale(i) })
    .attr("cy", function(d) { return yScale(d.y) })
    .attr("r", 5)
      // .on("mouseover", function(a, b, c) { 
      //   console.log(a) 
      //   this.attr('class', 'focus')
      // })
      // .on("mouseout", function() {  });
}

var mazeP5 = new p5(s);