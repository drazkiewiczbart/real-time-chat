const moment = require('moment');
const { dbName } = require('../../config');

const sendMessage = async (socket, mongoConnection, message) => {
  // Create response object
  const serverResponse = {
    from: null,
    message,
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
    request: 'Send message',
    requestMessage: message,
    isRequestSuccess: null,
  };

  // Return if the user has not provided a name
  if (message === '') {
    serverResponse.from = 'Server';
    serverResponse.message = 'Type something, your message is empty';
    serverResponse.isRequestSuccess = false;
    socket.emit('serverResponse', serverResponse);
    return;
  }

  try {
    // Get user from database
    const { name: userName, roomId: userRoomId } = await mongoConnection
      .db(dbName)
      .collection('users')
      .findOne({ _id: socket.id });

    // Set response author
    serverResponse.from = userName;

    // If user in room
    if (userRoomId) {
      // Get current user room from database
      const { name: roomName } = await mongoConnection
        .db(dbName)
        .collection('rooms')
        .findOne({ _id: userRoomId });

      // Emit message
      socket.to(roomName).emit('serverResponse', serverResponse);
    }

    // Emit message
    serverResponse.isRequestSuccess = true;
    socket.emit('serverResponse', serverResponse);
  } catch (err) {
    // Set and emit message
    serverResponse.message = 'We have a problem, please try again later.';
    serverResponse.isRequestSuccess = false;
    socket.emit('serverResponse', serverResponse);
    //TODO handle logs, delete consol.log
    console.log(err);
  }
};

module.exports = {
  sendMessage,
};
