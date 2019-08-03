// Contributed by Tan

//Using bird neuron
let bn = new BirdNeuron();

//All pipes
let pipes = [];

// A frame counter to determine when to add a pipe
let counter = 0;

// Interface elements
let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;
let curGeneration, time, modelScore;
let initialTime;

// All time high score
let highScore = 0;
let tempHighScore = 0;

// Training or just showing the current best
let pause = false;
let pauseButton;

//Model + images
let birdmodel;
let birdbackground;
let pipemodel;
let pipemodel_reverse;

//Models save in mongodb
let dataSaved;

var s = function(sketch)
{
  sketch.preload = function() {
    birdmodel = sketch.loadImage('images/birdmodel.png');
    birdbackground = sketch.loadImage('images/birdgame_background.jpg');
    pipemodel = sketch.loadImage('images/pipemodel.png');
    pipemodel_reverse = sketch.loadImage('images/pipemodel_reverse.png');
  }

  sketch.setup = function()
  {
    console.log("Sketch setup");
    sketch.angleMode(sketch.DEGREES);
    var canvas = sketch.createCanvas(650, 480);

    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('bird-canvas');

    // Access the interface elements
    speedSlider = sketch.select('#speedSlider');
    speedSpan = sketch.select('#speed');
    // highScoreSpan = sketch.select('#hs');
    allTimeHighScoreSpan = sketch.select('#ahs');
    pauseButton = sketch.select('#pause');
    pauseButton.mousePressed(sketch.toggleState);

    exportmodelBtn = sketch.select("#exportmodel");
    exportmodelBtn.mousePressed(sketch.exportModel);

    importmodelBtn = sketch.select("#importmodel");
    importmodelBtn.mousePressed(sketch.importModel);

    // Create a population
    bn.totalPopulation = 500;
    bn.inputlayer = 5;
    bn.hiddenlayer = 8;
    bn.outputlayer = 2;

    //Create birds
    var tempBirds = [];
    for (let i = 0; i < bn.totalPopulation; i++) {
      let bird = new Bird();
      // console.log("bird: ", bird);
      tempBirds.push(bird);
    }

    bn.input(tempBirds, false);

    //Model init
    dataSaved = {};
    generation = 1;
    time = 0;
    initialTime = (new Date).getTime();

    //Ajax get statistics
    // $.ajax({
    //   url: "http://localhost:8080/birdchart/get",
    //   success: function(result){
    //     console.log("result: ", result);
    //   }
    // });

    //Ajax upload statistics
    // $.ajax({
    //   url: "http://localhost:8080/birdchart/upload",
    //   type: "POST",
    //   data: {
    //     data: {
    //       topScore: 1,
    //       data: {
    //         generation: 1,
    //         time: 1,
    //         score: 1
    //       }
    //     }
    //   },
    //   success: function(result){
    //     console.log("upload successfully: ", result);
    //   } 
    // });
  };

  sketch.exportModel = function()
  {
    bn.exportBest();
  }

  sketch.importModel = function()
  {
    bn.import(Bird); 
  }

  sketch.toggleState = function()
  {
    pause = !pause;
    if(pause)
    {
      pauseButton.html("Play");
    }else
    {
      pauseButton.html("Pause");
    }
  }

  //Required
  sketch.draw = function()
  {
    // sketch.background(0);
    sketch.background(birdbackground);
    sketch.textSize(32);
    sketch.fill(65);
    sketch.text("Score: ", sketch.width - 200, 30);

    // Should we speed up cycles per frame
    let cycles = speedSlider.value();
    // console.log("cycles:", cycles);
    speedSpan.html(cycles);

    if(pause)
    {
      for(let i = 0; i < bn.activePopulation.length; i++)
      {
        bn.activePopulation[i].show();
      }

      for(let i = 0; i < pipes.length; i++)
      {
        pipes[i].show();
      }

      sketch.fill(65);
      sketch.text(tempHighScore, sketch.width - 100, 30);
      allTimeHighScoreSpan.html(highScore);

      return;
    }

    // How many times to advance the game
    for (let n = 0; n < cycles; n++) {
      

      // Show all the pipes
      for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();
        if (pipes[i].offscreen()) {
          pipes.splice(i, 1);
        }
      }
      
      // Are we just running the best bird
      // if (runBest) {
      //   bestBird.think(pipes);
      //   bestBird.update();
      //   for (let j = 0; j < pipes.length; j++) {
      //     // Start over, bird hit pipe
      //     if (pipes[j].hits(bestBird)) {
      //       resetGame();
      //       break;
      //     }
      //   }

      //   if (bestBird.bottomTop()) {
      //     resetGame();
      //   }
      

      // // Or are we running all the active birds
      // } else {
        for (let i = bn.activePopulation.length - 1; i >= 0; i--) {
          let bird = bn.activePopulation[i];
          // Bird uses its brain!
          bird.inputs = bird.think(pipes);
          // console.log("bird.inputs: ", bird.inputs);
          var actions = bird.outputs();
          // console.log("actions: ", actions);
          if(actions) bird.do(actions);
          bird.update();

          // Check all the pipes
          for (let j = 0; j < pipes.length; j++) {
            // It's hit a pipe
            if (pipes[j].hits(bn.activePopulation[i])) {
              // Remove this bird
              bn.activePopulation.splice(i, 1);
              break;
            }
          }

          // If birds fall out of game's frame -> dead
          if (bird.bottomTop()) {
            bn.activePopulation.splice(i, 1);
          }

        }
      // }

      // Add a new pipe every so often
      if (counter % 75 == 0) {
        pipes.push(new Pipe());
      }
      counter++;
    }


    /* SHOW SCORES */

    // What is highest score of the current population
    let tempBestBird = null;
    for (let i = 0; i < bn.activePopulation.length; i++) {
      let s = bn.activePopulation[i].score;
      if (s > tempHighScore) {
        tempHighScore = s;
        tempBestBird = bn.activePopulation[i];
      }
    }

    if (tempHighScore > highScore) {
      highScore = tempHighScore;
      bestBird = tempBestBird;
    }

    // Update DOM Elements
    // highScoreSpan.html(tempHighScore);
    sketch.fill(65);
    sketch.text(tempHighScore, sketch.width - 100, 30);
    allTimeHighScoreSpan.html(highScore);
    
    // Draw everything!
    for (let i = 0; i < pipes.length; i++) {
      pipes[i].show();
    }

    for (let i = 0; i < bn.activePopulation.length; i++) {
      bn.activePopulation[i].show();
    }

    // console.log(bn.activePopulation.length);
    // If we're out of birds go to the next generation
    if (bn.activePopulation.length == 0) {

      //Get the time
      var stopTime = (new Date).getTime();
      time = stopTime - initialTime;
      saveModelGeneration(generation, time, tempHighScore, dataSaved);
      generation += 1;
      bn.nextGeneration(function(){
        counter = 0;
        tempHighScore = 0;
        pipes = [];
      });

      //Reset variables
      time = stopTime;
    }
    
  };

  // sketch.keyPressed = function()
  // {
  //   if (sketch.key == ' ') {
  //     bird.up();
  //     //console.log("SPACE");
  //   }
  // }
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
  console.log(modelArray);
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

var birdP5 = new p5(s);