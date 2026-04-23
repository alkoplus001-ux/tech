const mongoose = require('mongoose');
const employeeSchema = new mongoose.Schema({
  empId:       String,
  name:        { type: String, required: true },
  department:  String,
  position:    String,
  phone:       String,
  email:       String,
  salary:      Number,
  joiningDate: { type: Date, default: Date.now },
  status:      { type: String, enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' },
}, { timestamps: true });
module.exports = mongoose.model('Employee', employeeSchema);
