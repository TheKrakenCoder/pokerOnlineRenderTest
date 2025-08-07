class EffectStreams {
  constructor(position, duration) {
    this.origin = position.copy();
    this.duration = duration;
    this.frameCount = 0;
    this.particles = [];
  }

  addParticle () {
    this.particles.push(new StreamParticle(this.origin));
  }

  show () {
    this.frameCount++;
    this.addParticle();
    for (var i = this.particles.length-1; i >= 0; i--) {
      var p = this.particles[i];
      p.run();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
    return (this.frameCount > this.duration);
  }

}// class EffectStreams

// A simple StreamParticle class
class StreamParticle {
  constructor(position) {
    this.acceleration = createVector(0, 0.05);
    this.velocity = createVector(random(-3, 3), random(-1, -5));
    this.position = position.copy();
    this.lifespan = 400.0;
    this.color = color(random(255), random(255), random(255));
    this.rotateSpeed = 1.0;
    this.angle = 0;
  }

  run() {
    this.update();
    this.display();
  };
  
  // Method to update position
  update (){
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
    this.angle += this.rotateSpeed;
    if (this.rotateSpeed > 0) {
      this.rotateSpeed -= 0.1;	
    }
  }

  // Method to display
  display () {
    stroke(200, this.lifespan);
    strokeWeight(2);
    //fill(127, this.lifespan);
    //ellipse(this.position.x, this.position.y, 12, 12);
    stroke(this.color, this.lifespan);
    //point(this.position.x, this.position.y);
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    line(-10, 0, 10, 0);
    pop();
  }

  // Is the particle still useful?
  isDead(){
    if (this.lifespan < 0) {
      return true;
    } else {
      return false;
    }
  }
}  // class Particle

