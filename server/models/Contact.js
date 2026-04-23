const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String, trim: true, default: '' },
  business: { type: String, trim: true, default: '' },
  message: { type: String, trim: true, default: '' },
  source: { type: String, default: 'Website Demo' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
