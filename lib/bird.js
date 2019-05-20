class Bird {

  constructor(brain){
    this.y = birdP5.height/2;
    this.x = 64;

    this.gravity = 0.7;
    this.lift = -12;
    this.velocity = 0;

    this.score = 0;
    this.fitness = 0;

    if(brain)
    {
      this.brain = brain.copy();
    }else {
      this.brain = new NeuralNetwork(4,4,2); // Neural network  bird  
    }
    
  }
  

  show() {
    birdP5.stroke(255)
    birdP5.fill(255, 100);
    birdP5.ellipse(this.x, this.y, 32, 32);
  }

  up() {
    this.velocity += this.lift;
  }

  mutate()
  {
    this.brain.mutate(0.1);
  }

  // Act as the object's brain to make decision
  think(pipes){

    // Find the closest pipe
    let closest = null;
    let closestD = Infinity;
    for(let i = 0; i < pipes.length; i++)
    {
      let d = pipes[i].x - this.x;
      if(d < closestD && d > 0)
      {
        closest = pipes[i];
        closestD = d;
      }
    }

    let inputs  = [];
    inputs[0] = this.y / birdP5.height; // Bird's height
    inputs[1] = closest.top / birdP5.height;
    inputs[2] = closest.bottom / birdP5.height;
    inputs[3] = closest.x / birdP5.width;
    let output = this.brain.predict(inputs);
    // console.log(output);
    if(output[0] > output[1])
    {
      this.up();
    }
  }

  update(){
    this.score++;
    this.velocity += this.gravity;
    // this.velocity *= 0.9;
    this.y += this.velocity;

    if (this.y > birdP5.height) {
      this.y = birdP5.height;
      this.velocity = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }

  }

}