const moment = require('moment');
const { dbName } = require('../../config');

const leaveRoom = async (socket, mongoConnection) => {
  // Create response object
  const serverResponse = {
    from: 'Server',
    message: null,
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
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
      serverResponse.message = `You cannot leave default room.`;
      socket.emit('serverResponse', serverResponse);
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
    serverResponse.message = `${userName} leave room.`;
    socket.to(roomName).emit('serverResponse', serverResponse);
    serverResponse.message = `You are leaved ${roomName} room.`;
    socket.emit('serverResponse', serverResponse);
  } catch (err) {
    // Set and emit message
    serverResponse.message = 'We have a problem, please try again later.';
    socket.emit('serverResponse', serverResponse);
    //TODO handle logs, delete consol.log
    console.log(err);
  }
};

module.exports = {
  leaveRoom,
};
