const { Response } = require('./response');
const { getDatabaseConnection } = require('../mongodb/connection');
const { logger } = require('../winston/config');
const { updateUsersList } = require('./users-in-room');

const leaveRoom = async (socket) => {
  const response = new Response();
  response.requestAuthor = socket.id;

  try {
    const { _id: userId, name: userName, roomId: userRoomId } = await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('users')
      .findOne({ _id: socket.id });

    if (!userRoomId) {
      response.status = false;
      response.message = 'You cannot leave private/default room.';

      socket.emit('leaveRoom', response);

      return;
    }

    await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('rooms')
      .updateOne({ _id: userRoomId }, { $pull: { connectedUsers: { socketId: userId } } });

    const { name: roomName, connectedUsers: usersInRoom } = await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('rooms')
      .findOne({ _id: userRoomId });

    if (usersInRoom.length === 0) {
      await getDatabaseConnection()
        .db(process.env.DB_NAME)
        .collection('rooms')
        .deleteOne({ _id: userRoomId });
    }

    await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('users')
      .updateOne({ _id: userId }, { $set: { roomId: null } });

    socket.leave(roomName);

    response.status = true;
    response.message = `${userName} left the room.`;

    socket.to(roomName).emit('leaveRoom', response);

    response.message = `You have left the ${roomName} room.`;

    socket.emit('leaveRoom', response);

    updateUsersList(socket, userRoomId);
  } catch (err) {
    response.status = false;
    response.message = 'We have a problem, please try again later.';

    socket.emit('leaveRoom', response);

    logger.log({ level: 'error', message: err });
  }
};

module.exports = {
  leaveRoom,
};
