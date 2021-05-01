// Assigns a seat to a player if the seat is taken generates a new seat
const getSeat = (seats, seatCount = 4) => {
  let random = Math.floor(Math.random() * seatCount);
  return seats[random].empty ? random : getSeat(seats);
};

module.exports = getSeat;
