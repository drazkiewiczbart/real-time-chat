const { Response } = require('./response');
const { getDatabaseConnection } = require('../mongodb/connection');
const { logger } = require('../winston/config');

const updateUsersList = async (socket, userRoomId = null) => {
  const response = new Response();
  response.requestAuthor = socket.id;

  try {
    const isUserExists = await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('users')
      .findOne({ _id: socket.id });

    const isRoomExists = await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('rooms')
      .findOne({ _id: userRoomId });

    const isUserInRoom = await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('rooms')
      .findOne({ _id: userRoomId, 'connectedUsers.socketId': socket.id });

    if (!isUserExists && isRoomExists) {
      const { name: roomName, connectedUsers: usersInRoom } = await getDatabaseConnection()
        .db(process.env.DB_NAME)
        .collection('rooms')
        .findOne({ _id: userRoomId });

      response.status = true;
      response.message = usersInRoom;

      socket
        .to(roomName)
        .emit('usersInRoom', response);

      return;
    }

    if (!isRoomExists) {
      const { _id: userId, name: userName } = await getDatabaseConnection()
        .db(process.env.DB_NAME)
        .collection('users')
        .findOne({ _id: socket.id });

      response.status = true;
      response.message = [{ socketId: userId, name: userName }];

      socket.emit('usersInRoom', response);

      return;
    }

    if (isRoomExists && !isUserInRoom) {
      const { _id: userId, name: userName } = await getDatabaseConnection()
        .db(process.env.DB_NAME)
        .collection('users')
        .findOne({ _id: socket.id });

      const { name: roomName, connectedUsers: usersInRoom } = await getDatabaseConnection()
        .db(process.env.DB_NAME)
        .collection('rooms')
        .findOne({ _id: userRoomId });

      response.status = true;
      response.message = usersInRoom;

      socket.to(roomName).emit('usersInRoom', response);

      response.message = [{ socketId: userId, name: userName }];

      socket.emit('usersInRoom', response);

      return;
    }

    const { name: roomName, connectedUsers: usersInRoom } = await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('rooms')
      .findOne({ _id: userRoomId });

    response.status = true;
    response.message = usersInRoom;

    socket
      .to(roomName)
      .emit('usersInRoom', response);

    socket.emit('usersInRoom', response);
  } catch (err) {
    response.status = false;
    response.message = 'We have a problem, please check list again later.';

    socket.emit('usersInRoom', response);

    logger.log({ level: 'error', message: `Users-in-room error. ${err}` });
  }
};

const manualUpdateUsersList = async (socket) => {
  const response = new Response();
  response.requestAuthor = socket.id;

  try {
    const { _id: userId, name: userName, roomId: userRoomId } = await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('users')
      .findOne({ _id: socket.id });

    if (!userRoomId) {
      response.status = true;
      response.message = [{ socketId: userId, name: userName }];

      socket.emit('usersInRoom', response);

      return;
    }

    const { connectedUsers: usersInRoom } = await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('rooms')
      .findOne({ _id: userRoomId });

    response.status = true;
    response.message = usersInRoom;

    socket.emit('usersInRoom', response);
  } catch (err) {
    response.status = false;
    response.message = 'We have a problem, please try again later.';
    response.from = 'Chat bot';

    socket.emit('sendMessage', response);

    logger.log({ level: 'error', message: `Users-in-room error. ${err}` });
  }
};

module.exports = {
  updateUsersList,
  manualUpdateUsersList,
};
