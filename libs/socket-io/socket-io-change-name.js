const moment = require('moment');

const changeName = async (socket, connection, newUserName) => {
  const serverResponse = {
    from: 'Server',
    message: '',
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
  };

  if (!newUserName) {
    serverResponse.message = 'You need pass your name.';
    socket.emit('serverResponse', serverResponse);
    return;
  }

  try {
    const user = await connection
      .collection('users')
      .findOne({ _id: socket.id });

    if (user.roomId) {
      const isNameExists = await connection
        .collection('rooms')
        .findOne({ _id: user.roomId, users: { name: newUserName } });

      if (isNameExists) {
        serverResponse.message = `User with this name is already in this room. Choose different name.`;
        socket.emit('serverResponse', serverResponse);
        return;
      }

      const oldUserName = user.name;
      await connection
        .collection('users')
        .update({ _id: socket.id }, { $set: { name: newUserName } });

      const room = await connection
        .collection('rooms')
        .findOne({ _id: user.roomId });

      serverResponse.message = `${oldUserName} changed name. Current name is ${newUserName}.`;
      socket.to(room.name).emit('serverResponse', serverResponse);
      serverResponse.message = `Your name is changed. Current name is ${newUserName}.`;
      socket.emit('serverResponse', serverResponse);
      return;
    }

    await connection
      .collection('users')
      .updateOne({ _id: socket.id }, { $set: { name: newUserName } });

    serverResponse.message = `Your name is changed. Current name is ${newUserName}.`;
    socket.emit('serverResponse', serverResponse);
  } catch (err) {
    serverResponse.message = 'We have a problem, please try again later.';
    socket.emit('serverResponse', serverResponse);
    //TODO handle logs, delete consol.log
    console.log(err);
  }
};

module.exports = {
  changeName,
};
