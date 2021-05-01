import copyGameID from "/js/copyGameID.mjs";

// Client Global Variable
let clientId = null;
let gameId = null;

let table = {};
let player = {};

// Websocket
const HOST = location.origin.replace(/^http/, "ws");
let ws = new WebSocket(HOST);

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
  }
  //A new player joins
  if (res.method === "join") {
    table = res.table;
    gameId = res.gameId;
    document.getElementById("gameId").innerText = gameId;

    const { client, gameStarted } = res;
    if (client.clientId === clientId) player = client;
    joinPlayer(client, clientId, player, table, gameStarted);
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
