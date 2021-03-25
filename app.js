/*
** Module dependencies
*/

const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
require('./libs/socket-io/socket-io-server')(io);
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
    logger.log({ level: 'info', message: 'Server is listening.' });
  });
} catch (err) {
  logger.log({ level: 'error', message: `Start server problem. ${err}` });
}

/*
** Connection to database
*/

establishDatabaseConnection();

/*
** App set / use
*/

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(compression());

/*
** Routers
*/

app.all('/', (req, res) => {
  res.render('chat-room-view');
});

app.all('/*', (req, res) => {
  res.redirect('/');
});
