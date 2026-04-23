const router   = require('express').Router();
const mongoose = require('mongoose');
const { mem }  = require('../db');

const useMongo  = () => mongoose.connection.readyState === 1;
const Employee  = () => useMongo() ? require('../models/Employee') : null;

router.get('/', async (req, res) => {
  try {
    const { search, department } = req.query;
    let data;
    if (useMongo()) {
      const filter = {};
      if (search)     filter.name       = { $regex: search, $options: 'i' };
      if (department && department !== 'All') filter.department = department;
      data = await Employee().find(filter).sort({ createdAt: -1 });
    } else {
      const filter = {};
      if (search)     filter.name       = { $regex: search };
      if (department && department !== 'All') filter.department = department;
      data = mem.employees.find(filter);
    }
    res.json({ success: true, data });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post('/', async (req, res) => {
  try {
    let doc;
    if (useMongo()) {
      const count = await Employee().countDocuments();
      const empId = `TN-EMP-${String(count + 1).padStart(3, '0')}`;
      doc = await Employee().create({ ...req.body, empId, salary: Number(req.body.salary) });
    } else {
      const count = mem.employees.count();
      const empId = `TN-EMP-${String(count + 1).padStart(3, '0')}`;
      doc = mem.employees.create({ ...req.body, empId, salary: Number(req.body.salary) });
    }
    res.json({ success: true, data: doc });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const doc = useMongo()
      ? await Employee().findByIdAndUpdate(req.params.id, req.body, { new: true })
      : mem.employees.update(req.params.id, req.body);
    res.json({ success: true, data: doc });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    if (useMongo()) await Employee().findByIdAndDelete(req.params.id);
    else            mem.employees.delete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
