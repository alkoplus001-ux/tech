const mongoose = require('mongoose');
const invoiceSchema = new mongoose.Schema({
  invoiceNo: String,
  customer:  { type: String, required: true },
  phone:     String,
  items: [{
    name:  String,
    qty:   Number,
    price: Number,
  }],
  subtotal: Number,
  gstRate:  { type: Number, default: 18 },
  gstAmt:   Number,
  total:    Number,
  status:   { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
  dueDate:  { type: Date },
}, { timestamps: true });
module.exports = mongoose.model('Invoice', invoiceSchema);
