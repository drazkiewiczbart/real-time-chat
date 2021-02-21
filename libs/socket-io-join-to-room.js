const moment = require('moment');
const mongoose = require('mongoose');
const User = mongoose.model('Users');
const Room = mongoose.model('Rooms');
const { createRoom } = require('./socket-io-create-room');

const joinToRoom = async (socket, message) => {
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
    response.message = 'You need pass your room name.';
    socket.emit('serverResponse', response);
    return;
  }

  try {
    const user = await User.findOne({ userSocketId: socket.id }).exec();
    const userName = user.name;
    const { additionalRoom } = user;
    if (userName === 'New user') {
      response.message = 'Before join to room you must set name.';
      socket.emit('serverResponse', response);
      return;
    }
    if (additionalRoom === normalizeMessage) {
      response.message = 'You are current in this room.';
      socket.emit('serverResponse', response);
      return;
    }
    const isRoomInDatabase = await Room.findOne({
      name: normalizeMessage,
    }).exec();
    if (!isRoomInDatabase) {
      if (!(await createRoom(socket, normalizeMessage))) {
        throw Error;
      }
      user.additionalRoom = normalizeMessage;
      await user.save();
    } else {
      isRoomInDatabase.users.push(userName);
      await isRoomInDatabase.save();
      user.additionalRoom = normalizeMessage;
      await user.save();
    }
    socket.join(normalizeMessage);

    response.message = `${userName} join to ${normalizeMessage} room.`;
    socket.to(normalizeMessage).emit('serverResponse', response);
    response.message = `You are join to ${normalizeMessage} room.`;
    socket.emit('serverResponse', response);
  } catch (err) {
    response.message = 'We have a problem, please try again later';
    socket.emit('serverResponse', response);
    console.log(err);
  }
};

module.exports = {
  joinToRoom,
};
