// Contributed by Tan
const TOTAL = 250;
var birds = [];
var savedBirds = [];
var pipes = [];
let counter = 0;

var s = function(sketch)
{
  sketch.setup = function()
  {
    var canvas = sketch.createCanvas(840, 480);
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
    sketch.background(0);
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

    for(let bird of birds)
    {
      bird.think(pipes);
      bird.update();
      bird.show();  
    }

    if(birds.length === 0)
    {
      counter = 0;
      nextGeneration();
      pipes = [];
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