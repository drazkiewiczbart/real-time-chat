const moment = require('moment');
const { dbName } = require('../../config');
const { updateUserInRoomList } = require('./socket-io-users-in-room');

const joinToRoom = async (socket, mongoConnection, joinRoomName) => {
  // Create response object
  const response = {
    target: socket.id,
    message: null,
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
    data: joinRoomName,
    status: null,
  };

  // Return if the user has not provided a room name
  if (joinRoomName === '') {
    response.message = 'You need give room name before create or join.';
    response.status = false;
    socket.emit('joinToRoom', response);
    return;
  }

  try {
    // Get user from database
    const {
      _id: userId,
      name: userName,
      roomId: userRoomId,
    } = await mongoConnection
      .db(dbName)
      .collection('users')
      .findOne({ _id: socket.id });

    // Return if user is current in room
    if (userRoomId) {
      response.message = 'Before join to new room you must leave current room.';
      response.status = false;
      socket.emit('joinToRoom', response);
      return;
    }

    // If user isn't current in room, check if room exists
    const isRoomExists = await mongoConnection
      .db(dbName)
      .collection('rooms')
      .findOne({ name: joinRoomName });

    // Create room if no exists
    if (!isRoomExists) {
      await mongoConnection.db(dbName).collection('rooms').insertOne({
        name: joinRoomName,
        connectedUsers: [],
      });

      // Get created room from database
      const { _id: roomId } = await mongoConnection
        .db(dbName)
        .collection('rooms')
        .findOne({ name: joinRoomName });

      // Add user to room in database
      await mongoConnection
        .db(dbName)
        .collection('rooms')
        .updateOne(
          { _id: roomId },
          { $push: { connectedUsers: { socketId: userId, name: userName } } },
        );

      // Add room to user in database
      await mongoConnection
        .db(dbName)
        .collection('users')
        .updateOne({ _id: userId }, { $set: { roomId } });

      // Join to room
      socket.join(joinRoomName);

      // Set and emit message, return
      response.message = `You are joined to ${joinRoomName} room.`;
      response.status = true;
      socket.emit('joinToRoom', response);

      // Emit list users in room
      updateUserInRoomList(socket, mongoConnection, roomId);
      return;
    }

    // If room exists, check if name in exists room is used
    const isUserNameUsed = await mongoConnection
      .db(dbName)
      .collection('rooms')
      .findOne({
        name: joinRoomName,
        'connectedUsers.name': userName,
      });

    // Return if name is used
    if (isUserNameUsed) {
      response.message = `User with this name is already in this room. Choose different name.`;
      response.status = false;
      socket.emit('joinToRoom', response);
      return;
    }

    // Get room from database
    const { _id: roomId, name: roomName } = await mongoConnection
      .db(dbName)
      .collection('rooms')
      .findOne({ name: joinRoomName });

    // Add user to room in database
    await mongoConnection
      .db(dbName)
      .collection('rooms')
      .updateOne(
        { name: roomName },
        { $push: { connectedUsers: { socketId: userId, name: userName } } },
      );

    // Add room to user in database
    await mongoConnection
      .db(dbName)
      .collection('users')
      .updateOne({ _id: userId }, { $set: { roomId } });

    // Join to room
    socket.join(roomName);

    // Set and emit message
    response.message = `${userName} joined to ${roomName} room.`;
    response.status = true;
    socket.to(roomName).emit('joinToRoom', response);
    response.message = `You are joined to ${roomName} room.`;
    socket.emit('joinToRoom', response);

    // Emit list users in room
    updateUserInRoomList(socket, mongoConnection, roomId);
  } catch (err) {
    // Set and emit message
    response.message = 'We have a problem, please try again later.';
    response.isRequestSuccess = false;
    socket.emit('joinToRoom', response);
    //TODO handle logs
    console.log(err);
  }
};

module.exports = {
  joinToRoom,
};
