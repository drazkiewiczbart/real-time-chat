const moment = require('moment');
const { dbName } = require('../../config');
const { updateUsersList } = require('./socket-io-users-in-room');

const leaveRoom = async (socket, mongoConnection, logger) => {
  // Create response object
  const response = {
    requestAuthor: socket.id,
    message: null,
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
    data: null,
    status: null,
  };

  try {
    // Get user from database
    const {
      _id: userId,
      name: userName,
      roomId: userRoomId,
    } = await mongoConnection
      .db(dbName)
      .collection('users')
      .findOne({ _id: socket.id });

    // Return if user isn't current in room
    if (!userRoomId) {
      response.message = `You cannot leave private/default room.`;
      response.status = false;
      socket.emit('leaveRoom', response);
      return;
    }

    // If user is in room, remove user from room in database
    await mongoConnection
      .db(dbName)
      .collection('rooms')
      .updateOne(
        { _id: userRoomId },
        { $pull: { connectedUsers: { socketId: userId } } },
      );

    // Get room from database
    const {
      name: roomName,
      connectedUsers: usersInRoom,
    } = await mongoConnection
      .db(dbName)
      .collection('rooms')
      .findOne({ _id: userRoomId });

    // Delete room if empty
    if (usersInRoom.length === 0) {
      await mongoConnection
        .db(dbName)
        .collection('rooms')
        .deleteOne({ _id: userRoomId });
    }

    // Update user current room in database
    await mongoConnection
      .db(dbName)
      .collection('users')
      .updateOne({ _id: userId }, { $set: { roomId: null } });

    // Leave room
    socket.leave(roomName);

    // Set and emit message
    response.message = `${userName} left the room.`;
    response.status = true;
    socket.to(roomName).emit('leaveRoom', response);
    response.message = `You have left the ${roomName} room.`;
    socket.emit('leaveRoom', response);

    // Emit list users in room
    updateUsersList(socket, mongoConnection, logger, userRoomId);
  } catch (err) {
    // Set and emit message
    response.message = 'We have a problem, please try again later.';
    response.status = false;
    socket.emit('leaveRoom', response);
    logger.log({
      level: 'error',
      message: err,
    });
  }
};

module.exports = {
  leaveRoom,
};
