import { socket } from './socket-io-utilities.js';

/*
 ** Clear users list window
 */
const clearUsersInRoomWindow = () => {
  $('#users-in-room').html('');
};

/*
 ** Create view for update time and date
 */
const createUpdateTimeView = (date, time) => {
  const updateContainer = $(
    '<div class="col col-md-9 users-in-room-content-update"></div>',
  );
  const updateObject = `<p>Last update: ${time} / ${date}</p>`;
  updateContainer.append(updateObject);
  return updateContainer;
};

/*
 ** Create list of users
 */
const createMessageView = (message) => {
  const usersContainer = $(
    '<div id="users-in-room-content" class="col col-md-9 users-in-room-content"></div>',
  );
  let youInContainer;

  message.forEach((user) => {
    if (user.socketId === socket.id) {
      youInContainer = `<p class="users-in-room-content--you">You</p>`;
    } else {
      usersContainer.append(`<p>${user.name}</p>`);
    }
  });
  usersContainer.prepend(youInContainer);
  return usersContainer;
};

/*
 ** Add message view to DOM
 */
const publishMessageInUsersInRoom = (message, date, time) => {
  $('#users-in-room').append(createMessageView(message));
  $('#users-in-room').append(createUpdateTimeView(date, time));
};

/*
 ** Main socket io, get server response and show in 'users in room'
 */
socket.on('usersInRoom', (serverResponse) => {
  const { target, message, date, time, data, status } = serverResponse;
  clearUsersInRoomWindow();
  publishMessageInUsersInRoom(message, date, time);
});
