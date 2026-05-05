// require('dotenv').config();
// const express    = require('express');
// const mongoose   = require('mongoose');
// const cors       = require('cors');
// const helmet     = require('helmet');
// const rateLimit  = require('express-rate-limit');

// const app  = express();
// const isProd = process.env.NODE_ENV === 'production';

// // Render sits behind a reverse proxy — needed for correct IP in rate limiter
// app.set('trust proxy', 1);

// // ── Security headers (Helmet) ─────────────────────────────────────────────────
// app.use(helmet({
//   crossOriginEmbedderPolicy: false,   // allow demo iframes
//   contentSecurityPolicy: false,       // managed by frontend build
// }));

// // ── CORS — only allow our own frontend ───────────────────────────────────────
// const ALLOWED_ORIGINS = [
//   'http://localhost:3000',
//   'http://127.0.0.1:3000',
//   ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
// ];
// app.use(cors({
//   origin: (origin, cb) => {
//     // allow non-browser requests (curl, mobile apps) only in dev
//     if (!origin && !isProd) return cb(null, true);
//     if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
//     cb(new Error('CORS: origin not allowed'));
//   },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true,
// }));

// // ── Body size limit (prevent large payload attacks) ───────────────────────────
// app.use(express.json({ limit: '10kb' }));

// // ── Global rate limiter — 100 req / 15 min per IP ────────────────────────────
// app.use('/api/', rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { success: false, message: 'Too many requests, please try again later.' },
// }));

// // ── Stricter limiter for public contact form (5 submissions / 15 min) ─────────
// const contactLimit = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: { success: false, message: 'Too many submissions, please wait before trying again.' },
// });
// app.use('/api/contact', contactLimit);

// // ── API Routes ────────────────────────────────────────────────────────────────
// app.use('/api/inventory', require('./routes/inventory'));
// app.use('/api/billing',   require('./routes/billing'));
// app.use('/api/hr',        require('./routes/hr'));
// app.use('/api/contact',   require('./routes/contact'));

// // ── Status — basic info only, no internal details ────────────────────────────
// app.get('/api/status', (req, res) => {
//   res.json({
//     status: 'ok',
//     time:   new Date().toLocaleString('en-IN'),
//   });
// });

// // ── Seed — protected by SEED_SECRET env var ───────────────────────────────────
// app.post('/api/seed', async (req, res) => {
//   const secret = process.env.SEED_SECRET;
//   if (!secret || req.headers['x-seed-secret'] !== secret)
//     return res.status(403).json({ success: false, message: 'Forbidden' });

//   if (mongoose.connection.readyState !== 1)
//     return res.json({ success: false, message: 'MongoDB not connected.' });

//   try {
//     const Product  = require('./models/Product');
//     const Invoice  = require('./models/Invoice');
//     const Employee = require('./models/Employee');

//     await Product.deleteMany({});
//     await Invoice.deleteMany({});
//     await Employee.deleteMany({});

//     await Product.insertMany([
//       { name:'Samsung TV 55"',      sku:'EL-001', category:'Electronics', stock:45,  price:42000, supplier:'Samsung India',  status:'In Stock'    },
//       { name:'Nike Running Shoes',  sku:'FW-234', category:'Footwear',    stock:8,   price:4500,  supplier:'Nike Dist.',      status:'Low Stock'   },
//       { name:'Basmati Rice 5kg',    sku:'GR-567', category:'Grocery',     stock:320, price:450,   supplier:'India Gate',      status:'In Stock'    },
//       { name:'HP Laptop Pavilion',  sku:'EL-089', category:'Electronics', stock:2,   price:55000, supplier:'HP India',        status:'Low Stock'   },
//       { name:'Cotton T-Shirt XL',   sku:'CL-112', category:'Clothing',    stock:156, price:799,   supplier:'Rupa Co.',        status:'In Stock'    },
//       { name:'Colgate Toothpaste',  sku:'HG-021', category:'FMCG',        stock:0,   price:120,   supplier:'Colgate India',   status:'Out of Stock'},
//       { name:'Wireless Headphones', sku:'EL-300', category:'Electronics', stock:32,  price:2499,  supplier:'boAt Lifestyle',  status:'In Stock'    },
//       { name:"Levi's Jeans 32W",    sku:'CL-205', category:'Clothing',    stock:18,  price:3499,  supplier:"Levi's India",   status:'In Stock'    },
//     ]);

//     const invData = [
//       { customer:'Sharma Traders', phone:'9876543210', items:[{name:'Inventory Module',qty:1,price:12000},{name:'Setup',qty:1,price:2000}],    gstRate:18, status:'Paid'    },
//       { customer:'Patel Stores',   phone:'9123456780', items:[{name:'Billing Software',qty:1,price:7000}],                                     gstRate:18, status:'Pending' },
//       { customer:'Gupta Textiles', phone:'9988776655', items:[{name:'HR Module',qty:1,price:15000},{name:'Training',qty:2,price:2500}],        gstRate:18, status:'Paid'    },
//       { customer:'Khan Pharma',    phone:'9012345678', items:[{name:'POS System',qty:1,price:5000}],                                           gstRate:18, status:'Overdue' },
//       { customer:'Nair Exports',   phone:'9876501234', items:[{name:'CRM Module',qty:1,price:18000},{name:'Support',qty:1,price:3000}],        gstRate:18, status:'Paid'    },
//     ];
//     for (let i = 0; i < invData.length; i++) {
//       const inv       = invData[i];
//       const invoiceNo = `TN-2026-${String(i + 1).padStart(4, '0')}`;
//       const subtotal  = inv.items.reduce((s, x) => s + x.qty * x.price, 0);
//       const gstAmt    = parseFloat(((subtotal * inv.gstRate) / 100).toFixed(2));
//       await Invoice.create({ ...inv, invoiceNo, subtotal, gstAmt, total: subtotal + gstAmt });
//     }

//     await Employee.insertMany([
//       { empId:'TN-EMP-001', name:'Rahul Sharma', department:'Engineering', position:'Sr. Developer', phone:'9876543210', email:'rahul@co.in',  salary:55000, status:'Active'   },
//       { empId:'TN-EMP-002', name:'Priya Patel',  department:'Marketing',   position:'Team Lead',     phone:'9123456780', email:'priya@co.in',  salary:42000, status:'Active'   },
//       { empId:'TN-EMP-003', name:'Amit Kumar',   department:'Sales',       position:'Sales Manager', phone:'9988776655', email:'amit@co.in',   salary:60000, status:'On Leave' },
//       { empId:'TN-EMP-004', name:'Sunita Singh', department:'HR',          position:'HR Executive',  phone:'9012345678', email:'sunita@co.in', salary:35000, status:'Active'   },
//       { empId:'TN-EMP-005', name:'Vikram Nair',  department:'Finance',     position:'Accountant',    phone:'9876501234', email:'vikram@co.in', salary:40000, status:'Active'   },
//       { empId:'TN-EMP-006', name:'Deepa Mehta',  department:'Engineering', position:'UI Designer',   phone:'8877665544', email:'deepa@co.in',  salary:38000, status:'Active'   },
//     ]);

//     res.json({ success: true, message: 'Demo data seeded into MongoDB.' });
//   } catch (e) {
//     res.status(500).json({ success: false, message: isProd ? 'Seed failed.' : e.message });
//   }
// });

// // ── Global error handler — never leak stack traces ────────────────────────────
// app.use((err, req, res, next) => {
//   if (err.message && err.message.startsWith('CORS'))
//     return res.status(403).json({ success: false, message: 'Forbidden' });
//   console.error(err.message);
//   res.status(500).json({ success: false, message: isProd ? 'Internal server error.' : err.message });
// });

// // ── Connect MongoDB then start server ─────────────────────────────────────────
// const PORT = process.env.PORT || 5000;

// mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => {
//     console.log('MongoDB unavailable:', err.message);
//     console.log('Running with in-memory demo data.\n');
//   })
//   .finally(() => {
//     app.listen(PORT, () => {
//       console.log(`Backend API → http://localhost:${PORT}`);
//     });
//   });
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// Render proxy fix
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));

// ✅ CORS
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://verdant-naiad-df12c8.netlify.app',
   // ✅ VERCEL FRONTEND (MOST IMPORTANT)
  'https://tech-six-red.vercel.app',

   'https://www.technandu.com',   // ✅ ADD THIS
  'https://technandu.com',       // ✅ (without www bhi add kar)
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    // allow any netlify.app preview deploy
   // if (origin.endsWith('.netlify.app')) return cb(null, true);
   if (origin && origin.endsWith('.netlify.app')) return cb(null, true);
    return cb(new Error('CORS not allowed'));
  },
  credentials: true,
}));

// Body limit
app.use(express.json({ limit: '10kb' }));

// Rate limiter
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// Routes
app.use('/api/inventory',  require('./routes/inventory'));
app.use('/api/billing',    require('./routes/billing'));
app.use('/api/hr',         require('./routes/hr'));
app.use('/api/contact',    require('./routes/contact'));
app.use('/api/cloudinary', require('./routes/cloudinary'));

// Status check
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok' });
});

// Temporary: test email config
app.get('/api/test-email', async (req, res) => {
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const result = await resend.emails.send({
      from: 'Tech Nandu <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL || 'tech.nandu.96@gmail.com',
      subject: 'Test Email — Tech Nandu',
      text: 'If you see this, email is working!',
    });
    res.json({ success: true, message: 'Test email sent!', to: process.env.ADMIN_EMAIL, result });
  } catch (e) {
    res.json({ success: false, error: e.message });
  }
});

// Error handler
app.use((err, req, res, next) => {
  if (err.message === 'CORS not allowed')
    return res.status(403).json({ success: false, message: 'CORS not allowed' });
  console.error(err.message);
  res.status(500).json({
    success: false,
    message: isProd ? 'Server error' : err.message
  });
});

// Start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err))
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });