const joinToRoom = (socket, roomName) => {
  console.log(socket.rooms, roomName);
  console.log(socket.rooms.size);
  console.log(socket.request.session);
};

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User join to room');
    socket.emit('serverMsg', 'Server message: Hello!');
    socket.on('clientMsg', (clientMsg) => {
      if (clientMsg === 'room') {
        joinToRoom(socket, clientMsg);
      } else {
        io.emit('serverMsg', clientMsg);
      }
    });
  });
};
