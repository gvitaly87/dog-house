const respondAllClients = (clients, game, payLoad) => {
  game.clients.forEach((client) => {
    payLoad.client = client;
    clients[client.clientId].connection.send(JSON.stringify(payLoad));
  });
};

module.exports = respondAllClients;
