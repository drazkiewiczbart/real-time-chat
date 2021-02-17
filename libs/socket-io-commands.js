const serverName = 'Server';
const commandList = {
  setname: 'setname',
  changename: 'changename',
  checkname: 'checkname',
  jointoroom: 'jointoroom',
  leaveroom: 'leaveroom',
  whereami: 'whereami',
};

const serverMsg = (msg) => {
  return `${serverName}: ${msg}`;
};

const whereami = (defaultRoom, currentRoom) => {
  let msg = '';
  if (defaultRoom === currentRoom) {
    msg = `You are in room default room.`;
  } else {
    msg = `You are in room ${currentRoom}.`;
  }
  return msg;
};

const parseCommand = (socket, command, property) => {
  const userSession = socket.request.session.user;
  let msg = '';

  switch (command) {
    case commandList.setname:
    case commandList.changename: {
      if (!property) {
        msg = 'Error no property';
      } else {
        userSession.name = property;
        msg = `Name is changed to ${property}`;
      }
      break;
    }
    case commandList.checkname: {
      msg = `Your name is ${userSession.name}.`;
      break;
    }
    case commandList.jointoroom: {
      if (!property) {
        msg = 'Error no property';
      } else {
        userSession.currentRoom = property;
        msg = whereami(userSession.defaultRoom, userSession.currentRoom);
      }
      break;
    }
    case commandList.leaveroom: {
      if (userSession.defaultRoom === userSession.currentRoom) {
        msg = `You cannot leave default room.`;
      } else {
        userSession.currentRoom = userSession.defaultRoom;
        msg = `You are in room default room.`;
      }
      break;
    }
    case commandList.whereami: {
      msg = whereami(userSession.defaultRoom, userSession.currentRoom);
      break;
    }
    default: {
      msg = `Error command!`;
      console.log(socket.request.session);
    }
  }
  return serverMsg(msg);
};

module.exports = {
  parseCommand,
};
