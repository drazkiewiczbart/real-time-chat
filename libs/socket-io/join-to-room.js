const { Response } = require('./response');
const { getDatabaseConnection } = require('../mongodb/connection');
const { logger } = require('../winston/config');
const { updateUsersList } = require('./users-in-room');

const joinToRoom = async (socket, joinRoomName) => {
  const response = new Response();
  response.requestAuthor = socket.id;
  response.data = joinRoomName;

  if (joinRoomName === '') {
    response.message = 'You need to enter a room name before create or join.';
    response.status = false;

    socket.emit('joinToRoom', response);

    return;
  }

  try {
    const { _id: userId, name: userName, roomId: userRoomId } = await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('users')
      .findOne({ _id: socket.id });

    if (userRoomId) {
      response.status = false;
      response.message = 'Before joining to new room you must leave current room.';

      socket.emit('joinToRoom', response);

      return;
    }

    const isRoomExists = await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('rooms')
      .findOne({ name: joinRoomName });

    if (!isRoomExists) {
      await getDatabaseConnection()
        .db(process.env.DB_NAME)
        .collection('rooms')
        .insertOne({ name: joinRoomName, connectedUsers: [] });

      const { _id: roomId } = await getDatabaseConnection()
        .db(process.env.DB_NAME)
        .collection('rooms')
        .findOne({ name: joinRoomName });

      await getDatabaseConnection()
        .db(process.env.DB_NAME)
        .collection('rooms')
        .updateOne({ _id: roomId }, { $push: { connectedUsers: { socketId: userId, name: userName } } });

      await getDatabaseConnection()
        .db(process.env.DB_NAME)
        .collection('users')
        .updateOne({ _id: userId }, { $set: { roomId } });

      socket.join(joinRoomName);

      response.status = true;
      response.message = `You joined to ${joinRoomName} room.`;

      socket.emit('joinToRoom', response);

      updateUsersList(socket); // del roomiD

      return;
    }

    const isUserNameUsed = await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('rooms')
      .findOne({ name: joinRoomName, 'connectedUsers.name': userName });

    if (isUserNameUsed) {
      response.status = false;
      response.message = 'User with this name is already in this room. Choose different name.';

      socket.emit('joinToRoom', response);

      return;
    }

    const { _id: roomId, name: roomName } = await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('rooms')
      .findOne({ name: joinRoomName });

    await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('rooms')
      .updateOne({ name: roomName }, { $push: { connectedUsers: { socketId: userId, name: userName } } });

    await getDatabaseConnection()
      .db(process.env.DB_NAME)
      .collection('users')
      .updateOne({ _id: userId }, { $set: { roomId } });

    socket.join(roomName);

    response.message = `${userName} joined to ${roomName} room.`;
    response.status = true;

    socket.to(roomName).emit('joinToRoom', response);

    response.message = `You joined to ${roomName} room.`;

    socket.emit('joinToRoom', response);

    updateUsersList(socket, roomId);
  } catch (err) {
    response.status = false;
    response.message = 'We have a problem, please try again later.';

    socket.emit('joinToRoom', response);

    logger.log({ level: 'error', message: err });
  }
};

module.exports = {
  joinToRoom,
};
