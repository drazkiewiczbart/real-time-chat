const { userConnection } = require('./user-connection');
const { userDisconnect } = require('./user-disconnect');
const { sendMessage } = require('./send-message');
const { joinToRoom } = require('./join-to-room');
const { leaveRoom } = require('./leave-room');
const { changeName } = require('./change-name');
const { manualUpdateUsersList } = require('./users-in-room');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    await userConnection(socket);

    socket.on('disconnecting', async () => {
      await userDisconnect(socket);
    });

    socket.on('sendMessage', async (message) => {
      await sendMessage(socket, message);
    });

    socket.on('joinToRoom', async (joinRoomName) => {
      await joinToRoom(socket, joinRoomName);
    });

    socket.on('leaveRoom', async () => {
      await leaveRoom(socket);
    });

    socket.on('changeName', async (newUserName) => {
      await changeName(socket, newUserName);
    });

    socket.on('manualUpdateUsersList', async () => {
      await manualUpdateUsersList(socket);
    });
  });
};
