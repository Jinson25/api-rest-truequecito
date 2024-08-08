const mongoose = require('mongoose');

const InfoSchema = new mongoose.Schema({
    history: {
      type: String,
      required: true,
    },
    vision: {
      type: String,
      required: true
    },
    mission: {
      type: String,
      required: true
    },
    team: {
      type: String,
      required: true
    },
  });
  
  module.exports = mongoose.model('Info', InfoSchema);