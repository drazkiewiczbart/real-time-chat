const { userConnection } = require('./socket-io-user-connection');
const { userDisconnect } = require('./socket-io-user-disconnect');
const { sendMessage } = require('./socket-io-send-message');
const { joinToRoom } = require('./socket-io-join-to-room');
const { leaveRoom } = require('./socket-io-leave-room');
const { changeName } = require('./socket-io-change-name');
const { getConnection } = require('../mongo/mongo-connection');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    await userConnection(socket, getConnection());

    socket.on('disconnecting', async () => {
      await userDisconnect(socket, getConnection());
    });

    socket.on('message', async (message) => {
      await sendMessage(socket, getConnection(), message);
    });

    socket.on('joinToRoom', async (roomName) => {
      await joinToRoom(socket, getConnection(), roomName);
    });

    socket.on('leaveRoom', async () => {
      await leaveRoom(socket, getConnection());
    });

    socket.on('changeName', async (newUserName) => {
      await changeName(socket, getConnection(), newUserName);
    });
  });
};
