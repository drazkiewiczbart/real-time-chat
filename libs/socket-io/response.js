const moment = require('moment');

class Response {
  constructor() {
    this.status = null;
    this.requestAuthor = null;
    this.message = null;
    this.from = null;
    this.data = null;
    this.date = moment().format('YYYY-MM-DD');
    this.time = moment().format('HH:mm:ss');
  }
}

module.exports = {
  Response,
};
