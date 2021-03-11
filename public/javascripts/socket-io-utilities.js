/*
 ** Socket
 */
const socket = io();

/*
 ** Hide settings window
 */
const hideSettings = () => {
  $('#menu-content-messages-icon').toggleClass(
    'menu-content-icon-message--active',
  );
  $('#menu-content-settings-icon').toggleClass(
    'menu-content-icon-settings--active',
  );
  $('#header-content-title').text('Messages');
  $('#settings').toggleClass('settings--hide');
  $('#messages').toggleClass('messages--hide');
  $('#footer').toggleClass('footer--hide');
};

/*
 ** Add message view to DOM
 */
const publishMessage = (messageView) => {
  $(messageView).appendTo($('#messages-content'));
};

/*
 ** Scroll window to bottom after new message is display
 */
const scrollWindowMessages = () => {
  $('#messages').scrollTop($('#messages')[0].scrollHeight);
};

/*
 ** Clear message windows
 */
const clearMessageWindow = () => {
  $('#messages-content').html('');
};

/*
 ** New message template generator
 */
const createMessageView = (message, date, time, from = 'Chat bot') => {
  const isMessageFromServer =
    from === 'Chat bot' ? 'messages-content-single--server' : '';

  const messageView = `
    <div class="messages-content-single ${isMessageFromServer}">
      <div class="messages-content-single-from-when-wrapper">
        <p class="messages-content-single-from">${from}</p>
        <p class="messages-content-single-when">${time} / ${date}</p>
      </div>
      <p class="messages-content-single-text">
        ${message}
      </p>
    </div>
  `;
  return messageView;
};

export {
  socket,
  hideSettings,
  publishMessage,
  scrollWindowMessages,
  clearMessageWindow,
  createMessageView,
};
