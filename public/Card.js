class Card {
  constructor(idx, x, y) {
    this.index = idx;
    this.x = x;
    this.y = y;
    this.facedown = true;
    this.wasEverFacedown = false;
    this.visibleTo = -1; //undefined;  // a player.seatPos
    this.selected = false;
    this.cardPosition = -1;  // for cards on the table
    // this.toPass = false;
    // This also causes a recursion error.  See Player.js
    // this.image = m_cardImages[this.index];
  }

  show() {
    if (!m_thisPlayer) return;
    
    if (this.facedown) {
      if (this.visibleTo == m_thisPlayer.seatPos) {
        image(m_cardImages[this.index], this.x, this.y);
        noStroke();
        fill(128, 128, 128, 100);
        rect(this.x, this.y, CARD_WIDTH, CARD_HEIGHT);
        stroke(0);
        strokeWeight(2);
        let off = 10;
        line(this.x+off,            this.y+off, this.x+CARD_WIDTH-off, this.y+CARD_HEIGHT-off);
        line(this.x+CARD_WIDTH-off, this.y+off, this.x+off,            this.y+CARD_HEIGHT-off);
      } else {
        image(m_cardBackImage, this.x, this.y);
      }
    } else {
      if (this.wasEverFacedown) {
        image(m_cardImages[this.index], this.x, this.y-5);
      } else {
        image(m_cardImages[this.index], this.x, this.y);
      }
    }

    if (this.selected) {
      stroke(255, 0, 0);
      strokeWeight(4);
      noFill();
      if (!this.facedown && this.wasEverFacedown) {
        rect(this.x-1, this.y-6, CARD_WIDTH+2, CARD_HEIGHT+2);
      } else {
        rect(this.x-1, this.y-1, CARD_WIDTH+2, CARD_HEIGHT+2);
      }
    }

    // if (this.toPass) {
    //   stroke(0, 255, 0);
    //   strokeWeight(2);
    //   fill(0, 255, 0);
    //   text("P", this.x+2, this.y+(CARD_HEIGHT/2));
    // }
  }

  setFacedown() {
    this.facedown = true;
    this.wasEverFacedown = true;
  }
  setFaceup() {
    this.facedown = false;
  }
  flipCard(player) {
    this.facedown = !this.facedown;
    if (this.facedown) {
      // if this is a table card, the player will be null
      if (player) {
        this.visibleTo = player.seatPos;
      }
    }
  }

  reset() {
    this.facedown = true;
    this.wasEverFacedown = false;
    this.visibleTo = -1;
    this.selected = false;
    this.cardPosition = -1;
    // this.toPass = false;
  }

  copyFromServerData(data) {
    this.index = data.index;
    this.x = data.x;
    this.y = data.y;
    this.facedown = data.facedown;
    this.wasEverFacedown = data.wasEverFacedown;
    this.visibleTo = data.visibleTo;
    this.selected = data.selected;
    this.cardPosition = data.cardPosition;
    // this.toPass = data.toPass;
  }

}