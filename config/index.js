// Import modules
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const expressSession = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(expressSession);
require('../models/user-model')(mongoose);
require('../models/room-model')(mongoose);
const io = require('socket.io')(server);
require('../libs/socket-io-server')(io);
const path = require('path');
const {
  port,
  host,
  dbHost,
  dbPort,
  dbName,
  dbUser,
  dbUserPwd,
  sessionSecret,
} = require('./config');

// App set
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// App use
app.use(express.static(path.join(__dirname, '../public')));
const session = expressSession({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  httpOnly: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 1,
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
});
app.use(session);
io.use((socket, next) => {
  session(socket.request, {}, next);
});

// Routers
require('../routers/chat-room-router')(app);

// Database and server
(async () => {
  try {
    const dbURI = `mongodb://${dbHost}:${dbPort}/${dbName}`;
    const dbConfig = {
      user: dbUser,
      pass: dbUserPwd,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect(dbURI, dbConfig);
    console.log('Start: database connected.');
    server.listen(port, host, () => {
      console.log(`Start: server is listening on ${host}:${port}.`);
    });
  } catch (err) {
    console.error(`Start: database or server error. ${err}.`);
  }
})();

// Events
mongoose.connection.on('disconnected', () => {
  console.log('Database disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log('Database reconnected.');
});

mongoose.connection.on('error', (err) => {
  console.log(`Database error. ${err}.`);
});
