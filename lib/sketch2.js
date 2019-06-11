// Contributed by Tan
const TOTAL = 500;
var birds = [];
var savedBirds = [];
var pipes = [];
let counter = 0;
let slider;


var s = function(sketch)
{
  sketch.setup = function()
  {
    var canvas = sketch.createCanvas(840, 480);
    slider = sketch.createSlider(1, 100);
    slider.value(1); // initialize default speed
    
    for(let i = 0; i < TOTAL; i++)
    {
      birds[i] = new Bird;
    }

    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('bird-canvas');

    // bird = new Bird();
  };

  sketch.draw = function()
  {
    for(let n = 0; n < slider.value(); n++)
    {

      console.log("n: ", n);
      if (counter % 75 == 0) {
        pipes.push(new Pipe());
      }
      counter++;

      for (var i = pipes.length-1; i >= 0; i--) {
        pipes[i].show();
        pipes[i].update();

        for(let j = birds.length-1; j >= 0; j--)
        {
          if (pipes[i].hits(birds[j])) {
            savedBirds.push(birds.splice(j,1)[0]);
          }
        }

        if (pipes[i].offscreen()) {
          pipes.splice(i, 1);
        }
      }

      for(let i = birds.length-1; i >= 0; i--)
      {
        if (birds[i].offScreen()) {
          savedBirds.push(birds.splice(i,1)[0]);
        }
      }

      for(let bird of birds)
      {
        bird.think(pipes);
        bird.update();
        bird.show();  
      }

      // All birds die, remove all pipes -> next gen !
      if(birds.length === 0)
      {
        counter = 0;
        nextGeneration();
        pipes = [];
      }

      sketch.background(0);

      for(let bird of birds)
      {
        bird.show();
      }

      for(let pipe of pipes)
      {
        pipe.show();
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