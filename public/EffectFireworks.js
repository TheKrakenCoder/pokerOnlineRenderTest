class EffectFireworks {
  constructor(duration) {
    this.fireworks = [];
    this.explosions = [];
    this.framecount = 0;
    this.duration = duration;
    this.gravity = createVector(0, .1);
  }

  show() {
    colorMode(HSB);
    noStroke();

    if (random() < 0.08) {
      this.fireworks.push(new Firework());
    }

    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      this.fireworks[i].applyForce(this.gravity);
      this.fireworks[i].update();
      this.fireworks[i].show();
      if (this.fireworks[i].exploded) {
        // console.log('deleteing');
        this.explosions.push(
          new Explosion(this.fireworks[i].pos, this.fireworks[i].color)
        );
        this.fireworks.splice(i, 1);
      }
    }

    for (let i = this.explosions.length - 1; i >= 0; i--) {
      this.explosions[i].update();
      if (this.explosions[i].finished) {
        // console.log('deleteing');
        this.explosions.splice(i, 1);
      }
    }

    colorMode(RGB);

    this.framecount++;
    return this.framecount >= this.duration;
  }
}

//////////////////////////////////////////////////////////

class Firework {
  constructor() {
    this.pos = createVector(random(width), height);
    // this.vel = createVector(0, random(-8, -6));
    this.vel = createVector(0, random(-12, -8));
    this.acc = createVector();
    this.color = floor(random(255));
    
    this.exploded = false;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    if (this.vel.y >= 0) {
      this.exploded = true;
      // console.log('explode');
    }
  }

  show() {
    fill(this.color, 255, 255);
    ellipse(this.pos.x, this.pos.y, 6);
  }
}

//////////////////////////////////////////////////////////

class Explosion {
  constructor(pos, color) {
    this.lifetime = random(200, 300);
    this.finished = false;
    this.particles = [];
    this.gravity = createVector(0, .1);
    let position = pos.copy();

    for (let index = 0; index < 100; index++) {
      this.particles.push(new Particle(position, color));
    }
  }

  update() {
    // console.log(this.particles.length);
    for (let p of this.particles) {
      p.applyForce(this.gravity);
      p.update();
      p.show(this.lifetime);
    }
    this.lifetime -= 3;
    if (this.lifetime < 0) {
      this.finished = true;
    }
  }
}

//////////////////////////////////////////////////////////

class Particle {
  constructor(pos, color) {
    // each particle needs it own position since they will all change independently
    this.pos = pos.copy();
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(1, 3));
    this.acc = createVector();
    this.color = color;
    this.exploded = false;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.vel.mult(0.97);
  }

  show(lifetime) {
    // alpha goes from 0 to 1 by default
    let life = map(lifetime, 0, 200, 0, 1);
    fill(this.color, 255, 255, life);
    ellipse(this.pos.x, this.pos.y, 3);

  }
}
