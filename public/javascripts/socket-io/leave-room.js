import { socket, hideSettings, publishMessage, scrollWindowMessages, clearMessageWindow, createMessageView } from './utilities.js';

const restoreLeaveRoomView = () => {
  $('#settings-content-room').text('Private/Default');
  $('#settings-content-actions-input-button-leave').prop('disabled', true);
};

socket.on('leaveRoom', (serverResponse) => {
  const { status, requestAuthor, message } = serverResponse;

  if (status && requestAuthor === socket.id) {
    restoreLeaveRoomView();

    clearMessageWindow();
  }

  const messageView = createMessageView(message);

  publishMessage(messageView);

  scrollWindowMessages();
});

$('#settings-content-actions-input-button-leave').click(() => {
  socket.emit('leaveRoom');

  hideSettings();
});
