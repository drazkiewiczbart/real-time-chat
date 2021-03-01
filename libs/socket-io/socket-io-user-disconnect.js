const moment = require('moment');

const userDisconnect = async (socket, connection) => {
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
      await connection.collection('users').deleteOne({ _id: user._id });
      return;
    }

    await connection.collection('users').deleteOne({ _id: user.id });

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
      return;
    }

    serverResponse.message = `${user.name} disconnected.`;
    socket.to(room.name).emit('serverResponse', serverResponse);
  } catch (err) {
    //TODO handle logs, delete consol.log
  }
};

module.exports = {
  userDisconnect,
};
