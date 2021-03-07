/*
 ** Socket
 */
const socket = io();

/*
 ** Hide settings window
 */
const hideSettings = () => {
  $('#menu-content-messages-icon').toggleClass('menu-content-icon--active');
  $('#menu-content-settings-icon').toggleClass('menu-content-icon--active');
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

export {
  socket,
  hideSettings,
  publishMessage,
  scrollWindowMessages,
  clearMessageWindow,
};
