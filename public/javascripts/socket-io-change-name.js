import {
  socket,
  hideSettings,
  publishMessage,
  scrollWindowMessages,
  createMessageView,
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
 ** Main socket io, get server response for changeName request
 */
socket.on('changeName', (serverResponse) => {
  const { requestAuthor, message, date, time, data, status } = serverResponse;

  if (status && requestAuthor === socket.id) changeDisplayName(data);

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
