const mongoose = require('mongoose');
const User = mongoose.model('Users');
const Room = mongoose.model('Rooms');

const createRoom = async (socket, message) => {
  try {
    const user = await User.findOne({ userSocketId: socket.id }).exec();
    const userName = user.name;
    const room = new Room({
      name: message,
      owner: userName,
      users: [userName],
    });
    await room.save();
    return true;
  } catch (err) {
    console.log(err);
  }
  return false;
};

module.exports = {
  createRoom,
};
