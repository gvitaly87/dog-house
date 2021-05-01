module.exports = class Game {
  constructor(id, numOfPlayers) {
    this.id = id;
    this.clients = [];
    this.hasStarted = false;
    this.table = new Table(numOfPlayers);
  }
};

class Table {
  constructor(numOfPlayers) {
    this.round = 0;
    this.gameLog = null;
    this.playerToAct = null;
    this.pawns = {};
    this.seats = [];
    for (let i = 0; i < numOfPlayers; i++) {
      this.seats.push({ empty: true });
    }
  }
}
