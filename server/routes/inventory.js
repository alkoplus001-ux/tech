const router   = require('express').Router();
const mongoose = require('mongoose');
const { mem }  = require('../db');

const isProd   = process.env.NODE_ENV === 'production';
const useMongo = () => mongoose.connection.readyState === 1;
const Product  = () => useMongo() ? require('../models/Product') : null;

const calcStatus = (stock) => stock <= 0 ? 'Out of Stock' : stock <= 10 ? 'Low Stock' : 'In Stock';

// Escape special regex characters to prevent ReDoS / injection
const escRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/', async (req, res) => {
  try {
    const search   = typeof req.query.search   === 'string' ? req.query.search.trim().slice(0, 100)   : '';
    const category = typeof req.query.category === 'string' ? req.query.category.trim().slice(0, 50)  : '';

    let data;
    if (useMongo()) {
      const filter = {};
      if (search)                        filter.name     = { $regex: escRegex(search), $options: 'i' };
      if (category && category !== 'All') filter.category = category;
      data = await Product().find(filter).sort({ createdAt: -1 }).limit(500);
    } else {
      const filter = {};
      if (search)                        filter.name     = { $regex: escRegex(search) };
      if (category && category !== 'All') filter.category = category;
      data = mem.products.find(filter);
    }
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: isProd ? 'Server error.' : e.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, sku, category, stock, price, supplier, imageUrl, specs, sizes, minOrder } = req.body;
    if (!name || !sku || !category) return res.status(400).json({ success: false, message: 'name, sku and category are required.' });
    if (String(name).length > 200 || String(sku).length > 50) return res.status(400).json({ success: false, message: 'Input too long.' });

    const status = calcStatus(Number(stock));
    const extra  = { imageUrl: String(imageUrl || '').slice(0, 500), specs: String(specs || '').slice(0, 300), sizes: String(sizes || '').slice(0, 100), minOrder: String(minOrder || '').slice(0, 100) };
    let doc;
    if (useMongo()) {
      doc = await Product().create({ name, sku, category, stock: Number(stock), price: Number(price), supplier, status, ...extra });
    } else {
      doc = mem.products.create({ name, sku, category, stock: Number(stock), price: Number(price), supplier, status, ...extra });
    }
    res.json({ success: true, data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: isProd ? 'Server error.' : e.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Only allow whitelisted fields to be updated
    const allowed = ['name', 'sku', 'category', 'stock', 'price', 'supplier', 'imageUrl', 'specs', 'sizes', 'minOrder'];
    const payload = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) payload[key] = req.body[key];
    }
    if (payload.stock !== undefined) payload.status = calcStatus(Number(payload.stock));

    let doc;
    if (useMongo()) {
      doc = await Product().findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    } else {
      doc = mem.products.update(req.params.id, payload);
    }
    if (!doc) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: isProd ? 'Server error.' : e.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    if (useMongo()) await Product().findByIdAndDelete(req.params.id);
    else            mem.products.delete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: isProd ? 'Server error.' : e.message });
  }
});

module.exports = router;
