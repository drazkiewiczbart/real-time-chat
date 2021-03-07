import {
  socket,
  hideSettings,
  publishMessage,
  scrollWindowMessages,
  clearMessageWindow,
} from './socket-io-utilities.js';

/*
 ** Restore join to room input
 */
const restoreJoinToRoomInput = () => {
  $('#settings-content-actions-input-text').val('');
  $('#settings-content-actions-input-button-join').prop('disabled', true);
};

/*
 ** Change room name and enable button "leave" if user change room
 */
const changeDisplayRoom = (name) => {
  $('#settings-content-room').text(name);
  $('#settings-content-actions-input-button-leave').prop('disabled', false);
};

/*
 ** New message template generator
 */
const createMessageView = (message, date, time) => {
  const messageView = `
    <div class="messages-content-single 'messages-content-single--server'">
      <div class="messages-content-single-from-when-wrapper">
        <p class="messages-content-single-from">Chat bot</p>
        <p class="messages-content-single-when">${time} / ${date}</p>
      </div>
      <p class="messages-content-single-text">
        ${message}
      </p>
    </div>
  `;
  return messageView;
};

/*
 ** Main socket io, get server response for changeName request
 */
socket.on('joinToRoom', (serverResponse) => {
  const { target, message, date, time, data, status } = serverResponse;

  if (status && target === socket.id) {
    changeDisplayRoom(data);
    clearMessageWindow();
  }

  const messageView = createMessageView(message, date, time);
  publishMessage(messageView);
  scrollWindowMessages();
});

/*
 ** Main socket io, send to server request joinToRoom
 */
$('#settings-content-actions-input-button-join').click((event) => {
  event.preventDefault();
  const newRoomName = $('#settings-content-actions-input-text').val();
  socket.emit('joinToRoom', newRoomName);
  restoreJoinToRoomInput();
  hideSettings();
});
