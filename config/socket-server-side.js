module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User join to room');
    socket.emit('serverMsg', 'Server message: Hello!');
    socket.on('clientMsg', (clientMsg) => {
      io.emit('serverMsg', clientMsg);
    });
  });
};
