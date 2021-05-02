module.exports = class Player {
  constructor(name, seat, color) {
    this.seat = seat;
    this.username = name;
    this.pawns = [];
    this.empty = false;
    for (let i = 0; i < 4; i++) {
      this.pawns.push({
        id: i,
        position: -1,
      });
    }
  }
};
