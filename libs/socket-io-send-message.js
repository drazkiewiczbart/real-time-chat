const moment = require('moment');

const sendMessage = async (socket, message) => {
  const session = socket.request.session;
  const serverResponse = {
    from: session.userData.name,
    message,
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
  };

  if (session.userData.additionalRoom) {
    socket
      .to(session.userData.additionalRoom)
      .emit('serverResponse', serverResponse);
  }

  socket.emit('serverResponse', serverResponse);
};

module.exports = {
  sendMessage,
};
