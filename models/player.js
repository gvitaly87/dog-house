module.exports = class Player {
  constructor(name, seat, color) {
    this.seat = seat;
    this.username = name;
    this.pawns = [];
    for (let i = 0; i < 4; i++) {
      this.pawns.push({
        color,
        position: -1,
      });
    }
  }
};
