const moment = require('moment');

const newUserConnection = async (socket) => {
  const session = socket.request.session;
  const serverResponse = {
    from: 'Server',
    message: 'Hello new user.',
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
  };

  session.userData = {
    name: 'New user',
    additionalRoom: '',
  };
  session.save();

  socket.emit('serverResponse', serverResponse);
};

module.exports = {
  newUserConnection,
};
