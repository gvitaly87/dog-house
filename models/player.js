module.exports = class Player {
  constructor(name, seat) {
    this.seat = seat;
    this.username = name;
    this.pawns = {};
  }
};
