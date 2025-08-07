// Player should have a seatPosition, that never changes.  When a new Player
// comes on board, we (the server) pick the lowest unused seat position.
//         1
//     4       3
//     2       5
//         0
// When we draw the players, we always draw a player at the bottom of the screen
// in seat position 0.  So we draw based on a relative seat position.
class Player {
  constructor(idx, name) {
    // index will end up getting set by the server
    this.socketId = 0;
    this.seatPos = idx;
    this.name = name;
    this.cards = []; // Card objects
    // this.cardX = 0;
    // this.cardY = 0;
    // this.nameY = 0;
    // this.betX = 0;
    // this.betY = 0;
    this.selected = false;
    this.dealer = false;
    this.folded = false;
    this.bet = -1;
    this.money = 100;

    // !! The image can't be serialized, and this is the reason I get a recursion error !!
    // let myImage = createImage(100, 100);
  }


  // remember cards are drawn from the upper left, text from the bottom left
  // show(playerWithMaxBet) {
  show(maxBet, maxCardsSelected) {
    // let savePos = this.seatPos;
    let relativeSeatPos = this.seatPos;
    if (m_debugThisPlayerAtBottomCheckbox) {
      if (m_debugThisPlayerAtBottomCheckbox.checked()) {
        if (!m_thisPlayer) return;
        relativeSeatPos = relativeSeatPos - m_thisPlayer.seatPos;
        if (relativeSeatPos < 0) relativeSeatPos += MAX_SEATS; // m_players.length;
      }
    }

    // the player name and other info
    let cardX, cardY, nameX, nameY, moneyX, moneyY, betX, betY, rectX, rectY, rectW, rectH;

    rectW = width/3 - 20;
    rectH = CARD_HEIGHT + TEXT_SIZE + TEXT_SIZE + 20;

    push();
    if (relativeSeatPos == 0 || relativeSeatPos == -1) {
      rectX = width/2-rectW/2;
      rectY = height-rectH;
      betX = width/2;
      betY = height - rectH;
    } else if (relativeSeatPos == 1) {
      rectX = 0;
      rectY = height*9/16;
      betX = rectW;
      betY = rectY + rectH/2;
    } else if (relativeSeatPos == 2) {
      rectX = 0;
      rectY = height*4/16;
      betX = rectW;
      betY = rectY + rectH/2;
    } else if (relativeSeatPos == 3) {
      rectX = width/2-rectW/2;
      rectY = 0;
      betX = width/2;
      betY = rectH + TEXT_SIZE;
    } else if (relativeSeatPos == 4) {
      rectX = width - rectW;
      rectY = height*4/16;
      betX = rectX - TEXT_SIZE;
      betY = rectY + rectH/2;
    } else if (relativeSeatPos == 5) {
      rectX = width - rectW;
      rectY = height*9/16;
      betX = rectX - TEXT_SIZE;
      betY = rectY + rectH/2;
    } 

    cardX = 10;
    cardY = 10;
    nameX = cardX;
    nameY = cardY + CARD_HEIGHT + TEXT_SIZE;
    moneyX = cardX;
    moneyY = nameY + TEXT_SIZE;

    translate(rectX, rectY);

    // grey rect under play info and black shadow rect.  The brown rect is drawn last 
    // before the pop()
    noStroke();
    if (this.dealer) fill(50, 101, 77);
    else             fill(100, 100, 100);
    rect(0, 0, rectW, rectH);
    strokeWeight(8);
    noFill();
    stroke(0);
    rect(0+2, 0+2, rectW-3, rectH-3);
    // stroke(205, 127, 50);
    // rect(0, 0, rectW, rectH);

    // player image
    let aname = this.name.toLowerCase();
    aname = aname.replace(/\s/g, '');
    if (m_playerImages[aname]) {
      image(m_playerImages[aname], rectW-IMAGE_SIZE, rectH-IMAGE_SIZE);
    }
  
    // each card
    for (let i = 0; i < this.cards.length; i++) {
      this.cards[i].x = cardX + i*(CARD_WIDTH/2);
      this.cards[i].y = cardY;
      this.cards[i].show();
      // caclulate the actual x,y (not relative to rectX,rectY) for when we want to select a card.
      this.cards[i].x += rectX;
      this.cards[i].y += rectY;
    }

    textSize(TEXT_SIZE);
    strokeWeight(2);
    if (this.selected) {
      stroke(255, 0, 0); fill(255, 0, 0);
    } else {
      stroke(255); fill(255);
    }
    // player name plus extra info
    let at = this.name;
    if (this.dealer) at += ' (Dlr)';
    // if (m_thisPlayer == this) at += ' (TP)';
    text(at, nameX, nameY);
    
    // Player money
    text('Stack: ' + this.money, moneyX, moneyY)

    if (this.folded) {
      stroke(0);
      line(0, 0, 0+rectW, 0+rectH);
      line(0, 0+rectH, 0+rectW, 0);
    }

    showChips(this.money, rectW-IMAGE_SIZE-2*m_chipImagesSmall[0].width, rectH-m_chipImagesSmall[0].height-5, m_chipImagesSmall);
    // showChips(this.money, 0, 0, m_chipImagesSmall);

    // Brown rectangle goes on top
    strokeWeight(8);
    noFill();
    stroke(205, 127, 50);
    rect(0, 0, rectW, rectH);

    
    pop();

    // The Bet is different for each position (it is not relative to the X,Y of th eupper left corner)
    // The bet
    stroke(255, 0, 0); fill(255, 0, 0);
    if (this.bet == maxBet) {
      stroke(0, 255, 0); fill(0, 255, 0);
    }
    let betAmount;
    if (this.bet == -1) {
      betAmount = '';
    } else {
      betAmount = this.bet;
    }
    text(betAmount, betX, betY);

    
    // if (m_debugThisPlayerAtBottomCheckbox) {
    //   if (m_debugThisPlayerAtBottomCheckbox.checked()) this.seatPos = savePos;
    // }

    return;

    // DELETE FROM  HERE ON DOWN

    // if (relativeSeatPos == 0 || relativeSeatPos == -1) {
    //   cardX = width * 0.33;
    //   cardY = height - TEXT_SIZE - TEXT_SIZE - CARD_HEIGHT;
    //   nameX = width * 0.33;
    //   // nameY = height - TEXT_SIZE;
    //   nameY = cardY + TEXT_SIZE + CARD_HEIGHT;
    //   moneyX = width * 0.33;
    //   // moneyY = height;
    //   moneyY = nameY + TEXT_SIZE;
    //   betX = width/2 - textWidth(this.bet)/2;
    //   betY = height - TEXT_SIZE - TEXT_SIZE - CARD_HEIGHT - 10;
    //   rectX = cardX-10;
    //   rectY = cardY-10;
    //   rectW = width - 2*(cardX-10);
    //   rectH = height - (cardY-10);
    // } else if (relativeSeatPos == 1) {
    //   cardX = 0
    //   cardY = height * 9/16;
    //   nameX = 0;
    //   nameY = cardY + CARD_HEIGHT + TEXT_SIZE;
    //   moneyX = 0;
    //   moneyY = nameY + TEXT_SIZE;
    //   // get the smaller dimension and make the table a circle
    //   let ww = (height < width ? height*0.5: width*0.5);
    //   betX = width/2 - ww/2 - textWidth(this.bet);
    //   betY = nameY;
    //   rectX = 0;
    //   rectY = cardY-10;
    //   rectW = betX - 10;
    //   rectH = CARD_HEIGHT + TEXT_SIZE + TEXT_SIZE + 20;
    // } else if (relativeSeatPos == 2) {
    //   cardX = 0
    //   cardY = height * 4/16;
    //   nameX = 0;
    //   nameY = cardY + CARD_HEIGHT + TEXT_SIZE;
    //   moneyX = 0;
    //   moneyY = nameY + TEXT_SIZE;
    //   // get the smaller dimension and make the table a circle
    //   let ww = (height < width ? height*0.5: width*0.5);
    //   betX = width/2 - ww/2 - textWidth(this.bet);
    //   betY = nameY;
    //   rectX = 0;
    //   rectY = cardY-10;
    //   rectW = betX - 10;
    //   rectH = CARD_HEIGHT + TEXT_SIZE + TEXT_SIZE + 20;
    // } else if (relativeSeatPos == 3) {
    //   cardX = width * 0.33;
    //   cardY = 10;
    //   nameX = width * 0.33;
    //   nameY = CARD_HEIGHT + TEXT_SIZE;
    //   moneyX = width * 0.33;
    //   moneyY = nameY + TEXT_SIZE;
    //   betX = width/2 - textWidth(this.bet)/2;
    //   betY = moneyY + 35;
    //   rectX = cardX-10;
    //   rectY = cardY-10;
    //   rectW = width - 2*(cardX-10);
    //   rectH = CARD_HEIGHT + TEXT_SIZE + TEXT_SIZE + 20;
    // } else if (relativeSeatPos == 4) {
    //   cardX = width - 6*CARD_WIDTH;
    //   cardY = height * 4/16;
    //   nameX = cardX;
    //   nameY = cardY + CARD_HEIGHT + TEXT_SIZE;
    //   moneyX = cardX;
    //   moneyY = nameY + TEXT_SIZE;
    //   // get the smaller dimension and make the table a circle
    //   let ww = (height < width ? height*0.5: width*0.5);
    //   betX = cardX-75;;
    //   betY = cardY + TEXT_SIZE;
    //   rectX = cardX-10;
    //   rectY = cardY-10;
    //   rectW = width - rectX;
    //   rectH = CARD_HEIGHT + TEXT_SIZE + TEXT_SIZE + 20;
    // } else if (relativeSeatPos == 5) {
    //   cardX = width - 6*CARD_WIDTH;
    //   cardY = height * 9/16;
    //   nameX = cardX;
    //   nameY = cardY + CARD_HEIGHT + TEXT_SIZE;
    //   moneyX = cardX;
    //   moneyY = nameY + TEXT_SIZE;
    //   // get the smaller dimension and make the table a circle
    //   let ww = (height < width ? height*0.5: width*0.5);
    //   betX = cardX-75;;
    //   betY = nameY - TEXT_SIZE;
    //   rectX = cardX-10;
    //   rectY = cardY-10;
    //   rectW = width - rectX;
    //   rectH = CARD_HEIGHT + TEXT_SIZE + TEXT_SIZE + 20;
    // }


    // // gery rect under play info
    // noStroke();
    // if (this.dealer) fill(50, 101, 77);
    // else             fill(100, 100, 100);
    // rect(rectX, rectY, rectW, rectH);
    // strokeWeight(8);
    // noFill();
    // stroke(0);
    // rect(rectX+2, rectY+2, rectW-3, rectH-3);
    // stroke(205, 127, 50);
    // rect(rectX, rectY, rectW, rectH);


    // // player image
    // let aname = this.name.toLowerCase();
    // if (m_playerImages[aname]) {
    //   image(m_playerImages[aname], rectX+rectW-IMAGE_SIZE, rectY+rectH-IMAGE_SIZE);
    // }
  
    // // each card
    // for (let i = 0; i < this.cards.length; i++) {
    //   this.cards[i].x = cardX + i*(CARD_WIDTH/2);
    //   this.cards[i].y = cardY;
    //   this.cards[i].show();
    // }

    // textSize(TEXT_SIZE);
    // strokeWeight(2);
    // if (this.selected) {
    //   stroke(255, 0, 0); fill(255, 0, 0);
    // } else {
    //   stroke(255); fill(255);
    // }
    // // player name plus extra info
    // let at = this.name;
    // if (this.dealer) at += ' (Dlr)';
    // if (m_thisPlayer == this) at += ' (TP)';
    // text(at, nameX, nameY);

    // // Player money
    // text('Stack: ' + this.money, moneyX, moneyY)

    // if (this.folded) {
    //   stroke(0);
    //   line(rectX, rectY, rectX+rectW, rectY+rectH);
    //   line(rectX, rectY+rectH, rectX+rectW, rectY);
    // }

    // // The Bet is different for each position (it is not relative to the X,Y of th eupper left corner)
    // // The bet
    // stroke(255, 0, 0); fill(255, 0, 0);
    // if (this.bet == maxBet) {
    //   stroke(0, 255, 0); fill(0, 255, 0);
    // }
    // let betAmount;
    // if (this.bet == -1) {
    //   betAmount = '';
    // } else {
    //   betAmount = this.bet;
    // }
    // text(betAmount, betX, betY);

    // if (m_debugThisPlayerAtBottomCheckbox) {
    //   if (m_debugThisPlayerAtBottomCheckbox.checked()) this.seatPos = savePos;
    // }
  }

  reset() {
    this.cards = [];
    this.folded = false;
    this.selected = false;
    this.bet = -1;
    // TODO should we set dealer to false
  }

  // card is a Card
  addCardDown(card) {
    card.visibleTo = this.seatPos;
    card.setFacedown();
    this.cards.push(card);
  }
  
  // card is a Card
  addCardUp(card) {
    card.visibleTo = -1;
    card.setFaceup();
    this.cards.push(card);
  }
  
  // card is a Card
  addCardHidden(card) {
    card.setFacedown();
    card.visibleTo = -1;
    this.cards.push(card);
  }

  // data is a Player object
  copyFromServerData(data) {
    this.socketId = data.socketId;
    this.seatPos = data.seatPos;
    this.name = data.name;
    this.cards = [];
    if (data.cards) {
      for (let c of data.cards) {
        let card = new Card();
        card.copyFromServerData(c);
        this.cards.push(card);
      }
    } else {
      this.cards = [];
    }
    this.selected = data.selected;
    this.dealer = data.dealer;
    this.folded = data.folded;
    this.bet = data.bet;
    this.money = data.money
  }

}