import { socket } from './socket-io-utilities.js';

/*
 ** Clear users list window
 */
const clearUsersInRoomWindow = () => {
  $('#users-in-room-content').html('');
};

/*
 ** Clear update data window
 */
const clearUpdateDateWindow = () => {
  $('#users-in-room-content-update').html('');
};

/*
 ** Create view for update time and date
 */
const createUpdateTimeView = (date, time) => {
  const updateContainer = $('#users-in-room-content-update');
  const updateObject = `<p>Last update: ${time} / ${date}</p>`;
  updateContainer.append(updateObject);
  return updateContainer;
};

/*
 ** Create list of users
 */
const createMessageView = (message, status) => {
  const usersContainer = $('#users-in-room-content');
  let youInContainer;

  if (status) {
    message.forEach((user) => {
      if (user.socketId === socket.id) {
        youInContainer = `<p class="users-in-room-content--you">You</p>`;
      } else {
        usersContainer.append(`<p>${user.name}</p>`);
      }
    });
    usersContainer.prepend(youInContainer);
  } else {
    usersContainer.prepend(
      '<p class="users-in-room-content">We have a problem, please try again later.</p>',
    );
    usersContainer.append(
      `<button id="users-in-room-content-button-update" type="button" class="btn users-in-room-content-button-update">Update list</button>`,
    );
  }
  return usersContainer;
};

/*
 ** Add message view to DOM
 */
const publishMessageInUsersInRoom = (message, date, time, status) => {
  $('#users-in-room').append(createMessageView(message, status));
  if (status) $('#users-in-room').append(createUpdateTimeView(date, time));
};

/*
 ** Main socket io, get server response and show in 'users in room'
 */
socket.on('usersInRoom', (serverResponse) => {
  const { target, message, date, time, data, status } = serverResponse;
  clearUsersInRoomWindow();
  clearUpdateDateWindow();
  publishMessageInUsersInRoom(message, date, time, status);
});

/*
 ** Main socket io, send to server request updateUsersList
 */
$(document).on('click', '#users-in-room-content-button-update', () => {
  clearUsersInRoomWindow();
  clearUpdateDateWindow();
  socket.emit('manualUpdateUsersList');
});
