import {
  socket,
  hideSettings,
  publishMessage,
  scrollWindowMessages,
  clearMessageWindow,
} from './socket-io-utilities.js';

/*
 ** Restore display room to default and disable button "leave"
 */
const restoreLeaveRoomView = () => {
  $('#settings-content-room').text('Private/Default');
  $('#settings-content-actions-input-button-leave').prop('disabled', true);
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
 ** Main socket io, get server response for leaveRoom request
 */
socket.on('leaveRoom', (serverResponse) => {
  const { target, message, date, time, data, status } = serverResponse;

  if (status && target === socket.id) {
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
