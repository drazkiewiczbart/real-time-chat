const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const compression = require('compression');
const { logger } = require('./libs/winston/winston-config');
require('./libs/socket-io/socket-io-server')(io, logger);
const { port, host } = require('./config');
const {
  openMongoConnection,
  getMongoConnection,
} = require('./libs/mongo/mongo-connection');
const { clearMongoDatabase } = require('./libs/mongo/mongo-clear-database');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));
app.use(express.static(path.join(__dirname, './public')));
app.use(compression());

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
