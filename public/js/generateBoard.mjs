const generateBoard = () => {
  const boardContainer = document.querySelector(".game-board");
  let boardHTML = "";
  for (let i = 0; i < 96; i++) {
    boardHTML += `<div class="board-section s${i}"></div>`;
  }
  for (let i = 1; i < 5; i++) {
    boardHTML += `<div class="player-name player${i}">Waiting for Player ${i}...</div>`;
    for (let j = 0; j < 4; j++) {
      boardHTML += `
      <div class="board-section h${i}${j}"></div>
      <div class="board-section p${i}${j}"></div>
      `;
    }
  }
  boardHTML += `
    <div class="player-cards" id="player-cards"></div>
    <div class="last-card"></div>
    `;
  boardContainer.innerHTML = boardHTML;
};

export default generateBoard;
