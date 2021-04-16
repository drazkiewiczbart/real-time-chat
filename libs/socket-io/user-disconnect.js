const { Response } = require('./response');
const { getDatabaseConnection } = require('../mongodb/connection');
const { logger } = require('../winston/config');
const { updateUsersList } = require('./users-in-room');

const userDisconnect = async (socket) => {
  const response = new Response();
  response.requestAuthor = socket.id;

  try {
    const { _id: userId, name: userName, roomId: userRoomId } = await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('rtchatusers')
      .findOne({ _id: socket.id });

    if (!userRoomId) {
      await getDatabaseConnection()
        .db(process.env.DB_NAME)
        .collection('rtchatusers')
        .deleteOne({ _id: userId });

      return;
    }

    await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('rtchatusers')
      .deleteOne({ _id: userId });

    await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('rtchatrooms')
      .updateOne({ _id: userRoomId }, { $pull: { connectedUsers: { socketId: userId } } });

    const { name: roomName, connectedUsers: usersInRoom } = await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('rtchatrooms')
      .findOne({ _id: userRoomId });

    if (usersInRoom.length === 0) {
      await getDatabaseConnection()
        .db(process.env.DB_NAME)
        .collection('rtchatrooms')
        .deleteOne({ _id: userRoomId });

      return;
    }

    response.message = `${userName} disconnected from ${roomName} room.`;
    response.status = true;

    socket
      .to(roomName)
      .emit('userDisconnect', response);

    updateUsersList(socket, userRoomId);
  } catch (err) {
    response.status = false;
    response.message = 'We have a problem, please try again later.';

    socket.emit('userDisconnect', response);

    logger.log({ level: 'error', message: `User disconnect error. ${err}` });
  }
};

module.exports = {
  userDisconnect,
};
