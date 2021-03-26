/*
** Module dependencies
*/

const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
require('./libs/socket-io/server')(io);
const path = require('path');
const compression = require('compression');
require('dotenv').config();
const { establishDatabaseConnection } = require('./libs/mongodb/connection');
const { logger } = require('./libs/winston/config');

/*
** Start server listening
*/

try {
  server.listen(process.env.PORT, process.env.HOST, () => {
    logger.log({ level: 'info', message: 'Server listen.' });
  });
} catch (err) {
  logger.log({ level: 'error', message: `Server has a problem with start. ${err}` });
}

/*
** Connection to database and clean collections
*/

establishDatabaseConnection();

/*
** Application settings
*/

app.set('views');
app.set('view engine', 'ejs');
app.set('x-powered-by', false);

/*
** Application middlewares
*/

app.use(express.static(path.join(__dirname, '/public')));
app.use(compression());

/*
** Application router
*/

app.all('*', (req, res) => {
  res.render('chat-room-view');
});
