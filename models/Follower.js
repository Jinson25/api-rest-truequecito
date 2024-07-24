const mongoose = require('mongoose');

const followerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  follower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true
});

const Follower = mongoose.model('Follower', followerSchema);

module.exports = Follower;
