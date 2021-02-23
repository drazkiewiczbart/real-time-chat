const moment = require('moment');
const mongoose = require('mongoose');
const Room = mongoose.model('Rooms');
const { createRoom } = require('./socket-io-create-room');

const joinToRoom = async (socket, roomName) => {
  const session = socket.request.session;
  const serverResponse = {
    from: 'Server',
    message: '',
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
  };

  if (!roomName) {
    serverResponse.message = 'You need pass your room name.';
    socket.emit('serverResponse', serverResponse);
    return;
  }

  if (session.userData.additionalRoom === roomName) {
    serverResponse.message = 'You are current in this room.';
    socket.emit('serverResponse', serverResponse);
    return;
  }

  if (session.userData.additionalRoom) {
    serverResponse.message = 'Before join to room you must leave current room.';
    socket.emit('serverResponse', serverResponse);
    return;
  }

  try {
    const room = await Room.findOne({
      name: session.userData.additionalRoom,
    });

    if (!room) {
      if (!(await createRoom(session, roomName))) {
        throw Error;
      }
      socket.join(roomName);
      session.userData.additionalRoom = roomName;
      session.save();
      serverResponse.message = `You are joind to ${roomName} room.`;
      socket.emit('serverResponse', serverResponse);
      return;
    }

    if (room.users.includes(session.userData.name)) {
      serverResponse.message = `User with this name is already in this room. Choose different name`;
      socket.emit('serverResponse', serverResponse);
      return;
    }

    room.users.push(session.userData.name);
    await room.save();
    socket.join(roomName);
    session.userData.additionalRoom = roomName;
    session.save();

    serverResponse.message = `${session.userData.name} join to ${roomName} room.`;
    socket
      .to(session.userData.additionalRoom)
      .emit('serverResponse', serverResponse);
    serverResponse.message = `You are joind to ${roomName} room.`;
    socket.emit('serverResponse', serverResponse);
  } catch (err) {
    serverResponse.message = 'We have a problem, please try again later';
    socket.emit('serverResponse', serverResponse);
    console.log(err);
  }
};

module.exports = {
  joinToRoom,
};
