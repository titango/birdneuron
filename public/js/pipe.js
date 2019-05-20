// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY&

function Pipe() {
  this.spacing = 175;
  this.top = birdP5.random(birdP5.height / 6, 3 / 4 * birdP5.height);
  this.bottom = birdP5.height - (this.top + this.spacing);
  this.x = birdP5.width;
  this.w = 80;
  this.speed = 6;

  this.highlight = false;

  this.hits = function(bird) {
    if (bird.y < this.top || bird.y > birdP5.height - this.bottom) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        this.highlight = true;
        return true;
      }
    }
    this.highlight = false;
    return false;
  }

  this.show = function() {
    birdP5.fill(255);
    if (this.highlight) {
      birdP5.fill(255, 0, 0);
    }
    birdP5.rect(this.x, 0, this.w, this.top);
    birdP5.rect(this.x, birdP5.height-this.bottom, this.w, this.bottom);
  }

  this.update = function() {
    this.x -= this.speed;
  }

  this.offscreen = function() {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  }


}