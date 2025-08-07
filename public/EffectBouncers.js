class EffectBouncers {
  constructor(num, duration) {
    this.bouncers = [];
    let multiplier = 18;
    this.duration = duration;
    this.framecount = 0;

    for (let i = 0; i < num; i++) {
      let x = random(width);
      let y = random(height);
      let speedX = random(-0.5, 0.5) * multiplier;
      let speedY = random(-0.5, 0.5) * multiplier;
      let radius = random(10, 25);
  
      let b = new Bouncer(x, y, speedX, speedY, radius);
      this.bouncers.push(b);
    }
  }

  show() {
    noStroke();
    for (let bounce of this.bouncers) {
      bounce.show();
      bounce.move();
      bounce.bounce();
    }
    this.framecount++;
    return (this.framecount >= this.duration);
  }
}

////////////////////////////////

class Bouncer {
  constructor(tempX, tempY, tempSpeedX, tempSpeedY, tempRadius) {
    this.x = tempX;
    this.y = tempY;
    this.speedX = tempSpeedX;
    this.speedY = tempSpeedY;
    this.radius = tempRadius;
    this.color = 
    this.color = this.getRandomHSLColor();

  }

  show() {
    fill(this.color, 60, 100);
    ellipse(this.x, this.y, this.radius * 2);
  }

  move() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  bounce() {
    if (this.x < 0 || this.x > width) {
      this.speedX = -this.speedX;
    }

    if (this.y < 0 || this.y > height) {
      this.speedY = -this.speedY;
    }
  }

  getRandomHSLColor() {
    const hue = floor(Math.random()*360);
    return color( "hsl("+hue+", 100%, 50%)");
  }
}