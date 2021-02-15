const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const mongoose = require('mongoose');
const session = require('express-session');
const io = require('socket.io')(server);
require('./socket-server-side')(io);
// const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const { port, host, dbURI, dbConfig, sessionConfig } = require('./config');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.use(session(sessionConfig));
app.use(express.static(path.join(__dirname, '../public')));

require('../routers/chat-room-router')(app);

(async () => {
  try {
    await mongoose.connect(dbURI, dbConfig);
    console.log('Database connection status: connected');
    server.listen(port, host, () => {
      console.log(`Server is listening on ${host}:${port}`);
    });
  } catch (err) {
    console.error(err);
  }
})();
