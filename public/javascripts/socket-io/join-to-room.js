import { socket, hideSettings, publishMessage, scrollWindowMessages, clearMessageWindow, createMessageView } from './utilities.js';

const restoreJoinToRoomInput = () => {
  $('#settings-content-actions-input-text').val('');
  $('#settings-content-actions-input-button-join').prop('disabled', true);
};

const changeDisplayRoom = (name) => {
  $('#settings-content-room').text(name);
  $('#settings-content-actions-input-button-leave').prop('disabled', false);
};

socket.on('joinToRoom', (serverResponse) => {
  const { status, requestAuthor, message, data, date, time } = serverResponse;

  if (status && requestAuthor === socket.id) {
    changeDisplayRoom(data);

    clearMessageWindow();
  }

  const messageView = createMessageView(message, date, time);

  publishMessage(messageView);

  scrollWindowMessages();
});

$('#settings-content-actions-input-button-join').click((event) => {
  event.preventDefault();

  const newRoomName = $('#settings-content-actions-input-text').val();

  socket.emit('joinToRoom', newRoomName);

  restoreJoinToRoomInput();

  hideSettings();
});
