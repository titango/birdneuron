// function mutate(x) {
//   if (Math.random(1) < 0.1) {

//     let offset = Math.sqrt(-2 * Math.log(Math.random()))*Math.cos((2*Math.PI) * Math.random()) * 0.5;
//     // let offsetold = birdP5.randomGaussian() * 0.5;
//     // console.log("offset: ", offset);
//     // console.log("offsetold: ", offsetold);
//     let newx = x + offset;
//     return newx;
//   } else {
//     return x;
//   }
// }

class Bird {

  constructor(){
    this.x = 64;
    this.y = birdP5.height/2;
    this.r = 15;

    this.gravity = 0.8;
    this.lift = -12;
    this.velocity = 0;
  }

  copy()
  {
    return new Bird();
  }
  
  //Display the bird
  show() {
    // birdP5.ellipse(this.x, this.y, this.r * 2, this.r * 2);
    birdP5.image(birdmodel, this.x, this.y, this.r * 2, this.r * 2);

    //Stroke border testing
    // birdP5.stroke(255);
    // birdP5.strokeWeight(1);
    // birdP5.noFill();
    // birdP5.rect(this.x, this.y, this.r * 2, this.r * 2);
  }

  // Act as the object's brain to make decision to jump or not
  think(pipes){

    // Find the closest pipe
    let closest = null;
    let record = Infinity;
    for(let i = 0; i < pipes.length; i++)
    {
      let diff = pipes[i].x - this.x;
      // let diff = (pipes[i].x + pipes[i].w) - this.x;
      if(diff < record && diff > 0)
      {
        record = diff;
        closest = pipes[i];
      }
    }

    if(closest != null)
    {
      let inputs  = [];

      // x position of closest pipe
      inputs[0] = birdP5.map(closest.x, this.x, birdP5.width, 0, 1);
      // top of closest pipe opening
      inputs[1] = birdP5.map(closest.top, 0, birdP5.height, 0, 1);
      // bottom of closest pipe opening
      inputs[2] = birdP5.map(closest.bottom, 0, birdP5.height, 0, 1);
      // bird's y position
      inputs[3] = birdP5.map(this.y, 0, birdP5.height, 0, 1);
      // bird's y velocity
      inputs[4] = birdP5.map(this.velocity, -5, 5, 0, 1);

      return inputs;
      // let output = this.brain.predict(inputs);
      // console.log("output: ", output);
      // // if(output[0] > output[1] && this.velocity >= )
      // if(output[1] > output[0])
      // {
      //   this.up();
      // }
    }
  }

  do(outputs)
  {
    if(outputs[1] > outputs[0])
    {
      this.up();
    }
  }

  //When the bird hits bottom - it dies or not
  bottomTop()
  {
    return (this.y > birdP5.height || this.y < 0);
  }

  // Jump
  up() {
    this.velocity += this.lift;
  }

  // Update bird's position based on velocity, gravity, etc.
  update(){
    this.velocity += this.gravity;
    // this.velocity *= 0.9;
    this.y += this.velocity;

    this.score++; // Increase for every frame the bird is still living
  }

}