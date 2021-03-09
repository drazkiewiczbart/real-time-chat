import {
  socket,
  hideSettings,
  publishMessage,
  scrollWindowMessages,
  clearMessageWindow,
  createMessageView,
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
 ** Main socket io, get server response for changeName request
 */
socket.on('joinToRoom', (serverResponse) => {
  const { requestAuthor, message, date, time, data, status } = serverResponse;

  if (status && requestAuthor === socket.id) {
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
