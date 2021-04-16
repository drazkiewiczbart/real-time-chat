// const moment = require('moment');

class Response {
  constructor() {
    this.status = null;
    this.requestAuthor = null;
    this.message = null;
    this.from = null;
    this.data = null;
  }
}

module.exports = {
  Response,
};
