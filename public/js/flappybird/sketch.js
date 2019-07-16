// Contributed by Tan

//Using bird neuron
let bn = new BirdNeuron();

// All active birds (not yet collided with pipe)
// let activeBirds = [];
// let allBirds = [];
let pipes = [];

// A frame counter to determine when to add a pipe
let counter = 0;

// Interface elements
let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan;

// All time high score
let highScore = 0;

// Training or just showing the current best
let pause = false;
let pauseButton;

//Model + images
let birdmodel;
let birdbackground;
let pipemodel;
let pipemodel_reverse;


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
    highScoreSpan = sketch.select('#hs');
    allTimeHighScoreSpan = sketch.select('#ahs');
    pauseButton = sketch.select('#pause');
    pauseButton.mousePressed(sketch.toggleState);

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

    console.log(bn);
    bn.input(tempBirds);

  };

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

  sketch.draw = function()
  {
    // sketch.background(0);
    sketch.background(birdbackground);

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
    let tempHighScore = 0;
    // If we're training
    // if (!runBest) {
      // Which is the best bird?
      let tempBestBird = null;
      for (let i = 0; i < bn.activePopulation.length; i++) {
        let s = bn.activePopulation[i].score;
        if (s > tempHighScore) {
          tempHighScore = s;
          tempBestBird = bn.activePopulation[i];
        }
      }

      // Is it the all time high scorer?
      if (tempHighScore > highScore) {
        highScore = tempHighScore;
        bestBird = tempBestBird;
      }
    // } 
    // else {
      // Just one bird, the best one so far
      // tempHighScore = bestBird.score;
      // if (tempHighScore > highScore) {
        // highScore = tempHighScore;
      // }
    // }

    // Update DOM Elements
    highScoreSpan.html(tempHighScore);
    allTimeHighScoreSpan.html(highScore);

    // Draw everything!
    for (let i = 0; i < pipes.length; i++) {
      pipes[i].show();
    }

    // if (runBest) {
      // bestBird.show();
    // } else {
      for (let i = 0; i < bn.activePopulation.length; i++) {
        bn.activePopulation[i].show();
      }

      // console.log(bn.activePopulation.length);
      // If we're out of birds go to the next generation
      if (bn.activePopulation.length == 0) {
        bn.nextGeneration(function(){
          counter = 0;
          pipes = [];
        });
      }
    // }
    
  };

  // sketch.keyPressed = function()
  // {
  //   if (sketch.key == ' ') {
  //     bird.up();
  //     //console.log("SPACE");
  //   }
  // }
}

var birdP5 = new p5(s);