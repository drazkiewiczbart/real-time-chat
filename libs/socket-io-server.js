const { sendMessage } = require('./socket-io-send-message');
const { joinToRoom } = require('./socket-io-join-to-room');
const { changeName } = require('./socket-io-change-name');
const { leaveRoom } = require('./socket-io-leave-room');
const { newUserConnection } = require('./socket-io-new-user-connection');
const { userDisconnect } = require('./socket-io-user-disconnect');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    await newUserConnection(socket);

    socket.on('disconnecting', async () => {
      await userDisconnect(socket);
    });

    socket.on('message', async (message) => {
      await sendMessage(socket, message);
    });

    socket.on('joinToRoom', async (roomName) => {
      await joinToRoom(socket, roomName);
    });

    socket.on('leaveRoom', async () => {
      await leaveRoom(socket);
    });

    socket.on('changeName', async (userName) => {
      await changeName(socket, userName);
    });
  });
};
