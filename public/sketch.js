// May need a shuffle button that shuffles all cards lfet in the deck but leaves the
// cards currently in player's hands and on the table alone.

var m_cardImages = [];      // images
var m_playerImages = [];
var m_cardBackImage;
var m_deckUnshuffled = [];  // Cards
var m_deck;                 // Deck
var m_discards = []         // Cards
var m_table;
var m_players = [];         // Players
var m_playersTemp = [];         // Players
var m_initialPlayer;        // Player
var m_thisPlayer = undefined; // for now, a Player
var m_mySocketId;             
var m_initialized = false;
var m_dealerNum = 0;          // dealer index into m_players
var m_currentPlayer = -1;     // for now, index into player array
const FACEDOWN = true;
const FACEUP = false;
const CARD_WIDTH = 60;
const IMAGE_SIZE = 100;
var   CARD_HEIGHT;
var m_initButton;            // one time init button
var m_nameInputButton        // one time player name text input
var dealerColor;
var m_newHandButton;         // dealer button
var m_newHandNonZeroButton;         // dealer button
var m_advanceCheckbox;
var m_dealDownButton; // dealer button
var m_dealUpButton;   // dealer button
var m_dealHiddenButton;   // dealer button
var m_dealDownToTableButton;
var m_dealUpToTableButton;
var m_nextRoundButton;       // dealer button
var m_shuffleUnused;         // dealer
var m_dealerPassButton       // dealer 
var m_advanceButton;         // player button
var m_turnAllFaceUpButton;   // player button 
var m_flipSelectedButton;    // player button
var m_discardSelectedButton; // player button
var m_foldButton;            // player button
var m_betButton;            // player button
var m_betInputButton;       // player text input
var m_takePotButton;
var m_takePartialPotButton;
var m_takePartialPotInputButton;
var m_debugThisPlayerFollowsDealerCheckbox;
var m_debugThisPlayerFollowsClickCheckbox;
var m_debugThisPlayerAtBottomCheckbox;
var m_debugShowDeckCheckbox;
var m_debugShowDiscardCheckbox;
var m_addToBuyInButton;            // player button
var m_addToBuyInInputButton;       // player text input
var m_messageP;
const TEXT_SIZE = 32;
const MAX_SEATS = 6;
var m_socket;
var m_resizeSlider;
var m_resizeSliderValue;
var m_volumeSlider;
var m_volumeSliderValue = 0.2;
var m_colorNum = 0;
var m_colors = ['#000000', '#FF0000', '#55AA55', '#0000FF'];
var m_oldMessage = "&nbsp";
var m_backImage;
var m_chipImages = [];
var m_chipImagesSmall = [];
const SND_SHUFFLE = 0, SND_BET01 = 1, SND_BET02 = 2, SND_TAKE_POT = 3, SND_FOLD = 4;
var m_sounds = [];
var m_soundCounter = 0;
var m_oldSoundCounter = m_soundCounter;
var m_soundIndex = 0;
var m_lastSelectedTableCardIndex = -1;  // an index into the m_table.cards array
var m_lastSelectedTableCardPos = [];
var m_didDragTableCard = false;
var m_specialEffect = null;
let m_confettoColor;


function preload() {
  let suits = ['clubs', 'diamonds', 'hearts', 'spades'];
  let pictures = ['jack', 'queen', 'king', 'ace'];
  for (let i = 0; i < suits.length; i++) {
    for (let j = 2; j <= 10; j++) {
      m_cardImages.push(loadImage('CardImages/' + j + '_of_' + suits[i] + '.png'));
    }
    for (let j = 0; j < pictures.length; j++) {
      m_cardImages.push(loadImage('CardImages/' + pictures[j] + '_of_' + suits[i] + '.png'));
    }
  }
  m_cardBackImage = loadImage('CardImages/cardBack.jpg')

  // felt background
  m_backImage = loadImage('CardImages/feltRed.jpg');

  // load player images
  m_playerImages['john'] = loadImage('CardImages/john.jpg');
  m_playerImages['ron'] = loadImage('CardImages/ron.jpg');
  m_playerImages['bob'] = loadImage('CardImages/bob.jpg');
  m_playerImages['daveb'] = loadImage('CardImages/daveB.jpg');
  m_playerImages['daveh'] = loadImage('CardImages/daveH.jpg');
  m_playerImages['flash'] = loadImage('CardImages/flash.jpg');

  // chip images
  m_chipImages.push(loadImage('CardImages/chipGreen.png'));
  m_chipImages.push(loadImage('CardImages/chipRed.png'));
  m_chipImages.push(loadImage('CardImages/chipBlue.png'));
  m_chipImages.push(loadImage('CardImages/chipWhite.png'));

  // sounds
  m_sounds.push(loadSound('CardImages/sound_shuffleCards.mp3'));
  m_sounds.push(loadSound('CardImages/sound_betChips01.mp3'));
  m_sounds.push(loadSound('CardImages/sound_betChips02.mp3'));
  m_sounds.push(loadSound('CardImages/sound_takePot.mp3'));
  m_sounds.push(loadSound('CardImages/sound_fold.mp3'));

  // initCardsAndImages();

}

function setup() {
  createCanvas(1200, 800);
  m_confettoColor = [color('#00aeef'), color('#ec008c'), color('#72c8b6')];

  // socket
  m_socket = io();

  // resize card images
  for (img of m_cardImages) {
    img.resize(CARD_WIDTH, 0);
  }
  CARD_HEIGHT = m_cardImages[0].height;
  m_cardBackImage.resize(CARD_WIDTH, CARD_HEIGHT);
  m_backImage.resize(width, height);

  // create the unshuffled deck.
  for (i = 0; i < m_cardImages.length; i++) {
    m_deckUnshuffled.push(new Card(i, 0, 0));
  }

  // resize the player images
  if (m_playerImages['john']) m_playerImages['john'].resize(IMAGE_SIZE,IMAGE_SIZE);
  if (m_playerImages['ron']) m_playerImages['ron'].resize(IMAGE_SIZE,IMAGE_SIZE);
  if (m_playerImages['bob']) m_playerImages['bob'].resize(IMAGE_SIZE,IMAGE_SIZE);
  if (m_playerImages['daveb']) m_playerImages['daveb'].resize(IMAGE_SIZE,IMAGE_SIZE);
  if (m_playerImages['daveh']) m_playerImages['daveh'].resize(IMAGE_SIZE,IMAGE_SIZE);
  if (m_playerImages['flash']) m_playerImages['flash'].resize(IMAGE_SIZE,IMAGE_SIZE);

  // Make some smaller chip images
  for (let i = 0; i < m_chipImages.length; i++) {
    m_chipImagesSmall[i] = createImage(25, 25);
    m_chipImagesSmall[i].copy(m_chipImages[i], 0, 0, m_chipImages[i].width, m_chipImages[i].height, 0, 0, m_chipImagesSmall[i].width, m_chipImagesSmall[i].height);
  }

  // create the table, which holds cards and money
  m_table = new Table();

  // create the deck we will deal from (when we are the dealer)
  m_deck = new Deck();

  dealerColor = color(255, 150, 150);

  // One time buttons
  m_initButton = createButton('Init: Enter Name');
  m_initButton.mousePressed(initPlayerToServer);
  m_nameInputButton = createInput();
  // m_resizeSliderValue = 1.0;
  // m_resizeSlider = createSlider(0.5, 1.5, m_resizeSliderValue, 0.1);
  createDiv();
  // m_nameInputButton.changed(initPlayerToServer);

  // buttons for all players, including dealer
  // m_betButton = createButton('Bet');
  // m_betButton.mousePressed(playerBet);
  // m_betInputButton = createInput();
  // m_betInputButton.changed(playerBet);
  let button = createButton('Bet 1');
  button.mousePressed(function(){
    betAmount(1);
  });
  button = createButton('Bet 2');
  button.mousePressed(function(){
    betAmount(2);
  });
  button = createButton('Bet 5');
  button.mousePressed(function(){
    betAmount(5);
  });
  button = createButton('Bet 10');
  button.mousePressed(function(){
    betAmount(10);
  });
  // button = createButton('Bet 25');
  // button.mousePressed(function(){
  //   betAmount(25);
  // });
  button = createButton('Call/Check');
  button.mousePressed(call);
  for (let i = 0; i < 3; i++) createSpan('&nbsp;');
  m_foldButton = createButton('Fold');
  m_foldButton.mousePressed(fold);

  for (let i = 0; i < 5; i++) createSpan('&nbsp;');
  createSpan('Size: ');
  m_resizeSliderValue = 1.0;
  m_resizeSlider = createSlider(0.5, 1.0, m_resizeSliderValue, 0.1);
  m_resizeSlider.input( () => resizeCanvas(1200 * m_resizeSlider.value(), 800 * m_resizeSlider.value()))
  createSpan('Volume: ');
  m_volumeSlider = createSlider(0.0, 1.0, m_volumeSliderValue, 0.1);
  m_volumeSlider.input( () => m_volumeSliderValue = m_volumeSlider.value());

  createDiv();
  m_turnAllFaceUpButton = createButton('Turn My Cards Face Up');
  m_turnAllFaceUpButton.mousePressed(turnAllFaceUp);
  m_flipSelectedButton = createButton('Flip Card(s)');
  m_flipSelectedButton.mousePressed(flipSelected);
  for (let i = 0; i < 3; i++) createSpan('&nbsp;');
  m_discardSelectedButton = createButton('Discard Card(s)');
  m_discardSelectedButton.mousePressed(discardSelected);
  // for (let i = 0; i < 12; i++) createSpan('&nbsp;');
  // let passButton = createButton("(Un)mark To Pass Card");
  // passButton.mousePressed(markToPass);
  for (let i = 0; i < 12; i++) createSpan('&nbsp;');
  m_advanceButton = createButton('Advance');
  m_advanceButton.style('background-color', color(255, 200, 200));
  m_advanceButton.mousePressed(advancePlayerCB);

  createDiv();
  m_takePotButton = createButton('Take Pot');
  m_takePotButton.mousePressed(takePot);
  m_takePartialPotButton = createButton('Take Partial Pot');
  m_takePartialPotButton.mousePressed(takePartialPot);
  m_takePartialPotInputButton = createInput();
  for (let i = 0; i < 12; i++) createSpan('&nbsp;');
  m_addToBuyInButton = createButton('Add To Buy-In');
  m_addToBuyInButton.mousePressed(addToBuyIn);
  m_addToBuyInInputButton = createInput();
  // m_takePartialPotInputButton.changed(takePartialPot);
  m_messageP = createDiv('Message here');
  // createP();

  ////////////////////////////////
  // buttons for the dealer only
  createDiv();
  m_newHandButton = createButton('New Hand');
  m_newHandButton.style('background-color', dealerColor);
  m_newHandButton.mousePressed(function(){
    newHand(true);
  });
  for (let i = 0; i < 5; i++) createSpan('&nbsp;');
  m_newHandNonZeroButton = createButton('New Hand Keep Pot');
  m_newHandNonZeroButton.style('background-color', dealerColor);
  m_newHandNonZeroButton.mousePressed(function(){
    newHand(false);
  });
  for (let i = 0; i < 5; i++) createSpan('&nbsp;');
  m_nextRoundButton = createButton("Next Round");
  m_nextRoundButton.style('background-color', dealerColor);
  m_nextRoundButton.mousePressed(nextRound);
  for (let i = 0; i < 5; i++) createSpan('&nbsp;');
  m_shuffleUnused = createButton('Shuffle Unused Cards');
  m_shuffleUnused.style('background-color', dealerColor);
  m_shuffleUnused.mousePressed(shuffleUnused);

  for (let i = 0; i < 5; i++) createSpan('&nbsp;');
  m_dealerPassButton = createButton("Pass Selected Cards");
  m_dealerPassButton.style('background-color', dealerColor);
  m_dealerPassButton.mousePressed(dealerPassCards);

  for (let i = 0; i < 5; i++) createSpan('&nbsp;');
  let discardTableButton = createButton("Discard Cards on Table");
  discardTableButton.style('background-color', dealerColor);
  discardTableButton.mousePressed(discardCardsOnTable);

  createDiv();

  m_advanceCheckbox = createCheckbox("Advance", true);
  m_advanceCheckbox.style('background-color', dealerColor);
  for (let i = 0; i < 3; i++) createSpan('&nbsp;');
  m_advanceCheckbox.style('display', 'inline');

  m_dealDownButton = createButton('Deal Down');
  m_dealDownButton.style('background-color', dealerColor);
  m_dealDownButton.mousePressed(dealDown);
  m_dealUpButton = createButton('Deal Up');
  m_dealUpButton.style('background-color', dealerColor);
  m_dealUpButton.mousePressed(dealUp);
  m_dealHiddenButton = createButton('Deal Hidden');
  m_dealHiddenButton.style('background-color', dealerColor);
  m_dealHiddenButton.mousePressed(dealHidden);
  
  for (let i = 0; i < 5; i++) createSpan('&nbsp;');
  let btn = createButton('Deal Down All');
  btn.style('background-color', dealerColor);
  btn.mousePressed(dealDownAll);
  btn = createButton('Deal Up All');
  btn.style('background-color', dealerColor);
  btn.mousePressed(dealUpAll);
  btn = createButton('Deal Hidden All');
  btn.style('background-color', dealerColor);
  btn.mousePressed(dealHiddenAll);

  for (let i = 0; i < 5; i++) createSpan('&nbsp;');
  m_dealDownToTableButton = createButton('Deal Down to Table');
  m_dealDownToTableButton.style('background-color', dealerColor);
  m_dealDownToTableButton.mousePressed(dealDownToTable);
  m_dealUpToTableButton = createButton('Deal Up to Table');
  m_dealUpToTableButton.style('background-color', dealerColor);
  m_dealUpToTableButton.mousePressed(dealUpToTable);


  // set a callback to emit all the players 
  // setInterval(update, 500);

  // m_debugThisPlayerFollowsDealerCheckbox = createCheckbox("Debug_ThisPlayerFollowDealer", false);
  // m_debugThisPlayerFollowsClickCheckbox = createCheckbox("Debug_ThisPlayerFollowClick", true);
  m_debugThisPlayerAtBottomCheckbox = createCheckbox("Debug_ThisPlayerAtBottom", true);
  m_debugThisPlayerAtBottomCheckbox.hide();
  m_debugShowDeckCheckbox = createCheckbox("Show Deck", false);
  m_debugShowDeckCheckbox.hide();
  m_debugShowDiscardCheckbox = createCheckbox("Show Discard", false);
  m_debugShowDiscardCheckbox.hide();

  // m_messageP = createP('Message here');

  // By the time this gets called, we should have our m_socket.id and this m_players[0].socketId
  // data: a single Player, and it should be ourselves
  m_socket.on('initPlayer', function(data) {
    console.log('initPlayer message: We got ' , data);
    // let player = m_players.find(player => player.socketId === data.socketId);
    // Only the player who sent the start message to the server wants to precess
    // th initPlayer message
    if (m_mySocketId === data.socketId) {
      console.log('initPlayer message: found player');
      m_initialPlayer.copyFromServerData(data);
      m_players.push(m_initialPlayer);
      m_initialized = true;
      m_initButton.hide();
      m_nameInputButton.hide();
      // m_resizeSlider.hide();

    } else {
      console.log('initPlayer message: This message intended for another player');
    }

  });

  // data: object containing a Player array and a Table
  m_socket.on('heartbeat', function(data) {
    if (!m_initialPlayer) return;
    console.log('heartbeat message: We got ' , data);
    createPlayersFromServerData(data.players);
    createTableFromServerData(data.table);
    createDeckFromServerData(data.deck);
    // Note I wasn't able to pass in m_discards into the function here and fill it in 
    // using the function argument.  I had to directly specify m_discards in the function.
    // This is probably because I keep changing what m_discards is.
    // createCardArrayFromServerData(data.discards, m_discards);
    createCardArrayFromServerData(data.discards);
    setMessageFromServerData(data.message);
    checkSound(data.soundCounter, data.soundIndex);
  });

}  // setup

function checkSound(counter, index) {
  // console.log('checkSound ' + counter + ' ' + index);
  if (counter != m_oldSoundCounter) {
    // console.log('checkSound playing ' + counter + ' ' + index);
    if (index >= 0 && index < m_sounds.length) {
      m_sounds[index].setVolume(m_volumeSliderValue);
      m_sounds[index].play();
    }
  }
  m_oldSoundCounter = counter;
  m_soundCounter = counter;
}

// creates an Effect.  Should really return it, but it's being assigned to a global
function createSpecialEffect() {
  m_specialEffect = new HeartImages(createVector(width/2, height/2-100), 240);
  return;

  const rd = random();
  if      (rd < 0.20) m_specialEffect = new EffectFireworks(300);
  else if (rd < 0.40) m_specialEffect = new EffectConfetti(100, 360);
  else if (rd < 0.60) m_specialEffect = new EffectBouncers(20, 300);
  else if (rd < 0.80) m_specialEffect = new EffectStreams(createVector(width/2, height/2), 360);
  else                m_specialEffect = new EffectCoins(createVector(width/2, height/2), 360);

}

function setMessageFromServerData(data) {
  // m_messageP.style('background-color', 'FF0000');
  if (m_oldMessage != data) {
    if (data.includes("just took the pot of") && m_oldMessage.length > 5 && m_specialEffect==null) {
      createSpecialEffect();
    }
    m_oldMessage = data;
    m_colorNum++;
    if (m_colorNum >= m_colors.length) m_colorNum = 0;
  }
  m_messageP.style('color', m_colors[m_colorNum]);
  m_messageP.html(data);
}

// data: Player array
function createPlayersFromServerData(data) {
  let players = [];
  m_playersTemp = []
  for (p of data) {
    let player = new Player(p.seatPos, p.name);
    // console.log('heartbeat message: p.seatPos = ' + p.seatPos);
    // console.log('heartbeat message: p.cardY = ' + p.cardY);
    player.copyFromServerData(p);
    m_playersTemp.push(player);
    // console.log('heartbeat message: player.socketId = ' + player.socketId);
    // console.log('heartbeat message: player.seatPos = ' + player.seatPos);
    // console.log('heartbeat message: player.cardY = ' + player.cardY);
  }
  // sort the array by seatPos, so advancing and changing dealer (next hand) work properlu
  // javascript sort converts to strings first, so returning a.seatPos - b.seatPos correctly sorts numbers
  // m_playersTemp.sort((a, b) => {return a.seatPos > b.seatPos});
  m_playersTemp.sort((a, b) => {return a.seatPos - b.seatPos});
  m_players = m_playersTemp;

}

// to immediatelly send to the server (and have an interval function) handle it.
// data: a Table
function createTableFromServerData(data) {
  if (!data) return;
  m_table.copyFromServerData(data);
}

function createDeckFromServerData(data) {
  if (!data) return;
  m_deck.copyFromServerData(data);
}

// function createCardArrayFromServerData(data, deck) {
function createCardArrayFromServerData(data) {
  // console.log('discards = ' + data);
  if (!data) return;

  m_discards = [];
  for (let c of data) {
    let card = new Card();
    card.copyFromServerData(c);
    m_discards.push(card);
  }
}

// emit all the players and the table to the server
function update() {
  if (m_initialized) {
    let msg = m_messageP.html();
    // console.log('msg = ' + msg)
    let data = {
      players: m_players,
      table: m_table,
      deck: m_deck,
      discards: m_discards,
      message: msg,
      soundCounter: m_soundCounter,
      soundIndex: m_soundIndex
    };
    m_socket.emit('update', data);
  }
}

function draw() {
  // let scl = m_resizeSlider.value();
  // if (scl != m_resizeSliderValue) {
  //   m_resizeSliderValue = scl;
  //   resizeCanvas(1200 * scl, 800 * scl);
  // }
  // scale(scl);

  // The m_socket doesn't get an actual ID until after we are out of setup();
  // Hopefully by the time we receive our first message from the socket, we
  // have executed the lie of code below
  // m_players[0].socketId = '/#' + m_socket.id;
  m_mySocketId = '/#' + m_socket.id;

  // background(81, 4, 0);
  image(m_backImage, 0, 0, width, height);

  // 1) Create m_players from the latest socket message
  if (m_players.length > 0) setGlobalsFromPlayerInfo();

  if (m_table) m_table.show();

  // Figure out the max bet.  It gets passed into player.show() to determine color of bet
  let maxBet = -1;
  for (p of m_players) {
    if (p.folded == false && p.bet >= maxBet) {
      maxBet = p.bet;
    }
  }

  // Figure out the maximum number of cards marked to pass.
  let maxCardsSelected = -1;
  let allSame = true;
  for (p of m_players) {
    if (p.folded == false) {
      let nc = 0;
      for (let c of p.cards) {
        if (c.selected) nc++;
      }
      if (nc != maxCardsSelected && maxCardsSelected != -1) allSame = false;
      if (nc > maxCardsSelected) maxCardsSelected = nc;
   }
  }

  if (allSame) m_dealerPassButton.style('background-color', dealerColor);
  else         m_dealerPassButton.style('background-color', color(255, 0, 0));

  for (p of m_players) {
    p.show(maxBet, maxCardsSelected);
  }

  if (m_specialEffect) {
    let finished = m_specialEffect.show();
    if (finished) m_specialEffect = null;
  }

  // if (m_table) m_table.show();

  if (m_debugShowDiscardCheckbox?.checked()) showDeck(m_discards, 150);
  if (m_debugShowDeckCheckbox?.checked()) showDeck(m_deck.deck, 150);
}

function setGlobalsFromPlayerInfo() {
  // 2) Set m_dealerNum (player.dealer), m_currentPlayer (player.selected), 
  //    Note m_thisPlayer does not have to be reset because m_players[0] never is remade
  // console.log('m_players.length = ' + m_players.length);
  // console.log('m_players[0].socketId = ' + m_players[0].socketId);
  // console.log('m_socket.id = ' + m_socket.id);
  
  
  m_thisPlayer = m_players.find(plr => plr.socketId === m_mySocketId);
  if (!m_thisPlayer) {
    console.log('Cannot find myself. m_mySocketId = ' + m_mySocketId);
  }

  // let dlr = m_players.find(dlr => dlr.dealer === true);
  m_dealerNum = -1;
  for (let i = 0; i < m_players.length; i++) {
    if (m_players[i].dealer == true) m_dealerNum = i;
  }
  if (m_dealerNum == -1) {
    // console.log('Cannot find the dealer');
    // m_dealerNum = 0;
    // m_players[0].dealer = true;
  }

  // let sel = m_players.find(sel => sel.selected === true);
  m_currentPlayer = -1
  for (let i = 0; i < m_players.length; i++) {
    if (m_players[i].selected == true) m_currentPlayer = i;
  }
  if (m_currentPlayer == -1) {
    console.log('Cannot find the selected person');
    m_currentPlayer = 0;
    m_players[0].selected = true;
  }
}

// card[], integer Y value
function showDeck(cardArray, initialY) {
  // console.log('showDeck ' + cardArray.length);
  let ix = 0, iy = initialY;
  for (let i = 0; i < cardArray.length; i++) {
    if (i > 0 && i%13 == 0) {
      ix = 0;
      iy += m_cardImages[0].height+ 10;
    }
    ix += m_cardImages[0].width + 10;
    cardArray[i].x = ix;
    cardArray[i].y = iy;
    cardArray[i].setFaceup();
    cardArray[i].show();
  }

}

function initPlayerToServer() {
  if (m_nameInputButton.value().length <= 0) {
    // m_messageP.style('color', '#000000');
    m_messageP.html("Enter a real name, buddy");
    return;
  }
  console.log("INITPLAYER");
  m_initialPlayer = new Player(-1, m_nameInputButton.value());
  // m_initialPlayer.dealer = true;
  m_initialPlayer.socketId = '/#' + m_socket.id; 
  m_thisPlayer = m_initialPlayer;
  m_socket.emit('start', m_initialPlayer);
}

function setSound(index) {
  m_soundCounter++;
  m_soundIndex = index;
}

function newHand(potMustBeZero) {
  // if the pot must be zero to go to new hand, and it isn't, just return
  if (potMustBeZero && m_table.pot > 0) {
    // m_messageP.style('color', '#00FF00');
    m_messageP.html('The pot is non-zero.  Someone must collect it before going to the next hand.');
    update();
    return;
  }

  // If there any bets on the table, you can't start a new hand
  for (p of m_players) {
    if (p.bet > 0) {
      // m_messageP.style('color', '#00FF00');
      m_messageP.html('There are bets on the table.  Someone must collect them before going to the next hand.');
      update();
      return;
    }
  }
  
  m_deck.shuffle();
  for (p of m_players) {
    p.reset();
  }
  for (c of m_deckUnshuffled) {
    c.reset();
  }
  m_table.reset(potMustBeZero);
  m_discards = [];

  // turn off old dealer and make new dealer
  if (m_players[m_dealerNum]) m_players[m_dealerNum].dealer = false;
  m_dealerNum++;
  if (m_dealerNum >= m_players.length) m_dealerNum = 0;
  m_players[m_dealerNum].dealer = true;

  // turn off old current player and make new current player
  // m_players[m_currentPlayer].selected = false;  // this is done in player.reset()
  m_currentPlayer = m_dealerNum + 1;
  if (m_currentPlayer >= m_players.length) m_currentPlayer = 0;
  m_players[m_currentPlayer].selected = true;

  if (m_debugThisPlayerFollowsDealerCheckbox) {
    if (m_debugThisPlayerFollowsDealerCheckbox.checked()) m_thisPlayer = m_players[m_dealerNum];
  }

  // set a sound to play
  setSound(SND_SHUFFLE);
  
  update();
}

function dealDown() {
  let card = m_deck.dealCard();
  m_players[m_currentPlayer].addCardDown(card);
  if (m_advanceCheckbox.checked()) {
    advancePlayer();
  } 
  update();
}

function dealUp() {
  let card = m_deck.dealCard();
  m_players[m_currentPlayer].addCardUp(card);
  if (m_advanceCheckbox.checked()) {
    advancePlayer();
  } 
  update();
}

function dealHidden() {
  let card = m_deck.dealCard();
  m_players[m_currentPlayer].addCardHidden(card);
  if (m_advanceCheckbox.checked()) {
    advancePlayer();
  } 
  update();
}

function dealUpToTable() {
  let card = m_deck.dealCard();
  m_table.addCardUp(card);
  update();
}

function dealDownToTable() {
  let card = m_deck.dealCard();
  m_table.addCardHidden(card);
  update();
}

function dealDownAll() {
  for (let i = 0; i < m_players.length; i++) {
    let plrNum = (m_currentPlayer+i) % m_players.length;
    if (m_players[plrNum].folded == false) {
      let card = m_deck.dealCard();
      m_players[plrNum].addCardDown(card);
    }
  }
  update();
}
function dealUpAll() {
  for (let i = 0; i < m_players.length; i++) {
    let plrNum = (m_currentPlayer+i) % m_players.length;
    if (m_players[plrNum].folded == false) {
      let card = m_deck.dealCard();
      m_players[plrNum].addCardUp(card);
    }
  }
  update();
}
function dealHiddenAll() {
  for (let i = 0; i < m_players.length; i++) {
    let plrNum = (m_currentPlayer+i) % m_players.length;
    if (m_players[plrNum].folded == false) {
      let card = m_deck.dealCard();
      m_players[plrNum].addCardHidden(card);
    }
  }
  update();
}

function nextRound() {
  for (p of m_players) {
    // don't add in any -1 indicating no bet, not even a check
    if (p.bet > 0) {
      m_table.pot += p.bet;
      setSound(SND_BET02)
    }
    p.bet = -1;
  }
  update();
}

function shuffleUnused() {
  m_deck.shuffleUnused();
}

function dealerPassCards() {
  let unfolded = [];
  for (let p of m_players) {
    if (p.folded == false) unfolded.push(p);
  }

  for (i = 0; i < unfolded.length; i++) {
    let nextIdx = i + 1;
    if (nextIdx >= unfolded.length) nextIdx = 0;
    for (let c = unfolded[i].cards.length - 1; c >= 0; c--) {
      if (unfolded[i].cards[c].selected) {
         let cards = unfolded[i].cards.splice(c, 1);
         cards[0].selected = false;
         if (cards[0].visibleTo != -1) cards[0].visibleTo = unfolded[nextIdx].seatPos;
         unfolded[nextIdx].cards.push(cards[0]);
      }
    }
  }

  update();

}

function discardCardsOnTable() {
  m_discards = m_discards.concat(m_table.cards);
  m_table.cards = [];
  update();
}

function advancePlayerCB() {
  advancePlayer();
  update();
}

function advancePlayer() {
  m_players[m_currentPlayer].selected = false;
  // only try this so many times, because if everyone folds we could end up
  // in an infinite loop
  for (let i = 0; i < m_players.length; i++) {
    m_currentPlayer++;
    if (m_currentPlayer >= m_players.length) m_currentPlayer = 0;
    if (m_players[m_currentPlayer].folded == false) {
      m_players[m_currentPlayer].selected = true;
      break;
    }
  }
}

function turnAllFaceUp() {
  // Useful for debugging
  // for (c of m_players[m_currentPlayer].cards) {
  for (c of m_thisPlayer.cards) {
    c.setFaceup();
  }
  update();
}

function turnAllFaceDown() {
  // Useful for debugging
  // for (c of m_players[m_currentPlayer].cards) {
  for (c of m_thisPlayer.cards) {
    c.setFacedown();
  }
  update();
}

// A player can have either one of his own cards selected or a
// table card selectd.  he can't have both, so we can loop thru
// both sets of cards and just flip the selected one
function flipSelected() {
  let lfound = false;
  for (c of m_thisPlayer.cards) {
    if (c.selected) {
      lfound = true;
      c.flipCard(m_thisPlayer);
    }
  }
  for (c of m_table.cards) {
    if (c.selected) {
      lfound = true;
      c.flipCard(null);
    }
  }

  unselectedAll(2);
  if (lfound) update();
}

function discardSelected() {
  for (let i = m_thisPlayer.cards.length-1; i >= 0; i--) {
    if (m_thisPlayer.cards[i].selected) {
      m_thisPlayer.cards[i].selected = false;
      let cds = m_thisPlayer.cards.splice(i, 1);
      m_discards.push(cds[0]);
    }
  }
  for (let i = m_table.cards.length-1; i >= 0; i--) {
    if (m_table.cards[i].selected) {
      m_table.cards[i].selected = false;
      let cds = m_table.cards.splice(i, 1);
      m_discards.push(cds[0]);
    }
  }

  unselectedAll(2);
  update();
}

// NOTE: This function does not call update.
// which: 0 = player  1 = table  2 = both
function unselectedAll(which) {
  if (which == 0 || which == 2) {
    for (let i = m_thisPlayer.cards.length - 1; i >= 0; i--) {
      m_thisPlayer.cards[i].selected = false;
    }
  }
  if (which == 1 || which == 2) {
    for (let i = m_table.cards.length - 1; i >= 0; i--) {
      m_table.cards[i].selected = false;
    }
  }
}

// function markToPass() {
//   let didMark = false;
//   for (c of m_thisPlayer.cards) {
//     if (c.selected) {
//       c.selected = false;
//       c.toPass = !c.toPass;
//       didMark = true;
//     }
//   }
//   if (didMark) update();
// }

function fold() {
  m_thisPlayer.folded = true;
  // note facedown cards set visibleTo this player will not show their backs,
  // but other players already see them as face down
  turnAllFaceDown();

  // if the current player folds, we must advance the current player
  if (m_thisPlayer.selected) advancePlayer();
  setSound(SND_FOLD);
  update();
}

function playerBet() {
  let bet = Number(m_betInputButton.value());
  // if bet is invalid, just return.  Don't clear the input button
  // as an indicator the player of a bad bet
  if (bet < 0 || bet > m_thisPlayer.money) {
    // m_messageP.style('color', '#FF0000');
    m_messageP.html('Invalid bet.  What are you trying to pull?');
    update();
    return;
  }
  // If this is the first bet for this player, account for the fact
  // the the haven't-bet-yet-bet amount is -1;
  if (m_thisPlayer.bet == -1) m_thisPlayer.bet = 0;
  m_thisPlayer.bet += bet;
  m_thisPlayer.money -= bet;
  m_betInputButton.value('');

  // set a sound to play
  if (random() < 0.5) setSound(SND_BET01);
  else                setSound(SND_BET02);

  update();
}

function betAmount(amt) {
  // let currentBet = 0;
  // if (!m_thisPlayer.bet == -1) {
  //   currentBet = m_thisPlayer.bet;
  // }
  if (amt < m_thisPlayer.money) {
    if (m_thisPlayer.bet == -1) m_thisPlayer.bet = 0;
    m_thisPlayer.money -= amt;
    m_thisPlayer.bet += amt;
  } else {
    // m_messageP.style('color', '#FF0000');
    m_messageP.html('Invalid bet.  What are you trying to pull?');
    update();
  }

  // set a sound to play
  if (random() < 0.5) setSound(SND_BET01);
  else                setSound(SND_BET02);

  update();
}

function call() {
  let currentMaxBet = 0;
  for (p of m_players) {
    if (p.bet > currentMaxBet) {
      currentMaxBet = p.bet;
    }
  }
  let bet;
  if (m_thisPlayer.bet == -1) bet = currentMaxBet;
  else                        bet = currentMaxBet - m_thisPlayer.bet;
  betAmount(bet);
}

function takePot() {
  let pot = 0;
  for (p of m_players) {
    if (p.bet > 0) {
      pot += p.bet;
      p.bet = -1;
    }
  }
  pot += m_table.pot;
  m_thisPlayer.money += pot;
  m_table.pot = 0;
  m_messageP.html(m_thisPlayer.name + ' just took the pot of ' + pot);

  // set a sound to play
  setSound(SND_TAKE_POT);
  
  update();
}

function takePartialPot() {
  let amount = Number(m_takePartialPotInputButton.value());
  if (isNaN(amount)) {
    m_messageP.html(m_thisPlayer.name + ' ' + amount + ' is not even a number, dude.');
    update();
    return;
  }
  if (m_table.pot >= amount) {
    m_table.pot -= amount;
    if (m_thisPlayer.bet == -1) m_thisPlayer.bet = 0;
    m_thisPlayer.money += (amount + m_thisPlayer.bet);
    m_thisPlayer.bet = -1;
    m_takePartialPotInputButton.value('');
    m_messageP.html(m_thisPlayer.name + ' just took ' + amount + ' from the pot');

    // set a sound to play
    setSound(SND_TAKE_POT);
  
    update();
  }
}

function addToBuyIn() {
  let amount = Number(m_addToBuyInInputButton.value());
  if (isNaN(amount)) {
    m_messageP.html(m_thisPlayer.name + ' ' + amount + ' is not even a number, dude.');
    update();
    return;
  }
  if (amount <= 0) {
    // m_messageP.style('color', '#000000');
    m_messageP.html('You can only add positive values');
    update();
  } else {
    m_thisPlayer.money += amount;
    m_addToBuyInInputButton.value('');
    // m_messageP.style('color', '#ff0000');
    m_messageP.html(m_thisPlayer.name + ' added ' + amount + ' to their stake.');

    // set a sound to play
    setSound(SND_TAKE_POT);
  
    update();
  }

}
function mousePressed() {
  if (!m_thisPlayer) return;

  if (m_debugThisPlayerFollowsClickCheckbox) {
    if (m_debugThisPlayerFollowsClickCheckbox.checked()) {
      // console.log()
      for (let i = 0; i < m_players.length; i++) {
        // console.log(m_players[i].nameY+ ' ' + m_players[i].cardX)
        if (mouseY <= m_players[i].nameY && mouseY >= m_players[i].nameY-TEXT_SIZE) {
          if (mouseX >= m_players[i].cardX && mouseX <= m_players[i].cardX+50) {
            m_thisPlayer = m_players[i];
          }
        }
      }
    }
  }

  let lfoundCard = false;

  // Check all the player's cards.
  for (let i = 0; i < m_thisPlayer.cards.length; i++) {
    // this ensures only 1 card can be selected at a time
    // m_thisPlayer.cards[i].selected = false;
    let cardXStart = m_thisPlayer.cards[i].x;
    let cardXEnd = cardXStart + (CARD_WIDTH/2);
    if (i == m_thisPlayer.cards.length-1) cardXEnd += (CARD_WIDTH/2);
    let cardYStart = m_thisPlayer.cards[i].y;
    let cardYEnd = cardYStart + CARD_HEIGHT;
    if ( (mouseX >= cardXStart) && (mouseX <= cardXEnd) && (mouseY >= cardYStart) && (mouseY <= cardYEnd)) {
      m_thisPlayer.cards[i].selected = !m_thisPlayer.cards[i].selected;
      // m_thisPlayer.cards[i].selected = true;
      lfoundCard = true;
    }
  }

  if (lfoundCard) unselectedAll(1);

  let lfoundTableCard = false;

  // Check all the table's cards
  for (let i = 0; i < m_table.cards.length; i++) {
    // this ensures only 1 card can be selected at a time
    // m_table.cards[i].selected = false;
    let cardXStart = m_table.cards[i].x;
    // let cardXEnd = cardXStart + (CARD_WIDTH/2);
    let cardXEnd = cardXStart + (CARD_WIDTH);
    let cardYStart = m_table.cards[i].y;
    let cardYEnd = cardYStart + CARD_HEIGHT;
    // TODO allow a wider click on the last card of each row of the table's cards
    // if (i == m_thisPlayer.cards.length-1) cardEnd += (CARD_WIDTH/2);
    if ( (mouseX >= cardXStart) && (mouseX <= cardXEnd) && (mouseY >= cardYStart) && (mouseY <= cardYEnd)) {
      m_table.cards[i].selected = !m_table.cards[i].selected;
      // m_table.cards[i].selected = true;
      lfoundTableCard = true;
      if (m_table.cards[i].selected) {
        m_lastSelectedTableCardIndex = i;
        m_lastSelectedTableCardPos[0] = m_table.cards[i].x;
        m_lastSelectedTableCardPos[1] = m_table.cards[i].y;
          }
    }
  }

  if (lfoundTableCard) unselectedAll(0);

  if (lfoundCard || lfoundTableCard) update();

}

function mouseDragged() {
  if (m_lastSelectedTableCardIndex != -1) {
    m_lastSelectedTableCardPos[0] = mouseX;
    m_lastSelectedTableCardPos[1] = mouseY;
    m_didDragTableCard = true;
    // console.log('lSTC = ' + mouseX + ' '+  mouseY)
 }

}

function mouseReleased() {
  // If we didn't drag the card at all, we just want to select it, so 
  // nothing more needs to be done.
  if (!m_didDragTableCard) {
    m_lastSelectedTableCardIndex = -1;
    return;
  }

  // Calculate the table position closest to the card
  if (m_lastSelectedTableCardIndex != -1) {
    // look thru all the position and find the closest one
    let closestPosition = -1;
    let closestDistance = Infinity;
    for (let i = 0; i < m_table.cardLocations.length; i++) {
      let d = dist(mouseX, mouseY, m_table.cardLocations[i][0], m_table.cardLocations[i][1]);
      if (d < closestDistance) {
        closestDistance = d;
        closestPosition = i;
      }
    }
    if (closestPosition >= 0 && closestPosition <= 11) {
      m_table.cards[m_lastSelectedTableCardIndex].cardPosition = closestPosition;
    } else {
      m_table.cards[m_lastSelectedTableCardIndex].cardPosition = 0;
    }
    m_table.cards[m_lastSelectedTableCardIndex].selected = false;
    m_lastSelectedTableCardIndex = -1;
    m_didDragTableCard = false;
    // console.log('putting card at position ', closestPosition)
    update();
  }
}


function showChips(amt, baseX, baseY, chipImages) {
  let chipValues = [25, 5, 2, 1];
  let size = chipImages[0].width;
  for (let i = 0; i < chipValues.length; i++) {
    let chipNum = 0;
    while (amt >= chipValues[i]) {
      image(chipImages[i], baseX - 2*size + i*size, baseY - chipNum*5, chipImages[i].width, chipImages[i].height);
      amt -= chipValues[i];
      chipNum++;
    }
  }
}

function initCardsAndImages() {
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/2_of_clubs.png?v=1715726380098'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/2_of_spades.png?v=1715727444968'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/2_of_diamonds.png?v=1715727445593'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/2_of_hearts.png?v=1715727445850'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/3_of_clubs.png?v=1715727522758'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/3_of_diamonds.png?v=1715727523124'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/3_of_hearts.png?v=1715727523351'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/3_of_spades.png?v=1715727523610'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/4_of_clubs.png?v=1715727523874'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/4_of_diamonds.png?v=1715727524117'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/4_of_hearts.png?v=1715727524320'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/4_of_spades.png?v=1715727524556'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/5_of_clubs.png?v=1715727524836'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/5_of_diamonds.png?v=1715727525076'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/5_of_hearts.png?v=1715727525317'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/5_of_spades.png?v=1715727525892'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/6_of_clubs.png?v=1715727526139'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/6_of_diamonds.png?v=1715727526524'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/6_of_hearts.png?v=1715727526831'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/6_of_spades.png?v=1715727527055'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/7_of_clubs.png?v=1715727527347'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/7_of_diamonds.png?v=1715727527645'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/7_of_hearts.png?v=1715727527889'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/7_of_spades.png?v=1715727528152'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/8_of_clubs.png?v=1715727528439'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/8_of_diamonds.png?v=1715727528656'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/8_of_hearts.png?v=1715727528873'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/8_of_spades.png?v=1715727529117'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/9_of_clubs.png?v=1715727529395'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/9_of_diamonds.png?v=1715727529598'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/9_of_hearts.png?v=1715727529859'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/9_of_spades.png?v=1715727530074'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/10_of_clubs.png?v=1715727530315'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/10_of_diamonds.png?v=1715727530584'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/10_of_hearts.png?v=1715727530806'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/10_of_spades.png?v=1715727522442'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/jack_of_clubs.png?v=1715727727694'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/jack_of_diamonds.png?v=1715727727940'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/jack_of_hearts.png?v=1715727728163'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/jack_of_spades.png?v=1715727728407'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/queen_of_clubs.png?v=1715727729725'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/queen_of_diamonds.png?v=1715727730083'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/queen_of_hearts.png?v=1715727730320'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/queen_of_spades.png?v=1715727730539'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/king_of_clubs.png?v=1715727728699'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/king_of_diamonds.png?v=1715727728946'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/king_of_hearts.png?v=1715727729210'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/king_of_spades.png?v=1715727729461'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/ace_of_clubs.png?v=1715727746925'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/ace_of_diamonds.png?v=1715727747160'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/ace_of_hearts.png?v=1715727747411'));
  m_cardImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/ace_of_spades.png?v=1715727746645'));
  m_cardBackImage = loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/cardBack.jpg?v=1715728947734');

  m_backImage = loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/feltRed.jpg?v=1716679502504');

  m_chipImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/chipGreen.png?v=1716683051375'));
  m_chipImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/chipRed.png?v=1716683051236'));
  m_chipImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/chipBlue.png?v=1716683050859'));
  m_chipImages.push(loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/chipWhite.png?v=1716683051063'));

  m_playerImages['john']  = loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/john.jpg?v=1716489395333');
  m_playerImages['ron']   = loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/ron.jpg?v=1716489398979');
  m_playerImages['bob']   = loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/bob.jpg?v=1716489379655');
  m_playerImages['daveb'] = loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/daveB.jpg?v=1716489383099');
  m_playerImages['daveh'] = loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/daveH.jpg?v=1716489386211');
  m_playerImages['flash'] = loadImage('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/flash.jpg?v=1716489389802');

  m_sounds.push(loadSound('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/sound_shuffleCards.mp3?v=1716738144453'));
  m_sounds.push(loadSound('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/sound_betChips01.mp3?v=1716738143988'));
  m_sounds.push(loadSound('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/sound_betChips02.mp3?v=1716738144210'));
  m_sounds.push(loadSound('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/sound_takePot.mp3?v=1716738143743'));
  m_sounds.push(loadSound('https://cdn.glitch.global/dda01c5f-74db-47db-872d-a734060aea61/sound_fold.mp3?v=1716822098082'));
}