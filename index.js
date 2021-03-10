const { logger } = require('./libs/winston/winston-config');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
require('./libs/socket-io/socket-io-server')(io, logger);
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
app.get('/*', (req, res) => {
  res.redirect('/');
});

(async () => {
  try {
    await openMongoConnection(logger);
    await clearMongoDatabase(getMongoConnection(), logger);
    server.listen(port, host, () => {
      logger.log({
        level: 'info',
        message: `Server is listening on ${host}:${port}.`,
      });
    });
  } catch (err) {
    logger.log({
      level: 'error',
      message: err,
    });
  }
})();
