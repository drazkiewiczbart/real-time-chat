const createRoom = async (socket, connection, roomName) => {
  try {
    const user = await connection
      .collection('users')
      .findOne({ _id: socket.id });

    await connection.collection('rooms').insertOne({
      name: roomName,
      connectedUsers: [{ socketId: user._id, name: user.name }],
    });

    return true;
  } catch (err) {
    //TODO handle logs
    return false;
  }
};

module.exports = {
  createRoom,
};
