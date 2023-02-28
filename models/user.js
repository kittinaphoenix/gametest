const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  level: { type: Number, required: true },
  timelines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Timeline' }],
  nickname: { type: String, required: true },
  actualTarget: { type: String, required: true },
  language: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
