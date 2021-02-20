const { Mongoose } = require('mongoose');

module.exports = (mongoose) => {
  const { Schema } = mongoose;

  const roomSchema = new Schema({
    name: { type: String },
    owner: { type: String },
    users: [],
  });

  return mongoose.model('Rooms', roomSchema);
};
