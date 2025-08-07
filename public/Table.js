const MAX_CARDS_PER_ROW = 4;
class Table {
  constructor() {
    this.cards = [];  // Card objects
    this.pot = 0;
    // this.x = width * 0.33
    // this.y = height * 0.33;
    // this.w = width * 0.33
    // this.h = height * 0.33;
    this.cardLocations = [];
    let cardY = width * 0.2 + 30;
    let cardX = width * 0.4 - 10;
    let irow = -1;
    for (let i = 0; i < 52; i++) {
      // this.cards[i].x = cardX + (i%MAX_CARDS_PER_ROW)*(CARD_WIDTH/2);
      let x = cardX + (i%MAX_CARDS_PER_ROW)*(CARD_WIDTH);
      if (i%MAX_CARDS_PER_ROW == 0) irow += 1;
      let y = cardY + irow*(CARD_HEIGHT);
      this.cardLocations[i] = [x, y];
    }

  }

  show() {
    // Background
    // xx, yy of center
    let xx = width * 0.5;
    let yy = height * 0.5
    // get the smaller dimension and make the table a circle
    let ww = (height < width ? height*0.5: width*0.5);
    let hh = ww;
    noStroke();
    fill(50, 101, 77);
    ellipse(xx, yy, ww, hh);
    strokeWeight(8);
    noFill();
    stroke(0);
    ellipse(xx+2, yy+2, ww-3, hh-3);
    stroke(205, 127, 50);
    ellipse(xx, yy, ww, hh);

   
    // Pot size
    // let betX = width/2-(textWidth(this.pot)/2) - 50;
    // let betY = width * 0.2 + 10;
    // Calculate where to put the bet if there are cards on the table
    let betX = xx - ww/2 + 10;
    let betY = yy;

    // Calculate where to put the bet if there are not cards on the table
    if (this.cards.length <= 0) {
      betX = xx;
      betY = yy;
      // this.showChips(this.pot, betX, betY);
      showChips(this.pot, betX, betY+30, m_chipImages);
    }
    strokeWeight(2);
    stroke(255);
    fill(255);
    textSize(TEXT_SIZE);
    // text(this.pot, this.x+5, this.y+5+TEXT_SIZE);
    text(this.pot, betX, betY);
    
    // The cards
    // let cardY = width * 0.2 + 30;
    // let cardX = width * 0.4 - 10;
    // let irow = -1;

    // for (let i = 0; i < this.cards.length; i++) {
    //   this.cards[i].x = cardX + (i%MAX_CARDS_PER_ROW)*(CARD_WIDTH);
    //   if (i%MAX_CARDS_PER_ROW == 0) irow += 1;
    //   this.cards[i].y = cardY + irow*(CARD_HEIGHT);
    //   this.cards[i].show();
    // }
    let cardPosition;
    for (let i = 0; i < this.cards.length; i++) {
      // Don't overwrite the x,y of a table card if we are moving it.
      if (i != m_lastSelectedTableCardIndex) {
        // console.log('recalculating card x, y');
        // We should always have a cardPosition for cards on the table, but play it safe
        if (this.cards[i].cardPosition != -1) cardPosition = this.cards[i].cardPosition;
        else                                  cardPosition = i;
        this.cards[i].x = this.cardLocations[cardPosition][0];
        this.cards[i].y = this.cardLocations[cardPosition][1];
      } else {
        // console.log('using m_lastSelectedTableCardPos');
        this.cards[i].x = m_lastSelectedTableCardPos[0];
        this.cards[i].y = m_lastSelectedTableCardPos[1];
      }
      // console.log('Table ', this.cards[i].x, this.cards[i].y)
      this.cards[i].show();
    }
  }

  // showChips(amt, baseX, baseY) {
  //   let chipValues = [25, 5, 2, 1];
  //   for (let i = 0; i < chipValues.length; i++) {
  //     let chipNum = 0;
  //     while (amt >= chipValues[i]) {
  //       image(m_chipImages[i], baseX - 100 + i*50, baseY + 30 - chipNum*5, m_chipImages[i].width, m_chipImages[i].height);
  //       amt -= chipValues[i];
  //       chipNum++;
  //     }
  //   }
  // }


  // card is a Card
  addCardUp(card) {
    card.visibleTo = -1;
    card.setFaceup();
    card.cardPosition = this.cards.length;
    this.cards.push(card);
  }
  
  // card is a Card
  addCardHidden(card) {
    card.setFacedown();
    card.visibleTo = -1;
    card.cardPosition = this.cards.length;
    this.cards.push(card);
  }

  reset(potMustBeZero) {
    this.cards = [];
    if (potMustBeZero) this.pot = 0;
  }

  // data is a Table object
  copyFromServerData(data) {
    if (data.cards) {
      this.cards = [];
      for (let c of data.cards) {
        let card = new Card();
        card.copyFromServerData(c);
        this.cards.push(card);
      }
    } else {
      this.cards = [];
    }

    this.pot = data.pot;
    // this.x = data.x;
    // this.y = data.y;
    // this.w = data.w;
    // this.h = data.h;
  }
}
