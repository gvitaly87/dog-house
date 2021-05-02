require("dotenv").config();
const http = require("http");
const websocketServer = require("websocket").server;

const express = require("express");
const app = express();
const path = require("path");
const routes = require("./routes");

const getUniqueID = require("./lib/getUniqueID");
const getSeat = require("./lib/getSeat");
const respondAllClients = require("./lib/respondAllClients");
const initGame = require("./lib/initGame");

const Game = require("./models/game");
const Player = require("./models/player");
const PORT = process.env.PORT || 3000;

// Express
app.use(express.static(path.join(__dirname, "./public")));

app.get("/favicon.ico", (req, res) => res.sendStatus(204));

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use("/", routes);

//404 Not Found page.
app.use((req, res, next) => {
  const err = new Error("Requested page could not be found");
  err.status = 404;
  next(err);
});

// Catch all the errors that might have occurred
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  console.error(err);
  const status = err.status || 500;
  res.locals.status = status;
  res.status(status);
  res.render("pages/error", { pageTitle: `Error ${status}` });
});

// WebSocket
const httpServer = http.createServer(app);

// Start a TCP server listening for connections on the given port and host
httpServer.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}/`)
);

const clients = {};
const games = {};

const wsServer = new websocketServer({
  httpServer: httpServer,
});

wsServer.on("request", (req) => {
  const connection = req.accept(null, req.origin);
  connection.on("open", () => console.log("Connection opened!"));
  connection.on("close", () => {
    console.log("Connection closed!");
    // clientLeft();
  });
  connection.on("message", (message) => {
    // TODO: security for malicious message
    // TODO: security for DoS attacks
    const res = JSON.parse(message.utf8Data);

    /***************** Create a new Game *****************/
    if (res.method === "create") {
      const clientId = res.clientId;
      const gameId = getUniqueID();
      // console.log("A new game has been created, ID: ", gameId);
      games[gameId] = new Game(gameId, 4);

      const payLoad = {
        method: "create",
        game: games[gameId],
      };

      const con = clients[clientId].connection;
      con.send(JSON.stringify(payLoad));
    }

    /***************** Join an existing Game *****************/
    if (res.method === "join") {
      const { clientId, gameId, username } = res;
      // Check that the game exists
      if (games[gameId] === undefined) {
        const payLoad = {
          method: "error",
          status: 404,
          message: "A game with that id can't be found",
        };
        clients[clientId].connection.send(JSON.stringify(payLoad));
      } else {
        const game = games[gameId];
        if (game.clients.length >= 4) {
          const payLoad = {
            method: "error",
            status: "500",
            message: "The game you want to join is already full",
          };
          clients[clientId].connection.send(JSON.stringify(payLoad));
          return;
        }
        const seat = getSeat(game.table.seats);
        game.clients.push({
          clientId,
          username,
          seat,
          empty: false,
          hand: [],
        });
        const color = { 0: "blue", 1: "green", 2: "yellow", 3: "red" }[seat];
        game.table.seats[seat] = new Player(username, seat, color);

        //start the game
        if (game.clients.length === 4) {
          initGame(game);
          updateGameState(game);
        }

        const payLoad = {
          method: "join",
          gameId: game.id,
          table: game.table,
        };
        respondAllClients(clients, game, payLoad);
      }
    }
    /***************** In Game Actions *****************/

    /***************** Chat Message ****************/
    if (res.method === "chat") {
      const { clientId, gameId, username, message } = res;
      // console.log("***** Chat Message *****");
      // console.log(res);
      if (games[gameId] === undefined) {
        const payLoad = {
          method: "error",
          status: 404,
          message: "A game with that id can't be found",
        };
        clients[clientId].connection.send(JSON.stringify(payLoad));
      } else {
        const game = games[gameId];
        const payLoad = {
          method: "chat",
          message,
          username,
        };
        respondAllClients(clients, game, payLoad);
      }
    }
  });

  // generate a new clientId
  const clientId = getUniqueID();
  console.log("A new client connected with the ID: ", clientId);
  clients[clientId] = {
    connection: connection,
  };
  const payLoad = {
    method: "connect",
    clientId: clientId,
  };
  connection.send(JSON.stringify(payLoad));
});

function updateGameState(game) {
  const payLoad = {
    method: "update",
    table: game.table,
  };
  respondAllClients(clients, game, payLoad);
}

// const clientLeft = () => {
//   for (const g of Object.keys(games)) {
//     const game = games[g];
//     game.clients.forEach((client, index, object) => {
//       if (clients[client.clientId].connection.state === "closed") {
//         console.log(client.username, " has left the game!");
//         game.table.gameLog = `${client.username} has left the game`;
//         game.table.seats[client.seat] = { empty: true };
//         if (game.table.playerToAct === client.seat)
//           game.table.playerToAct = nextToAct(game.table);

//         // remove client from game
//         object.splice(index, 1);
//         // update clientIndex for each player's seat
//         game.table.seats.forEach((seat) => {
//           if (!seat.empty) {
//             if (seat.clientIndex > index) seat.clientIndex -= 1;
//           }
//         });
//         delete clients[client.clientId];
//       }
//     });
//     let { table, deck } = setQue(game.table, game.deck, true);
//     game.table = table;
//     game.deck = deck;
//     updateGameState(game);
//   }
// };
