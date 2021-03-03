const moment = require('moment');
const { dbName } = require('../../config');

const userDisconnect = async (socket, mongoConnection) => {
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

    // If user isn't in room, delete user from database, return
    if (!userRoomId) {
      await mongoConnection
        .db(dbName)
        .collection('users')
        .deleteOne({ _id: userId });
      return;
    }

    // If user was in room, delete user form database
    await mongoConnection
      .db(dbName)
      .collection('users')
      .deleteOne({ _id: userId });

    // Remove user from room in database
    await mongoConnection
      .db(dbName)
      .collection('rooms')
      .updateOne(
        { _id: userRoomId },
        { $pull: { connectedUsers: { socketId: userId } } },
      );

    // Get last user room from database
    const {
      name: roomName,
      connectedUsers: usersInRoom,
    } = await mongoConnection
      .db(dbName)
      .collection('rooms')
      .findOne({ _id: userRoomId });

    // Delete room if empty, return
    if (usersInRoom.length === 0) {
      await mongoConnection
        .db(dbName)
        .collection('rooms')
        .deleteOne({ _id: userRoomId });
      return;
    }

    // Set and emit message
    serverResponse.message = `${userName} disconnected.`;
    socket.to(roomName).emit('serverResponse', serverResponse);
  } catch (err) {
    // Set and emit message
    serverResponse.message = 'We have a problem, please try again later.';
    socket.emit('serverResponse', serverResponse);
    //TODO handle logs, delete consol.log
    console.log(err);
  }
};

module.exports = {
  userDisconnect,
};
