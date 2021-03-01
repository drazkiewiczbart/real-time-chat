const moment = require('moment');

const sendMessage = async (socket, connection, message) => {
  const serverResponse = {
    from: null,
    message,
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
  };

  try {
    const user = await connection
      .collection('users')
      .findOne({ _id: socket.id });

    serverResponse.from = user.name;

    if (user.roomId) {
      const room = await connection
        .collection('rooms')
        .findOne({ _id: user.roomId });

      socket.to(room.name).emit('serverResponse', serverResponse);
    }
    socket.emit('serverResponse', serverResponse);
  } catch (err) {
    //TODO handle logs, delete consol.log
    serverResponse.message = 'We have a problem, please try again later.';
    socket.emit('serverResponse', serverResponse);
  }
};

module.exports = {
  sendMessage,
};
