const { userConnection } = require('./socket-io-user-connection');
const { userDisconnect } = require('./socket-io-user-disconnect');
const { sendMessage } = require('./socket-io-send-message');
const { joinToRoom } = require('./socket-io-join-to-room');
const { leaveRoom } = require('./socket-io-leave-room');
const { changeName } = require('./socket-io-change-name');
const { getMongoConnection } = require('../mongo/mongo-connection');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    await userConnection(socket, getMongoConnection());

    socket.on('disconnecting', async () => {
      await userDisconnect(socket, getMongoConnection());
    });

    socket.on('sendMessage', async (message) => {
      await sendMessage(socket, getMongoConnection(), message);
    });

    socket.on('joinToRoom', async (joinRoomName) => {
      await joinToRoom(socket, getMongoConnection(), joinRoomName);
    });

    socket.on('leaveRoom', async () => {
      await leaveRoom(socket, getMongoConnection());
    });

    socket.on('changeName', async (newUserName) => {
      await changeName(socket, getMongoConnection(), newUserName);
    });
  });
};
