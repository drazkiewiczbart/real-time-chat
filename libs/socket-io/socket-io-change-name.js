const moment = require('moment');
const { dbName } = require('../../config');
const { updateUsersList } = require('./socket-io-users-in-room');

const changeName = async (socket, mongoConnection, logger, newUserName) => {
  // Create response object
  const response = {
    requestAuthor: socket.id,
    message: null,
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
    data: newUserName,
    status: null,
  };

  // Return if the user has not provided a name
  if (newUserName === '') {
    response.message = 'You need to enter a name before change.';
    response.status = false;
    socket.emit('changeName', response);
    return;
  }

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

    // If user is current in room
    if (userRoomId) {
      // Check if name exists in room
      const isUserNameExists = await mongoConnection
        .db(dbName)
        .collection('rooms')
        .findOne({
          _id: userRoomId,
          'connectedUsers.name': newUserName,
        });

      // Return if name is used
      if (isUserNameExists) {
        response.message = `User with this name is already in this room. Choose different name.`;
        response.status = false;
        socket.emit('changeName', response);
        return;
      }

      // Update user name when name is available
      await mongoConnection
        .db(dbName)
        .collection('users')
        .updateOne({ _id: userId }, { $set: { name: newUserName } });

      // Update user name in room
      await mongoConnection
        .db(dbName)
        .collection('rooms')
        .updateOne(
          {
            _id: userRoomId,
            'connectedUsers.name': userName,
          },
          { $set: { 'connectedUsers.$.name': newUserName } },
        );

      // Get user room from database
      const { name: roomName } = await mongoConnection
        .db(dbName)
        .collection('rooms')
        .findOne({ _id: userRoomId });

      // Set and emit message, return
      response.message = `${userName} changed name. Current name is ${newUserName}.`;
      response.status = true;
      socket.to(roomName).emit('changeName', response);
      response.message = `Your name is changed. Current name is ${newUserName}.`;
      socket.emit('changeName', response);

      // Emit list users in room
      updateUsersList(socket, mongoConnection, logger, userRoomId);
      return;
    }

    // Update user name if user isn't in room
    await mongoConnection
      .db(dbName)
      .collection('users')
      .updateOne({ _id: userId }, { $set: { name: newUserName } });

    // Set and emit message
    response.message = `Your name is changed. Current name is ${newUserName}.`;
    response.status = true;
    socket.emit('changeName', response);

    // Emit list users in room
    updateUsersList(socket, mongoConnection, logger);
  } catch (err) {
    // Set and emit message
    response.message = 'We have a problem, please try again later.';
    response.status = false;
    socket.emit('changeName', response);
    logger.log({
      level: 'error',
      message: err,
    });
  }
};

module.exports = {
  changeName,
};
