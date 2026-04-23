const nodemailer = require('nodemailer');

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const validate = ({ name, phone, email, business }) => {
  if (!name  || typeof name  !== 'string' || name.trim().length  < 2 || name.trim().length  > 100)
    return 'Name must be 2–100 characters.';
  if (!phone || typeof phone !== 'string' || !/^\+?[\d\s\-]{7,20}$/.test(phone.trim()))
    return 'Enter a valid phone number.';
  if (email    && !/^[^\s@]{1,64}@[^\s@]{1,255}$/.test(email.trim()))
    return 'Enter a valid email address.';
  if (business && typeof business === 'string' && business.trim().length > 200)
    return 'Business name too long.';
  return null;
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, message: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: 'Invalid JSON' }) };
  }

  const error = validate(body);
  if (error) {
    return { statusCode: 400, body: JSON.stringify({ success: false, message: error }) };
  }

  const name     = body.name.trim();
  const phone    = body.phone.trim();
  const email    = (body.email    || '').trim();
  const business = (body.business || '').trim();

  const { EMAIL_USER, EMAIL_PASS, ADMIN_EMAIL } = process.env;

  if (EMAIL_USER && EMAIL_PASS) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });

    await transporter.sendMail({
      from:    `"Tech Nandu" <${EMAIL_USER}>`,
      to:      ADMIN_EMAIL || EMAIL_USER,
      subject: `New Demo Request — ${esc(name)} | Tech Nandu`,
      html: `
        <div style="font-family:sans-serif;max-width:500px;background:#0f0f1a;color:#fff;padding:24px;border-radius:12px">
          <h2 style="color:#6C63FF;margin-bottom:20px">New Lead — Tech Nandu</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:rgba(255,255,255,.5);width:100px">Name</td>    <td style="padding:8px 0;font-weight:700">${esc(name)}</td></tr>
            <tr><td style="padding:8px 0;color:rgba(255,255,255,.5)">Phone</td>   <td style="padding:8px 0;font-weight:700;color:#43E97B">${esc(phone)}</td></tr>
            <tr><td style="padding:8px 0;color:rgba(255,255,255,.5)">Email</td>   <td style="padding:8px 0">${esc(email) || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:rgba(255,255,255,.5)">Business</td><td style="padding:8px 0">${esc(business) || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:rgba(255,255,255,.5)">Time</td>    <td style="padding:8px 0">${new Date().toLocaleString('en-IN')}</td></tr>
          </table>
          <div style="margin-top:20px;padding:14px;background:rgba(108,99,255,.15);border-radius:10px;border-left:3px solid #6C63FF">
            <strong>Quick Action:</strong> Call ${esc(name)} on ${esc(phone)} ASAP!
          </div>
        </div>`,
    }).catch(() => {});
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true }),
  };
};
