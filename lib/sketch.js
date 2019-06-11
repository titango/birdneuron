// Contributed by Tan
// const TOTAL = 500;
// var birds = [];
// var savedBirds = [];
// var pipes = [];
// let counter = 0;
// let slider;

// How big is the population
let totalPopulation = 500;
// All active birds (not yet collided with pipe)
let activeBirds = [];
let allBirds = [];
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
let runBest = false;
let runBestButton;


var s = function(sketch)
{
  sketch.setup = function()
  {
    var canvas = sketch.createCanvas(600, 480);

    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('bird-canvas');

    // Access the interface elements
    speedSlider = sketch.select('#speedSlider');
    speedSpan = sketch.select('#speed');
    highScoreSpan = sketch.select('#hs');
    allTimeHighScoreSpan = sketch.select('#ahs');
    runBestButton = sketch.select('#best');
    runBestButton.mousePressed(sketch.toggleState);

    // Create a population
    for (let i = 0; i < totalPopulation; i++) {
      let bird = new Bird();
      activeBirds[i] = bird;
      allBirds[i] = bird;
    }

  };

  sketch.toggleState = function()
  {
    runBest = !runBest;
    // Show the best bird
    if (runBest) {
      resetGame();
      runBestButton.html('continue training');
      // Go train some more
    } else {
      nextGeneration();
      runBestButton.html('run best');
    }
  }

  sketch.draw = function()
  {
    sketch.background(0);

    // Should we speed up cycles per frame
    let cycles = speedSlider.value();
    speedSpan.html(cycles);


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
      if (runBest) {
        bestBird.think(pipes);
        bestBird.update();
        for (let j = 0; j < pipes.length; j++) {
          // Start over, bird hit pipe
          if (pipes[j].hits(bestBird)) {
            resetGame();
            break;
          }
        }

        if (bestBird.bottomTop()) {
          resetGame();
        }
        // Or are we running all the active birds
      } else {
        for (let i = activeBirds.length - 1; i >= 0; i--) {
          let bird = activeBirds[i];
          // Bird uses its brain!
          bird.think(pipes);
          bird.update();

          // Check all the pipes
          for (let j = 0; j < pipes.length; j++) {
            // It's hit a pipe
            if (pipes[j].hits(activeBirds[i])) {
              // Remove this bird
              activeBirds.splice(i, 1);
              break;
            }
          }

          if (bird.bottomTop()) {
            activeBirds.splice(i, 1);
          }

        }
      }

      // Add a new pipe every so often
      if (counter % 75 == 0) {
        pipes.push(new Pipe());
      }
      counter++;
    }

    // What is highest score of the current population
    let tempHighScore = 0;
    // If we're training
    if (!runBest) {
      // Which is the best bird?
      let tempBestBird = null;
      for (let i = 0; i < activeBirds.length; i++) {
        let s = activeBirds[i].score;
        if (s > tempHighScore) {
          tempHighScore = s;
          tempBestBird = activeBirds[i];
        }
      }

      // Is it the all time high scorer?
      if (tempHighScore > highScore) {
        highScore = tempHighScore;
        bestBird = tempBestBird;
      }
    } else {
      // Just one bird, the best one so far
      tempHighScore = bestBird.score;
      if (tempHighScore > highScore) {
        highScore = tempHighScore;
      }
    }

    // Update DOM Elements
    highScoreSpan.html(tempHighScore);
    allTimeHighScoreSpan.html(highScore);

    // Draw everything!
    for (let i = 0; i < pipes.length; i++) {
      pipes[i].show();
    }

    if (runBest) {
      bestBird.show();
    } else {
      for (let i = 0; i < activeBirds.length; i++) {
        activeBirds[i].show();
      }
      // If we're out of birds go to the next generation
      if (activeBirds.length == 0) {
        nextGeneration();
      }
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

var birdP5 = new p5(s);