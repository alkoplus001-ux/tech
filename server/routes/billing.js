const router   = require('express').Router();
const mongoose = require('mongoose');
const { mem }  = require('../db');

const useMongo = () => mongoose.connection.readyState === 1;
const Invoice  = () => useMongo() ? require('../models/Invoice') : null;

const calcTotals = (items, gstRate = 18) => {
  const subtotal = items.reduce((s, i) => s + (Number(i.qty)||0) * (Number(i.price)||0), 0);
  const gstAmt   = parseFloat(((subtotal * gstRate) / 100).toFixed(2));
  return { subtotal, gstAmt, total: parseFloat((subtotal + gstAmt).toFixed(2)) };
};

router.get('/', async (req, res) => {
  try {
    const data = useMongo()
      ? await Invoice().find().sort({ createdAt: -1 })
      : mem.invoices.find();
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { customer, phone, items, gstRate = 18, dueDate } = req.body;
    const { subtotal, gstAmt, total } = calcTotals(items, gstRate);
    let doc;
    if (useMongo()) {
      const count     = await Invoice().countDocuments();
      const invoiceNo = `TN-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
      doc = await Invoice().create({ invoiceNo, customer, phone, items, subtotal, gstRate, gstAmt, total, dueDate });
    } else {
      const count     = mem.invoices.count();
      const invoiceNo = `TN-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
      doc = mem.invoices.create({ invoiceNo, customer, phone, items, subtotal, gstRate, gstAmt, total, dueDate });
    }
    res.json({ success: true, data: doc });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const doc = useMongo()
      ? await Invoice().findByIdAndUpdate(req.params.id, { status }, { new: true })
      : mem.invoices.update(req.params.id, { status });
    res.json({ success: true, data: doc });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    if (useMongo()) await Invoice().findByIdAndDelete(req.params.id);
    else            mem.invoices.delete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
