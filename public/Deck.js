class Deck {
  constructor() {
    this.deck = [];  // Card objects
    this.shuffle();
  }

  shuffle() {
    this.reset();
    let deck = [];  // integer indexes into the m_unshuffledDeck
    // for (let c of m_deckUnshuffled) {
    //   deck.push(new Card(c.index, 0, 0));
    // }
    for (let i = 0; i < m_deckUnshuffled.length; i++) {
      deck.push(i);
      m_deckUnshuffled[i].reset();
    }

    let count = 0;
		while (deck.length > 0) {
			let index = floor(random(deck.length));
      this.deck.push(m_deckUnshuffled[deck[index]]);
      deck.splice(index, 1);
		}

  }

  // shuffles all the cards in the remaining deck, all the cards that were 
  // on the table and all the cards in folded player's hands
  shuffleUnused() {
    let deck = [];  // integer indexes into the m_unshuffledDeck

    // cards remaining in deck
    for (let i = 0; i < this.deck.length; i++) {
      deck.push(this.deck[i].index);
    }

    // cards on table
    for (let i = 0; i < m_table.cards.length; i++) {
      deck.push(m_table.cards[i].index);
    }
    m_table.cards = [];

    // cards in folded hands
    for (let p = 0; p < m_players.length; p++) {
      if (m_players[p].folded) {
        for (let i = m_players[p].cards.length-1; i >= 0; i--) {
          deck.push(m_players[p].cards[i].index);
        }
        m_players[p].cards = []
      }
    }

    // cards in the discard pile
    for (let i = 0; i < m_discards.length; i++) {
      deck.push(m_discards[i].index);
    }

    this.deck = [];
		while (deck.length > 0) {
			let index = floor(random(deck.length));
      this.deck.push(m_deckUnshuffled[deck[index]]);
      deck.splice(index, 1);
		}

    for (let i = 0; i < this.deck.length; i++) {
      this.deck[i].reset();
    }

  }

  // returns top card of the deck as Card
  dealCard() {
    let len = this.deck.length;
    if (len == 0) {
      m_messageP.style('color', '#FF0000');
      m_messageP.html('The deck is empty.  Better shuffle.')
      return undefined;
    }

    let cards = this.deck.splice(len-1, 1);
    return cards[0];
  }

  reset() {
    this.deck = [];
  }

  // data is a Deck object
  copyFromServerData(data) {
    if (data.deck) {
      this.deck = [];
      for (let c of data.deck) {
        let card = new Card();
        card.copyFromServerData(c);
        this.deck.push(card);
      }
    } else {
      this.deck = [];
    }

  }
}