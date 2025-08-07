class HeartImages {
  constructor(position, duration) {
    this.origin = position.copy();
    this.duration = duration;

    this.points = [];
    this.frameCount = 0;
    this.size = 0;
    this.imageIndexes = [];
    this.pulse = (random() < 0.5) ? true : false;
    this.pulse = false;
    this.offset = 0;
    this.trailPoints = [];
    this.factor = 4;
    this.angleDelta = 0.2;

    // this results in points being 32 long 
    for (let a = 0; a < TWO_PI; a += this.angleDelta) {
      const x = 16 * pow(sin(a), 3);
      const y = -(13 * cos(a) - 5*cos(2*a) - 2*cos(3*a)- cos(4*a));
      this.points.push({x, y});
      this.imageIndexes.push(floor(random(52)));
    }

    let a = 0;
    for (let i = 0; i < this.points.length*this.factor; i++) {
      const x = 16 * pow(sin(a), 3);
      const y = -(13 * cos(a) - 5*cos(2*a) - 2*cos(3*a)- cos(4*a));
      this.trailPoints.push({x, y});
      a += this.angleDelta / this.factor;  // this is 0.2 / 4
    }
  }
  
  show() {
    stroke(255);
    strokeWeight(4);
    fill(255);
    push();
    translate(this.origin.x, this.origin.y);
    if (this.pulse) {
      this.size = (this.size + 0.1) % TWO_PI;
      let size2 = map(sin(this.size), -1, 1, 5, 20);

      for (let i = 0; i < this.points.length; i++) {
        image(m_cardImages[this.imageIndexes[i]], size2 * this.points[i].x, size2 * this.points[i].y);
      } 

      pop();
    } 
    else {
      let size2 = 20;
      for (let i = 0; i < this.imageIndexes.length; i++) {
        let idx = (i*this.factor + this.offset) % this.trailPoints.length;
        image(m_cardImages[this.imageIndexes[i]], size2 * this.trailPoints[idx].x, size2 * this.trailPoints[idx].y);
      }
      if ((this.frameCount % 3) == 0) {
        this.offset++;
      }
    }
    // else {
    //   let size2 = 20;
    //   for (let i = 0; i < this.points.length; i++) {
    //     let idx = (i + this.offset) % this.points.length;

    //     image(m_cardImages[this.imageIndexes[i]], size2 * this.points[idx].x, size2 * this.points[idx].y);

    //   }
    //   if ((this.frameCount % 20) == 0) {
    //     this.offset++;
    //   }
    // }


    this.frameCount++;
    return (this.frameCount > this.duration);
  }
  
}

class Heart {
  constructor(position, duration) {
    this.origin = position.copy();
    this.duration = duration;

    this.points = [];
    this.frameCount = 0;
    this.size = 0;

    for (let a = 0; a < TWO_PI; a += 0.1) {
      const x = 16 * pow(sin(a), 3);
      const y = -(13 * cos(a) - 5*cos(2*a) - 2*cos(3*a)- cos(4*a));
      this.points.push({x, y});
    }
    for (let pt of this.points) {
      console.log(pt.x, pt.y)
    }
  }
  
  show() {
    this.size = (this.size + 0.1) % TWO_PI;
    let size2 = map(sin(this.size), -1, 1, 5, 12);

    stroke(255);
    strokeWeight(4);
    fill(255);
    push();
    translate(this.origin.x, this.origin.y);
    for (let pt of this.points) {
      point(size2*pt.x, size2*pt.y, 4);
    }
    
    pop();

    this.frameCount++;
    return (this.frameCount > this.duration);
  }
  
}