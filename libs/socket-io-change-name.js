const moment = require('moment');
const mongoose = require('mongoose');
const User = mongoose.model('Users');

const changeName = async (socket, message) => {
  const now = moment();
  const date = now.format('YYYY-MM-DD');
  const time = now.format('HH:mm:ss');
  const response = {
    from: 'Server',
    date,
    time,
  };

  const normalizeMessage = message.trim();
  if (!normalizeMessage) {
    response.message = 'You need pass your name.';
    socket.emit('serverResponse', response);
    return;
  }

  try {
    const isUserInDatabase = await User.findOne({
      name: normalizeMessage,
    }).exec();
    if (!isUserInDatabase) {
      const user = await User.findOne({ userSocketId: socket.id }).exec();
      const oldUserName = user.name;
      const { additionalRoom } = user;
      user.name = normalizeMessage;
      await user.save();

      if (additionalRoom) {
        response.message = `${oldUserName} changed name. Current name is ${normalizeMessage}.`;
        socket.to(additionalRoom).emit('serverResponse', response);
      }
      response.message = `Your name is changed. Current name is ${normalizeMessage}.`;
      socket.emit('serverResponse', response);
    } else {
      response.message = 'This name is already used, choose different name.';
      socket.emit('serverResponse', response);
    }
  } catch (err) {
    response.message = 'We have a problem, please try again later.';
    socket.emit('serverResponse', response);
    console.log(err);
  }
};

module.exports = {
  changeName,
};
