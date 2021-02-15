const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const mongoose = require('mongoose');
const { port, host, dbURI, dbConfig } = require('./config');

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
