const selectCard = (selectedCard) => {
  selectedCard.classList.toggle("selected");
  const cardValue = selectedCard.dataset.value;

  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    if (card !== selectedCard && card.classList.contains("selected")) {
      card.classList.remove("selected");
    }
  });
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
