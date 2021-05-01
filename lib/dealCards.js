/*********** Deals all players an X amount of cards ********/
const dealCards = (game, numOfCards) => {
  game.clients.forEach((player) => {
    player.hand = [];
    for (let i = 0; i < numOfCards; i++) {
      player.hand.push(game.deck.pop());
    }
  });
};

module.exports = dealCards;
