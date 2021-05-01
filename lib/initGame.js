const Deck = require("../models/deck");
const dealCards = require("./dealCards");

/************* Creates a new deck and shuffles it ***********/
const newDeck = () => {
  let deck = new Deck();
  deck.shuffle();
  return deck;
};

/******** Deals the starting hand and sets playerToAct ******/
const initGame = (game) => {
  game.table.playerToAct = Math.floor(Math.random() * 4);
  game.deck = newDeck();
  dealCards(game, 5);
};

module.exports = initGame;
