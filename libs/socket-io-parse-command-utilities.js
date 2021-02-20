const mongoose = require('mongoose');
const User = mongoose.model('Users');
const Room = mongoose.model('Rooms');

const setName = async (socket, property) => {
  if (!property) {
    return 'Error no property.';
  }
  try {
    const isUserInDatabase = await User.findOne({ name: property }).exec();
    if (!isUserInDatabase) {
      const user = await User.findOne({ userSocketId: socket.id }).exec();
      user.name = property;
      await user.save();
      return 'Name is changed.';
    }
  } catch (err) {
    console.log(err);
  }
  return 'This name is used.';
};

const createRoom = async (user, property) => {
  const room = new Room({
    name: property,
    owner: user.name,
    users: [user.name],
  });
  try {
    await room.save();
  } catch (err) {
    console.log(err);
  }
};

const joinToRoom = async (socket, property) => {
  if (!property) {
    return 'Error no property.';
  }
  try {
    const user = await User.findOne({ userSocketId: socket.id }).exec();
    if (user.name === 'New user') {
      return 'Before join to room, set name.';
    }
    if (user.additionalRoom === property) {
      return 'You are in this room.';
    }
    const isRoomInDatabase = await Room.findOne({ name: property }).exec();
    if (!isRoomInDatabase) {
      await createRoom(user, property);
      user.additionalRoom = property;
      await user.save();
      socket.join(property);
    } else if (isRoomInDatabase.users.includes(user.name)) {
      return 'Someone in this run has this same name as you, change name and join';
    } else {
      isRoomInDatabase.users.push(user.name);
      await isRoomInDatabase.save();
      user.additionalRoom = property;
      await user.save();
      socket.join(property);
    }
  } catch (err) {
    console.log(err);
  }
  return `You are now in ${property} room`;
};

const leaveRoom = async (socket) => {
  try {
    const user = await User.findOne({ userSocketId: socket.id }).exec();
    if (user.additionalRoom === '') {
      return `You cannot leave default room.`;
    }
    const room = await Room.findOne({
      name: user.additionalRoom,
    }).exec();
    room.users = room.users.filter((el) => el !== user.name);
    if (room.users.length === 0) {
      await Room.deleteOne({ name: user.additionalRoom });
    } else {
      await room.save();
    }
    socket.leave(user.additionalRoom);
    user.additionalRoom = '';
    await user.save();
  } catch (err) {
    console.log(err);
  }
  return `You are leave room and now you are in default room.`;
};

const whereAmI = async (socket) => {
  const user = await User.findOne({ userSocketId: socket.id }).exec();
  if (user.additionalRoom === '') {
    return 'You are in default room';
  }
  return `You are in ${user.additionalRoom} room.`;
};

const checkName = async (socket) => {
  const user = await User.findOne({ userSocketId: socket.id }).exec();
  return `Your name is ${user.name}.`;
};

module.exports = {
  setName,
  joinToRoom,
  leaveRoom,
  whereAmI,
  checkName,
};
