// Contributed by Tan

var s = function(sketch)
{
  var bird;
  var pipes = [];

  sketch.setup = function()
  {
    var canvas = sketch.createCanvas(640, 480);

    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('bird-canvas');

    bird = new Bird();
    pipes.push(new Pipe());
  };

  sketch.draw = function()
  {
    sketch.background(0);

    for (var i = pipes.length-1; i >= 0; i--) {
      pipes[i].show();
      pipes[i].update();

      if (pipes[i].hits(bird)) {
        console.log("HIT");
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    bird.update();
    bird.show();

    if (birdP5.frameCount % 75 == 0) {
      pipes.push(new Pipe());
    }
  };

  sketch.keyPressed = function()
  {
    if (sketch.key == ' ') {
      bird.up();
      //console.log("SPACE");
    }
  }
}

var birdP5 = new p5(s);