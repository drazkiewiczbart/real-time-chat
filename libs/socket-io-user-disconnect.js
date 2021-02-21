const moment = require('moment');
const mongoose = require('mongoose');
const User = mongoose.model('Users');
const Room = mongoose.model('Rooms');

const userDisconnect = async (socket) => {
  const now = moment();
  const date = now.format('YYYY-MM-DD');
  const time = now.format('HH:mm:ss');
  const response = {
    from: 'Server',
    date,
    time,
  };

  try {
    const user = await User.findOne({ userSocketId: socket.id }).exec();
    const userName = user.name;
    const { additionalRoom } = user;
    if (additionalRoom) {
      const room = await Room.findOne({ name: additionalRoom });
      const currentUserInRoom = room.users.filter((el) => el !== userName);
      const numberUsersInRoom = currentUserInRoom.length;
      if (numberUsersInRoom === 0) {
        await Room.deleteOne({ name: additionalRoom });
      } else {
        room.users = currentUserInRoom;
        room.save();
      }
    }
    await User.deleteOne({ userSocketId: socket.id }).exec();

    response.message = `${userName} disconnected.`;
    if (additionalRoom) {
      socket.to(additionalRoom).emit('serverResponse', response);
    }
    socket.disconnect();
  } catch (err) {
    response.message = 'We have a problem, please try again later.';
    socket.emit('serverResponse', response);
    console.log(err);
  }
};

module.exports = {
  userDisconnect,
};
