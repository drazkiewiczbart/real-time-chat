const emitServerMsg = (io, serverMsg) => {
  io.emit('serverMsg', serverMsg);
};

const addUserToSession = (socket) => {
  const [defaultRoom] = socket.rooms;

  const defaultUser = {
    name: 'New user',
    defaultRoom,
    currentRoom: defaultRoom,
  };

  socket.request.session.user = defaultUser;
  console.log(socket.request.session);
};

module.exports = {
  emitServerMsg,
  addUserToSession,
};
