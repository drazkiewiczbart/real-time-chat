const moment = require('moment');
const mongoose = require('mongoose');
const User = mongoose.model('Users');
const Room = mongoose.model('Rooms');

const leaveRoom = async (socket) => {
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
    if (additionalRoom === '') {
      response.message = `You cannot leave default room.`;
      socket.emit('serverResponse', response);
      return;
    }
    const room = await Room.findOne({
      name: additionalRoom,
    }).exec();
    const currentUserInRoom = room.users.filter((el) => el !== userName);
    const numberUsersInRoom = currentUserInRoom.length;
    if (numberUsersInRoom === 0) {
      await Room.deleteOne({ name: additionalRoom });
    } else {
      room.users = currentUserInRoom;
      await room.save();
    }
    user.additionalRoom = '';
    await user.save();
    socket.leave(additionalRoom);

    response.message = `${user.name} leave room.`;
    socket.to(additionalRoom).emit('serverResponse', response);
    response.message = `You are leaved ${additionalRoom} room.`;
    socket.emit('serverResponse', response);
  } catch (err) {
    response.message = 'We have a problem, please try again later.';
    socket.emit('serverResponse', response);
    console.log(err);
  }
};

module.exports = {
  leaveRoom,
};
