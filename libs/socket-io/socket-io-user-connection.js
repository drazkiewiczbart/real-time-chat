const moment = require('moment');
const { dbName } = require('../../config');

const userConnection = async (socket, mongoConnection) => {
  // Create response object
  const serverResponse = {
    from: 'Chat bot',
    message:
      '[WELCOME MESSAGE] Hello new user! This is your private/default chat room. In this place only you can see your messages. In the settings above you can change your name, create room or join to existed room or leave room. In one time you can be only in one room. It is all, have a nice day!',
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
    request: 'User connection',
    requestMessage: null,
    isRequestSuccess: null,
  };

  try {
    // Create new user in database
    await mongoConnection.db(dbName).collection('users').insertOne({
      _id: socket.id,
      name: 'New user',
      roomId: null,
    });

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
  userConnection,
};
