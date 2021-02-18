const moment = require('moment');

const whereami = (defaultRoom, currentRoom) => {
  let msg;
  if (defaultRoom === currentRoom) {
    msg = `You are in room default room.`;
  } else {
    msg = `You are in room ${currentRoom}.`;
  }
  return msg;
};

const normalizeCommand = (clientCommand) => {
  const [command, property] = clientCommand.split(' ');
  const commandRemoveSpecialChars = command.replace(/\$/g, '');
  const commandLowerCase = commandRemoveSpecialChars.toLowerCase();
  return [commandLowerCase, property];
};

const commandList = {
  setname: 'setname',
  changename: 'changename',
  checkname: 'checkname',
  jointoroom: 'jointoroom',
  leaveroom: 'leaveroom',
  whereami: 'whereami',
};

const parseCommand = (socket, clientCommand) => {
  const [command, property] = normalizeCommand(clientCommand);
  const userSession = socket.request.session.user;
  let msg;

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
    }
  }
  return ['Server', msg];
};

module.exports = {
  parseCommand,
};

const parseClientMsg = (socket, clientMsg) => {
  const commandPattern = /\${1}\w+\${1}/;
  if (clientMsg.match(commandPattern)) {
    return parseCommand(socket, clientMsg);
  }
  return [socket.request.session.user.name, clientMsg];
};

const addUserObjectToSession = (socket) => {
  const [defaultRoom] = socket.rooms;
  const defaultUserObject = {
    name: 'New user',
    defaultRoom,
    currentRoom: defaultRoom,
  };

  socket.request.session.user = defaultUserObject;
};

module.exports = async (io) => {
  io.on('connection', (socket) => {
    if (!socket.require) {
      addUserObjectToSession(socket);
    }
    socket.on('clientMsg', (clientMsg) => {
      const serverResponse = parseClientMsg(socket, clientMsg);
      serverResponse.push(moment().format('YYYY-MM-DD'));
      serverResponse.push(moment().format('HH:mm:ss'));
      io.emit('serverMsg', serverResponse);
    });
  });
};
