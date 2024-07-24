const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true },
  approved: { type: Boolean, default: false },
  estado: { type: String, required: true },
  preference: { type: String, required: true },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
