const { userConnection } = require('./socket-io-user-connection');
const { userDisconnect } = require('./socket-io-user-disconnect');
const { sendMessage } = require('./socket-io-send-message');
const { joinToRoom } = require('./socket-io-join-to-room');
const { leaveRoom } = require('./socket-io-leave-room');
const { changeName } = require('./socket-io-change-name');
const { manualUpdateUsersList } = require('./socket-io-users-in-room');
const { getMongoConnection } = require('../mongo/mongo-connection');

module.exports = (io, logger) => {
  io.on('connection', async (socket) => {
    await userConnection(socket, getMongoConnection(), logger);

    socket.on('disconnecting', async () => {
      await userDisconnect(socket, getMongoConnection(), logger);
    });

    socket.on('sendMessage', async (message) => {
      await sendMessage(socket, getMongoConnection(), logger, message);
    });

    socket.on('joinToRoom', async (joinRoomName) => {
      await joinToRoom(socket, getMongoConnection(), logger, joinRoomName);
    });

    socket.on('leaveRoom', async () => {
      await leaveRoom(socket, getMongoConnection(), logger);
    });

    socket.on('changeName', async (newUserName) => {
      await changeName(socket, getMongoConnection(), logger, newUserName);
    });

    socket.on('manualUpdateUsersList', async () => {
      await manualUpdateUsersList(socket, getMongoConnection(), logger);
    });
  });
};
