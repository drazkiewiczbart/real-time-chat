const moment = require('moment');
const mongoose = require('mongoose');
const Room = mongoose.model('Rooms');

const userDisconnect = async (socket) => {
  const session = socket.request.session;
  const serverResponse = {
    from: 'Server',
    message: '',
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
  };

  if (!session.userData.additionalRoom) {
    return;
  }

  try {
    const room = await Room.findOne({
      name: session.userData.additionalRoom,
    });

    room.users = room.users.splice(
      room.users.indexOf(session.userData.name),
      1,
    );

    if (room.users.length === 0) {
      await Room.deleteOne({ name: session.userData.additionalRoom });
      return;
    }

    await room.save();
    session.userData.additionalRoom = '';
    session.save();

    serverResponse.message = `${session.userData.name} disconnected.`;
    socket
      .to(session.userData.additionalRoom)
      .emit('serverResponse', serverResponse);
  } catch (err) {
    serverResponse.message = 'We have a problem, please try again later.';
    socket.emit('serverResponse', serverResponse);
    console.log(err);
  }
};

module.exports = {
  userDisconnect,
};
