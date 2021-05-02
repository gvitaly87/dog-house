import copyGameID from "/js/copyGameID.mjs";
import insertCard from "/js/insertCard.mjs";
import generateBoard from "/js/generateBoard.mjs";
import findOppSelector from "/js/findOppSelector.mjs";

// Client Global Variable
let clientId = null;
let gameId = null;

let table = {};
let player = {};

// Websocket
const HOST = location.origin.replace(/^http/, "ws");
let ws = new WebSocket(HOST);

generateBoard();
// New/Join Game
const btnCreate = document.getElementById("btnCreate");
const btnJoin = document.getElementById("btnJoin");
const txtGameId = document.getElementById("txtGameId");
const btnCopyId = document.getElementById("btnCopyId");

// In game actions

// Chat actions
const chatMessage = document.getElementById("chat-message");

// Join game listener
btnJoin.addEventListener("click", () => {
  btnCopyId.classList.remove("hidden");

  let username = document.getElementById("username").value;
  if (gameId === null) gameId = txtGameId.value;

  const payLoad = {
    method: "join",
    clientId,
    gameId,
    username,
  };

  ws.send(JSON.stringify(payLoad));
});

// Create a new game listener
btnCreate.addEventListener("click", () => {
  btnCopyId.classList.remove("hidden");
  let username = document.getElementById("username").value;
  const payLoad = {
    method: "create",
    clientId,
    username,
  };

  ws.send(JSON.stringify(payLoad));
});

btnCopyId.addEventListener("click", copyGameID);

/***********Message************/
chatMessage.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const username = document.getElementById("username").value;
    if (gameId !== null) {
      const payLoad = {
        method: "chat",
        gameId,
        clientId,
        username: player.username,
        message: chatMessage.value,
      };
      chatMessage.value = "";
      ws.send(JSON.stringify(payLoad));
    } else {
      const gameLog = document.getElementById("game-log");
      gameLog.innerHTML +=
        '<div class="msg err-msg">Unable to send a message before connecting to a game...</div>';
      const gameLogContainer = document.querySelector(".game-log");
      gameLogContainer.scrollTop = gameLogContainer.scrollHeight;
    }
  }
});

/************ WebSocket Server Responses *********/
ws.onmessage = (message) => {
  //message.data
  const res = JSON.parse(message.data);
  //Just loaded page received Globally Unique Identifier
  if (res.method === "connect") {
    clientId = res.clientId;
    document.getElementById("playerId").innerText = clientId;
  }

  //A game create request has been processed
  if (res.method === "create") {
    gameId = res.game.id;
    document.getElementById("gameId").innerText = gameId;
    let username = document.getElementById("username").value;
    copyGameID();
    const payLoad = {
      method: "join",
      clientId,
      gameId,
      username,
    };

    ws.send(JSON.stringify(payLoad));
  }

  //updated game state from server
  if (res.method === "update") {
    const client = res.client;
    const cardsContainer = document.getElementById("player-cards");
    cardsContainer.innerHTML = "";
    client.hand.forEach((card) => {
      cardsContainer.innerHTML += insertCard(card);
    });
  }
  //A new player joins
  if (res.method === "join") {
    table = res.table;
    gameId = res.gameId;
    document.getElementById("gameId").innerText = gameId;

    const { client } = res;
    player = client;
    document.querySelector(".player1").innerHTML = client.username;
    for (let i = 0; i < 4; i++) {
      document.querySelector(`.p1${i}`).classList.add("filled");
    }
    table.seats.forEach((opponent) => {
      if (!opponent.empty) {
        if (opponent.seat !== client.seat) {
          const adjustedSeat = findOppSelector(client.seat, opponent.seat, 4);
          const cssSelector = `.player${adjustedSeat}`;
          document.querySelector(cssSelector).innerText = opponent.username;
          for (let i = 0; i < 4; i++) {
            document
              .querySelector(`.p${adjustedSeat}${i}`)
              .classList.add("filled");
          }
        }
      }
    });
  }

  // Error message
  if (res.method === "error") {
    const errorContainer = document.querySelector(".error");
    errorContainer.innerText = res.message;
  }
  // Chat
  if (res.method === "chat") {
    const gameLog = document.getElementById("game-log");
    gameLog.innerHTML += `<div class="msg player-msg">${res.username}: ${res.message}</div>`;
    const gameLogContainer = document.querySelector(".game-log");
    gameLogContainer.scrollTop = gameLogContainer.scrollHeight;
  }
};
