const moment = require('moment');
const mongoose = require('mongoose');
const Room = mongoose.model('Rooms');

const changeName = async (socket, userName) => {
  const session = socket.request.session;
  const serverResponse = {
    from: 'Server',
    message: '',
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
  };

  if (!userName) {
    serverResponse.message = 'You need pass your name.';
    socket.emit('serverResponse', serverResponse);
    return;
  }

  if (!session.userData.additionalRoom) {
    session.userData.name = userName;
    session.save();
    serverResponse.message = `Your name is changed. Current name is ${userName}.`;
    socket.emit('serverResponse', serverResponse);
    return;
  }

  try {
    const room = await Room.findOne({
      name: session.userData.additionalRoom,
    });

    if (room.users.includes(userName)) {
      serverResponse.message = `User with this name is already in this room. Choose different name`;
      socket.emit('serverResponse', serverResponse);
      return;
    }

    const oldUserName = session.userData.name;
    session.userData.name = userName;
    session.save();

    if (session.userData.additionalRoom) {
      serverResponse.message = `${oldUserName} changed name. Current name is ${userName}.`;
      socket
        .to(session.userData.additionalRoom)
        .emit('serverResponse', serverResponse);
    }

    serverResponse.message = `Your name is changed. Current name is ${userName}.`;
    socket.emit('serverResponse', serverResponse);
  } catch (err) {
    serverResponse.message = 'We have a problem, please try again later.';
    socket.emit('serverResponse', serverResponse);
    console.log(err);
  }
};

module.exports = {
  changeName,
};
