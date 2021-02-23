const mongoose = require('mongoose');
const Room = mongoose.model('Rooms');

const createRoom = async (session, roomName) => {
  try {
    const room = new Room({
      name: roomName,
      owner: session.userData.name,
      users: [session.userData.name],
    });
    await room.save();

    session.userData.additionalRoom = roomName;
    session.save();

    return true;
  } catch (err) {
    console.log(err);
  }
  return false;
};

module.exports = {
  createRoom,
};
