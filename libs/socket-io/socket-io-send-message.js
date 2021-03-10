const moment = require('moment');
const { dbName } = require('../../config');

const sendMessage = async (socket, mongoConnection, logger, message) => {
  // Create response object
  const response = {
    from: null,
    requestAuthor: socket.id,
    message,
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
    data: message,
    status: null,
  };

  // Return if the user has not provided a name
  if (message === '') {
    response.from = 'Chat bot';
    response.message = 'Type something, your message is empty.';
    response.status = false;
    socket.emit('sendMessage', response);
    return;
  }

  try {
    // Get user from database
    const { name: userName, roomId: userRoomId } = await mongoConnection
      .db(dbName)
      .collection('users')
      .findOne({ _id: socket.id });

    // Set response author
    response.from = userName;

    // If user in room
    if (userRoomId) {
      // Get current user room from database
      const { name: roomName } = await mongoConnection
        .db(dbName)
        .collection('rooms')
        .findOne({ _id: userRoomId });

      // Emit message
      socket.to(roomName).emit('sendMessage', response);
    }

    // Emit message
    response.status = true;
    socket.emit('sendMessage', response);
  } catch (err) {
    // Set and emit message
    response.from = 'Chat bot';
    response.message = 'We have a problem, please try again later.';
    response.status = false;
    socket.emit('sendMessage', response);
    logger.log({
      level: 'error',
      message: err,
    });
  }
};

module.exports = {
  sendMessage,
};
