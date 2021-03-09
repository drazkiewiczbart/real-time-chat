const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
require('./libs/socket-io/socket-io-server')(io);
const path = require('path');
const { port, host } = require('./config');
const {
  openMongoConnection,
  getMongoConnection,
} = require('./libs/mongo/mongo-connection');
const { clearMongoDatabase } = require('./libs/mongo/mongo-clear-database');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './public')));

require('./routers/chat-room-router')(app);

(async () => {
  try {
    await openMongoConnection();
    await clearMongoDatabase(getMongoConnection());
    server.listen(port, host, () => {
      //TODO handle logs, delete consol.log
      console.log(`Server is listening on ${host}:${port}.`);
    });
  } catch (err) {
    //TODO handle logs, delete consol.log
    console.error(`Server isn't listening. ${err}.`);
  }
})();
