module.exports = (mongoose) => {
  const { Schema } = mongoose;

  const userSchema = new Schema({
    userSocketId: { type: String },
    name: { type: String },
    defaultRoom: { type: String },
    additionalRoom: { type: String, default: '' },
  });

  return mongoose.model('Users', userSchema);
};
