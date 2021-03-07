import { socket } from './socket-io-utilities.js';

/*
 ** Clear Users in room window
 */
const clearUsersInRoomWindow = () => {
  $('#users-in-room').html('');
};

/*
 ** Main socket io, get server response and show in users in room
 */
const createMessageView = (target, message) => {
  const messageView = $(
    '<div id="users-in-room-content" class="col users-in-room-content">',
  );

  for (const user of message) {
    const isUser = target === socket.id ? 'users-in-room-content--you' : '';
    messageView.append(`<p class="${isUser}">${user.name}</p>`);
  }
  return messageView;
};

/*
 ** Add message view to DOM
 */
const publishMessageInUsersInRoom = (messageView, date, time) => {
  $('#users-in-room').append(messageView);
  $('#users-in-room').append(
    `<div class="col users-in-room-content-update"><p>Last update: ${time} / ${date}</p></div>`,
  );
};

/*
 ** Main socket io, get server response and show in 'users in room'
 */
socket.on('usersInRoom', (serverResponse) => {
  const { target, message, date, time, data, status } = serverResponse;
  const messageView = createMessageView(target, message);
  clearUsersInRoomWindow();
  publishMessageInUsersInRoom(messageView, date, time);
});
