const { getChatRoom } = require('../controllers/chat-room-controller');

module.exports = (app) => {
  app.get('/', getChatRoom);
};
