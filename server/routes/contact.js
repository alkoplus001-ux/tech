const router   = require('express').Router();
const mongoose = require('mongoose');
const { Resend } = require('resend');
const { mem }  = require('../db');

const isProd   = process.env.NODE_ENV === 'production';
const useMongo = () => mongoose.connection.readyState === 1;
const Contact  = () => useMongo() ? require('../models/Contact') : null;

const esc = (s) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const resend = new Resend(process.env.RESEND_API_KEY);

// Validate + sanitize incoming contact data
const validateContact = (body) => {
  const { name, phone, email, business, message } = body;
  if (!name  || typeof name  !== 'string' || name.trim().length  < 2 || name.trim().length  > 100)
    return 'Name must be 2–100 characters.';
  if (!phone || typeof phone !== 'string' || !/^\+?[\d\s\-]{7,20}$/.test(phone.trim()))
    return 'Enter a valid phone number.';
  if (email && !/^[^\s@]{1,64}@[^\s@]{1,255}$/.test(email.trim()))
    return 'Enter a valid email address.';
  if (business && typeof business === 'string' && business.trim().length > 200)
    return 'Business name too long.';
  if (message && typeof message === 'string' && message.trim().length > 1000)
    return 'Message too long (max 1000 chars).';
  return null;
};

router.post('/', async (req, res) => {
  try {
    const error = validateContact(req.body);
    if (error) return res.status(400).json({ success: false, message: error });

    const name     = req.body.name.trim();
    const phone    = req.body.phone.trim();
    const email    = (req.body.email    || '').trim();
    const business = (req.body.business || '').trim();
    const message  = (req.body.message  || '').trim();

    let doc;
    if (useMongo()) {
      doc = await Contact().create({ name, phone, email, business, message });
    } else {
      doc = mem.contacts.create({ name, phone, email, business, message });
    }

    // Send notification email via Resend (HTTPS, works on Render free tier)
    if (process.env.RESEND_API_KEY) {
      resend.emails.send({
        from:    'Tech Nandu <onboarding@resend.dev>',
        to:      process.env.ADMIN_EMAIL || 'tech.nandu.96@gmail.com',
        subject: `New Demo Request — ${esc(name)} | Tech Nandu`,
        html: `
          <div style="font-family:sans-serif;max-width:500px;background:#0f0f1a;color:#fff;padding:24px;border-radius:12px">
            <h2 style="color:#6C63FF;margin-bottom:20px">⚡ New Lead — Tech Nandu</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:rgba(255,255,255,.5);width:100px">👤 Name</td>    <td style="padding:8px 0;font-weight:700">${esc(name)}</td></tr>
              <tr><td style="padding:8px 0;color:rgba(255,255,255,.5)">📞 Phone</td>   <td style="padding:8px 0;font-weight:700;color:#43E97B">${esc(phone)}</td></tr>
              <tr><td style="padding:8px 0;color:rgba(255,255,255,.5)">📧 Email</td>   <td style="padding:8px 0">${esc(email) || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:rgba(255,255,255,.5)">🏢 Business</td><td style="padding:8px 0">${esc(business) || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:rgba(255,255,255,.5)">💬 Message</td> <td style="padding:8px 0">${esc(message) || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:rgba(255,255,255,.5)">🕐 Time</td>   <td style="padding:8px 0">${new Date().toLocaleString('en-IN')}</td></tr>
            </table>
            <div style="margin-top:20px;padding:14px;background:rgba(108,99,255,.15);border-radius:10px;border-left:3px solid #6C63FF">
              <strong>Quick Action:</strong> Call ${esc(name)} on ${esc(phone)} ASAP!
            </div>
          </div>`,
      }).catch((err) => { console.error('[MAIL ERROR]', err.message); });
    }

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: isProd ? 'Could not submit, please try again.' : e.message });
  }
});

// Admin: list contacts — protected by ADMIN_KEY header
router.get('/', async (req, res) => {
  if (!process.env.ADMIN_KEY || req.headers['x-admin-key'] !== process.env.ADMIN_KEY)
    return res.status(403).json({ success: false, message: 'Forbidden' });
  try {
    const data = useMongo()
      ? await Contact().find().sort({ createdAt: -1 })
      : mem.contacts.find();
    res.json({ success: true, total: data.length, data });
  } catch (e) {
    res.status(500).json({ success: false, message: isProd ? 'Server error.' : e.message });
  }
});

// Admin: delete contact — protected by ADMIN_KEY header
router.delete('/:id', async (req, res) => {
  if (!process.env.ADMIN_KEY || req.headers['x-admin-key'] !== process.env.ADMIN_KEY)
    return res.status(403).json({ success: false, message: 'Forbidden' });
  try {
    if (useMongo()) await Contact().findByIdAndDelete(req.params.id);
    else            mem.contacts.delete(req.params.id);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: isProd ? 'Server error.' : e.message });
  }
});

module.exports = router;
