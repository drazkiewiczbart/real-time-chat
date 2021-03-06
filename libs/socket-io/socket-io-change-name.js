const moment = require('moment');
const { dbName } = require('../../config');

const changeName = async (socket, mongoConnection, newUserName) => {
  // Create response object
  const serverResponse = {
    from: 'Server',
    message: null,
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
    request: 'Change name',
    requestMessage: newUserName,
    isRequestSuccess: null,
  };

  // Return if the user has not provided a name
  if (newUserName === '') {
    serverResponse.message = 'You need pass your name.';
    serverResponse.isRequestSuccess = false;
    socket.emit('serverResponse', serverResponse);
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
        serverResponse.message = `User with this name is already in this room. Choose different name.`;
        serverResponse.isRequestSuccess = false;
        socket.emit('serverResponse', serverResponse);
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
      serverResponse.message = `${userName} changed name. Current name is ${newUserName}.`;
      serverResponse.isRequestSuccess = true;
      socket.to(roomName).emit('serverResponse', serverResponse);
      serverResponse.message = `Your name is changed. Current name is ${newUserName}.`;
      socket.emit('serverResponse', serverResponse);
      return;
    }

    // Update user name if user isn't in room
    await mongoConnection
      .db(dbName)
      .collection('users')
      .updateOne({ _id: userId }, { $set: { name: newUserName } });

    // Set and emit message
    serverResponse.message = `Your name is changed. Current name is ${newUserName}.`;
    serverResponse.isRequestSuccess = true;
    socket.emit('serverResponse', serverResponse);
  } catch (err) {
    // Set and emit message
    serverResponse.message = 'We have a problem, please try again later.';
    socket.emit('serverResponse', serverResponse);
    serverResponse.isRequestSuccess = false;
    //TODO handle logs, delete consol.log
    console.log(err);
  }
};

module.exports = {
  changeName,
};
