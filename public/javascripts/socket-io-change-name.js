import {
  socket,
  hideSettings,
  publishMessage,
  scrollWindowMessages,
} from './socket-io-utilities.js';

/*
 ** Restore change name input
 */
const restoreChangeNameInput = () => {
  $('#settings-content-actions-input-text-name').val('');
  $('#settings-content-actions-input-button-name').prop('disabled', true);
};

/*
 ** Change display name if user change name
 */
const changeDisplayName = (name) => {
  $('#settings-content-name').text(name);
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
socket.on('changeName', (serverResponse) => {
  const { target, message, date, time, data, status } = serverResponse;

  if (status && target === socket.id) changeDisplayName(data);

  const messageView = createMessageView(message, date, time);
  publishMessage(messageView);
  scrollWindowMessages();
});

/*
 ** Main socket io, send to server request changeName
 */
$('#settings-content-actions-input-button-name').click((event) => {
  event.preventDefault();
  const newName = $('#settings-content-actions-input-text-name').val();
  socket.emit('changeName', newName);
  hideSettings();
  restoreChangeNameInput();
});
