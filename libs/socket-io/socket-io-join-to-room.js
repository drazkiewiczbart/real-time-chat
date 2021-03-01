const moment = require('moment');
const { createRoom } = require('./socket-io-create-room');

const joinToRoom = async (socket, connection, roomName) => {
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

  try {
    const user = await connection
      .collection('users')
      .findOne({ _id: socket.id });

    if (user.roomId) {
      serverResponse.message =
        'Before join to room you must leave current room.';
      socket.emit('serverResponse', serverResponse);
      return;
    }

    const isRoomExists = await connection
      .collection('rooms')
      .findOne({ name: roomName });

    if (!isRoomExists) {
      if (!(await createRoom(socket, connection, roomName))) {
        throw Error;
      }

      const room = await connection
        .collection('rooms')
        .findOne({ name: roomName });

      await connection
        .collection('users')
        .updateOne({ _id: socket.id }, { $set: { roomId: room._id } });

      socket.join(roomName);

      serverResponse.message = `You are joind to ${roomName} room.`;
      socket.emit('serverResponse', serverResponse);
      return;
    }

    const isNameUsed = await connection.collection('rooms').findOne(
      {
        name: roomName,
      },
      {
        $elemMatch: { connectedUsers: { name: user.name } },
      },
    );
    console.log(isNameUsed);
    if (isNameUsed) {
      serverResponse.message = `User with this name is already in this room. Choose different name`;
      socket.emit('serverResponse', serverResponse);
      return;
    }

    const room = await connection
      .collection('rooms')
      .findOne({ name: roomName });

    await connection
      .collection('users')
      .updateOne({ _id: socket.id }, { $set: { roomId: room._id } });

    await connection
      .collection('rooms')
      .updateOne(
        { name: roomName },
        { $push: { connectedUsers: { socketId: user._id, name: user.name } } },
      );

    socket.join(roomName);

    serverResponse.message = `${user.name} join to ${roomName} room.`;
    socket.to(roomName).emit('serverResponse', serverResponse);
    serverResponse.message = `You are joind to ${roomName} room.`;
    socket.emit('serverResponse', serverResponse);
  } catch (err) {
    //TODO handle logs
    console.log(err);
    serverResponse.message = 'We have a problem, please try again later';
    socket.emit('serverResponse', serverResponse);
  }
};

module.exports = {
  joinToRoom,
};
