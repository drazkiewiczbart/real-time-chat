const moment = require('moment');

const leaveRoom = async (socket, connection) => {
  const serverResponse = {
    from: 'Server',
    message: '',
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
  };

  try {
    const user = await connection
      .collection('users')
      .findOne({ _id: socket.id });

    if (!user.roomId) {
      serverResponse.message = `You cannot leave default room.`;
      socket.emit('serverResponse', serverResponse);
      return;
    }

    await connection
      .collection('rooms')
      .updateOne(
        { _id: user.roomId },
        { $pull: { connectedUsers: { socketId: user._id } } },
      );

    const room = await connection
      .collection('rooms')
      .findOne({ _id: user.roomId });

    if (room.connectedUsers.length === 0) {
      await connection.collection('rooms').deleteOne({ _id: user.roomId });
    }

    await connection
      .collection('users')
      .updateOne({ _id: socket.id }, { $set: { roomId: '' } });

    socket.leave(room.name);

    serverResponse.message = `${user.name} leave room.`;
    socket.to(room.name).emit('serverResponse', serverResponse);
    serverResponse.message = `You are leaved ${room.name} room.`;
    socket.emit('serverResponse', serverResponse);
  } catch (err) {
    //TODO handle logs, delete consol.log
    serverResponse.message = 'We have a problem, please try again later.';
    socket.emit('serverResponse', serverResponse);
  }
};

module.exports = {
  leaveRoom,
};
