const selectCard = (card) => {
  card.classList.toggle("selected");
  const cardValue = card.dataset.value;
  console.log(cardValue);
};
const playerMove = () => {
  const game = document.querySelector(".game-board");
  const playerCards = document.querySelector(".player-cards");
  playerCards.addEventListener("click", (event) => {
    if (event.target.classList.contains("card")) {
      selectCard(event.target);
    }
  });
  game.addEventListener("click", (event) => {
    if (
      event.target.classList.contains("pawn") &&
      event.target.classList.contains("player1")
    ) {
      event.target.classList.toggle("selected");
    }
  });
};

export default playerMove;
