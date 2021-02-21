const moment = require('moment');
const mongoose = require('mongoose');
const User = mongoose.model('Users');

const sendMessage = async (socket, message) => {
  const now = moment();
  const date = now.format('YYYY-MM-DD');
  const time = now.format('HH:mm:ss');
  const response = {
    date,
    time,
  };

  try {
    const user = await User.findOne({ userSocketId: socket.id }).exec();
    const userName = user.name;
    const { additionalRoom } = user;
    response.from = userName;
    response.message = message;

    if (additionalRoom) {
      socket.to(additionalRoom).emit('serverResponse', response);
    }
    socket.emit('serverResponse', response);
  } catch (err) {
    response.from = 'Server';
    response.message = 'We have a problem, please try again later.';
    socket.emit('serverResponse', response);
    console.log(err);
  }
};

module.exports = {
  sendMessage,
};
