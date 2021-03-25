const { Response } = require('./response');
const { getDatabaseConnection } = require('../mongodb/connection');
const { logger } = require('../winston/config');
const { updateUsersList } = require('./users-in-room');

const changeName = async (socket, newUserName) => {
  const response = new Response();
  response.requestAuthor = socket.id;
  response.data = newUserName;

  if (newUserName === '') {
    response.status = false;
    response.message = 'You need to enter a name before change.';

    socket.emit('changeName', response);

    return;
  }

  try {
    const { _id: userId, name: userName, roomId: userRoomId } = await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('users')
      .findOne({ _id: socket.id });

    if (userRoomId) {
      const isUserNameExists = await getDatabaseConnection()
        .db(process.env.DB_NAME)
        .collection('rooms')
        .findOne({ _id: userRoomId, 'connectedUsers.name': newUserName });

      if (isUserNameExists) {
        response.status = false;
        response.message = 'User with this name is already in this room. Choose different name.';

        socket.emit('changeName', response);

        return;
      }

      await getDatabaseConnection()
        .db(process.env.DB_NAME)
        .collection('users')
        .updateOne({ _id: userId }, { $set: { name: newUserName } });

      await getDatabaseConnection()
        .db(process.env.DB_NAME)
        .collection('rooms')
        .updateOne({ _id: userRoomId, 'connectedUsers.name': userName }, { $set: { 'connectedUsers.$.name': newUserName } });

      const { name: roomName } = await getDatabaseConnection()
        .db(process.env.DB_NAME)
        .collection('rooms')
        .findOne({ _id: userRoomId });

      response.status = true;
      response.message = `${userName} changed name. Current name is ${newUserName}.`;

      socket
        .to(roomName)
        .emit('changeName', response);

      response.message = `Your name is changed. Current name is ${newUserName}.`;

      socket.emit('changeName', response);

      updateUsersList(socket, userRoomId);

      return;
    }

    await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('users')
      .updateOne({ _id: userId }, { $set: { name: newUserName } });

    response.status = true;
    response.message = `Your name is changed. Current name is ${newUserName}.`;

    socket.emit('changeName', response);

    updateUsersList(socket);
  } catch (err) {
    response.status = false;
    response.message = 'We have a problem, please try again later.';

    socket.emit('changeName', response);

    logger.log({ level: 'error', message: err });
  }
};

module.exports = {
  changeName,
};
