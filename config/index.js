const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const { port, host } = require('./config');

server.listen(port, host, () => {
  console.log(`Server is running on ${host}:${port}.`);
});
