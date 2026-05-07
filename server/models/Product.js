const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  sku:      { type: String, default: '' },
  category: { type: String, default: 'General' },
  stock:    { type: Number, default: 0 },
  price:    { type: Number, default: 0 },
  supplier: { type: String, default: '' },
  status:   { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock' },
  imageUrl: { type: String, default: '' },
  specs:    { type: String, default: '' },
  sizes:    { type: String, default: '' },
  minOrder: { type: String, default: '' },
}, { timestamps: true });
module.exports = mongoose.model('Product', productSchema);
