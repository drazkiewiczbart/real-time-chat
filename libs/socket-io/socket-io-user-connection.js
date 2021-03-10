const moment = require('moment');
const { dbName } = require('../../config');
const { updateUsersList } = require('./socket-io-users-in-room');

const userConnection = async (socket, mongoConnection, logger) => {
  // Create response object
  const response = {
    requestAuthor: socket.id,
    message:
      '[WELCOME MESSAGE] Hello new user! This is your private/default chat room. Only you can see your messages in this place. In settings above you can change your name, create room or join to existing room or leave room. In one time you can be only in one room. It is all, have a nice day!',
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
    data: null,
    status: null,
  };

  try {
    // Create new user in database
    await mongoConnection.db(dbName).collection('users').insertOne({
      _id: socket.id,
      name: 'New user',
      roomId: null,
    });

    // Emit message
    response.status = true;
    socket.emit('userConnection', response);
    // Emit list users in room
    updateUsersList(socket, mongoConnection, logger);
  } catch (err) {
    // Set and emit message
    response.message = 'We have a problem, please try again later.';
    response.status = false;
    socket.emit('userConnection', response);
    logger.log({
      level: 'error',
      message: err,
    });
  }
};

module.exports = {
  userConnection,
};
