class Pipe {
  constructor()
  {
    this.spacing = 75;
    this.top = birdP5.random(birdP5.height / 6, 3 / 4 * birdP5.height);
    this.bottom = birdP5.height - (this.top + this.spacing);
    this.x = birdP5.width;
    this.w = 80;
    this.speed = 6;

    this.highlight = false;
    this.isHighlightTop = false;
    this.isHighlightBot = false;
  }

  hits(bird) {
    if (bird.y <= this.top || (bird.y+bird.r*2) >= birdP5.height - this.bottom) {
      if (bird.x >= this.x && bird.x <= this.x + this.w) {
        this.highlight = true;

        if(bird.y <= this.top) this.isHighlightTop = true;
        if((bird.y+bird.r*2) >= birdP5.height - this.bottom) this.isHighlightBot = true;

        return true;
      }
    }
    this.highlight = false;
    return false;
  }

  show() {
    birdP5.stroke(255);
    birdP5.fill(255);

    //Touching the pipe
    if (this.highlight) {
      birdP5.stroke(255);
      birdP5.strokeWeight(1);
      birdP5.fill(255, 0, 0);

      if(this.isHighlightTop)
      {
        birdP5.rect(this.x, 0, this.w , this.top);
        birdP5.image(pipemodel, this.x, birdP5.height-this.bottom, this.w, this.bottom);
      
      }else if(this.isHighlightBot)
      {
        birdP5.image(pipemodel_reverse, this.x, 0, this.w, this.top); 
        birdP5.rect(this.x, birdP5.height-this.bottom, this.w, this.bottom);
      }
    }else
    {
      birdP5.stroke(255);
      birdP5.strokeWeight(1);
      birdP5.noFill();

      //Draw top
      // birdP5.rect(this.x, 0, this.w , this.top); //Stroke border testing
      birdP5.image(pipemodel_reverse, this.x, 0, this.w, this.top);

      //Draw bottom
      // birdP5.rect(this.x, birdP5.height-this.bottom, this.w, this.bottom); //Stroke border testing
      birdP5.image(pipemodel, this.x, birdP5.height-this.bottom, this.w, this.bottom);
    }

    // birdP5.rect(this.x, 0, this.w, this.top);
    // birdP5.rect(this.x, birdP5.height-this.bottom, this.w, this.bottom);
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  }


}