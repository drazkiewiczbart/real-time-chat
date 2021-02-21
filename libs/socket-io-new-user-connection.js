const moment = require('moment');
const mongoose = require('mongoose');
const User = mongoose.model('Users');

const newUserConnection = async (socket) => {
  const now = moment();
  const date = now.format('YYYY-MM-DD');
  const time = now.format('HH:mm:ss');
  const response = {
    from: 'Server',
    date,
    time,
  };
  const userSocketId = socket.id;
  const user = new User({
    userSocketId,
    name: 'New user',
    defaultRoom: userSocketId,
  });

  try {
    await user.save();
    response.message = 'Hello new user.';
  } catch (err) {
    response.message = 'We have a problem, please try again later.';
    console.log(err);
  }
  socket.emit('serverResponse', response);
};

module.exports = {
  newUserConnection,
};
