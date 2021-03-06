const moment = require('moment');
const { dbName } = require('../../config');

const joinToRoom = async (socket, mongoConnection, joinRoomName) => {
  // Create response object
  const serverResponse = {
    from: 'Server',
    message: null,
    date: moment().format('YYYY-MM-DD'),
    time: moment().format('HH:mm:ss'),
    request: 'Join to room',
    requestMessage: joinRoomName,
    isRequestSuccess: null,
  };

  // Return if the user has not provided a room name
  if (joinRoomName === '') {
    serverResponse.message = 'You need pass your room name.';
    serverResponse.isRequestSuccess = false;
    socket.emit('serverResponse', serverResponse);
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
      serverResponse.message =
        'Before join to room you must leave current room.';
      serverResponse.isRequestSuccess = false;
      socket.emit('serverResponse', serverResponse);
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
      serverResponse.message = `You are joind to ${joinRoomName} room.`;
      serverResponse.isRequestSuccess = true;
      socket.emit('serverResponse', serverResponse);
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
      serverResponse.message = `User with this name is already in this room. Choose different name`;
      serverResponse.isRequestSuccess = false;
      socket.emit('serverResponse', serverResponse);
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
    serverResponse.message = `${userName} join to ${roomName} room.`;
    serverResponse.isRequestSuccess = true;
    socket.to(roomName).emit('serverResponse', serverResponse);
    serverResponse.message = `You are joind to ${roomName} room.`;
    socket.emit('serverResponse', serverResponse);
  } catch (err) {
    // Set and emit message
    serverResponse.message = 'We have a problem, please try again later';
    serverResponse.isRequestSuccess = false;
    socket.emit('serverResponse', serverResponse);
    //TODO handle logs
    console.log(err);
  }
};

module.exports = {
  joinToRoom,
};
