import {
  socket,
  hideSettings,
  publishMessage,
  scrollWindowMessages,
  clearMessageWindow,
  createMessageView,
} from './socket-io-utilities.js';

/*
 ** Restore display room to default and disable button "leave"
 */
const restoreLeaveRoomView = () => {
  $('#settings-content-room').text('Private/Default');
  $('#settings-content-actions-input-button-leave').prop('disabled', true);
};

/*
 ** Main socket io, get server response for leaveRoom request
 */
socket.on('leaveRoom', (serverResponse) => {
  const { requestAuthor, message, date, time, data, status } = serverResponse;

  if (status && requestAuthor === socket.id) {
    restoreLeaveRoomView();
    clearMessageWindow();
  }

  const messageView = createMessageView(message, date, time);
  publishMessage(messageView);
  scrollWindowMessages();
});

/*
 ** Main socket io, send to server request leaveRoom
 */
$('#settings-content-actions-input-button-leave').click(() => {
  socket.emit('leaveRoom');
  hideSettings();
});
