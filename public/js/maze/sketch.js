//Global VARIABLE HERE

var s = function(sketch)
{
  // Load images
  sketch.preload = function() {
    // birdmodel = sketch.loadImage('images/birdmodel.png');
  }

  sketch.setup = function()
  {
    sketch.angleMode(sketch.DEGREES);
    var canvas = sketch.createCanvas(650, 480);

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

  };

  // Function to actually draw the game here
  sketch.draw = function()
  {
    sketch.background(255,0,0); // RED background for now
  };
}

var mazeP5 = new p5(s);