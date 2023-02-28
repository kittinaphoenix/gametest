const mongoose = require('mongoose');

const dialogSchema = new mongoose.Schema({
  //userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  userDialog: { type: String, required: true },
  answerName: { type: String, required: true },
  //timelineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Timeline', required: true },
  answerDialog: { type: String, required: true },
});

module.exports = mongoose.model('Dialog', dialogSchema);
