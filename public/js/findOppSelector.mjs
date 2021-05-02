const findOppSelector = (playerSeat, oppSeat, totalPlayers) => {
  let adjustedSeat = 1 + oppSeat - playerSeat;
  if (adjustedSeat > totalPlayers) adjustedSeat -= totalPlayers;
  if (adjustedSeat < 1) adjustedSeat += totalPlayers;
  return adjustedSeat;
};

export default findOppSelector;
