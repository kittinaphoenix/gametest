const mongoose = require('mongoose');

const timelineSchema = new mongoose.Schema({
  fullName: { type: String },
  lastName: { type: String },
  birthYear: { type: Number },
  birthMonth: { type: Number },
  birthDay: { type: Number },
  deathYear: { type: Number },
  deathMonth: { type: Number },
  deathDay: { type: Number },
  literatureType: { type: String }
});

module.exports = mongoose.model('Timeline', timelineSchema);
