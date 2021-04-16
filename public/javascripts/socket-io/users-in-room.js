import { socket } from './utilities.js';

const clearUsersInRoomWindow = () => {
  $('#users-in-room-content').html('');
};

const clearUpdateDateWindow = () => {
  $('#users-in-room-content-update').html('');
};

const createUpdateTimeView = (date, time) => {
  const updateContainer = $('#users-in-room-content-update');
  const updateObject = `<p>Last update: ${time} / ${date}</p>`;

  updateContainer.append(updateObject);

  return updateContainer;
};

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

const publishMessageInUsersInRoom = (message, status) => {
  $('#users-in-room').append(createMessageView(message, status));

  const date = moment().format('YYYY-MM-DD');
  const time = moment().format('HH:mm:ss');

  if (status) $('#users-in-room').append(createUpdateTimeView(date, time));
};

socket.on('usersInRoom', (serverResponse) => {
  const { status, message } = serverResponse;

  clearUsersInRoomWindow();

  clearUpdateDateWindow();

  publishMessageInUsersInRoom(message, status);
});

$(document).on('click', '#users-in-room-content-button-update', () => {
  clearUsersInRoomWindow();

  clearUpdateDateWindow();

  socket.emit('manualUpdateUsersList');
});
