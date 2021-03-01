const moment = require('moment');

const userConnection = async (socket, connection) => {
  const serverResponse = {
    from: 'Server',
    message: 'Hello new user.',
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
  };

  try {
    await connection.collection('users').insertOne({
      _id: socket.id,
      name: 'New user',
      roomId: null,
    });
  } catch (err) {
    //TODO handle logs, delete consol.log
    serverResponse.message = 'We have a problem, please try again later.';
  } finally {
    socket.emit('serverResponse', serverResponse);
  }
};

module.exports = {
  userConnection,
};
