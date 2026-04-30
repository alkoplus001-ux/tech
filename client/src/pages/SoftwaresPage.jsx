import Navbar from '../components/Navbar.jsx';
import { useNavigate, Link } from 'react-router-dom';
import './SoftwaresPage.css';

const SOFTWARES = [
  { id:'inventory',  icon:'📦', title:'Inventory Management', badge:'Retail / Warehouse',   color:'#6C63FF',
    desc:'Real-time stock tracking, low-stock alerts, barcode scanning, supplier management, and detailed reports — all in one place. Perfect for shops, warehouses, and distributors.',
    features:['Real-time Stock Tracking','Low-Stock & Expiry Alerts','Supplier & Purchase Orders','Barcode Scanner Support','GST-Ready Reports','Multi-Warehouse'] },
  { id:'billing',    icon:'🧾', title:'Billing & Invoicing',  badge:'All Businesses',       color:'#43E97B',
    desc:'Create professional GST invoices in seconds, track payments, send auto-reminders, and manage your complete billing cycle — from quotation to receipt.',
    features:['GST Invoice (PDF)','UPI QR on Invoice','Auto Payment Reminders','E-Way Bill','Customer Ledger','Tally Export'] },
  { id:'hr',         icon:'👥', title:'HR Management',         badge:'Corporate / SME',      color:'#FF6584',
    desc:'Manage your entire workforce digitally — employee records, attendance, leave management, appraisals, and onboarding — all from a single dashboard.',
    features:['Employee Profiles','Attendance Tracking','Leave Management','Appraisal Module','Onboarding Workflow','Document Management'] },
  { id:'pos',        icon:'🏪', title:'Point of Sale (POS)',   badge:'Retail / Restaurant',  color:'#f59e0b',
    desc:'Speed up your checkout, accept all payment modes, print thermal receipts, manage your product catalog, and track daily sales — built for Indian retail.',
    features:['Fast Billing Counter','Cash / UPI / Card','Thermal Receipt Print','Loyalty Program','Daily Sales Report','Barcode Scanner'] },
  { id:'payroll',    icon:'💰', title:'Payroll Management',    badge:'All Companies',        color:'#10b981',
    desc:'Automate your entire payroll process — from salary calculation and PF/ESI/TDS to custom payslips, bulk bank transfers, and Form 16 generation.',
    features:['Auto Salary Calculation','PF / ESI / TDS','Custom Payslips','Bulk Bank Transfer','Bonus Processing','Form 16 & 24Q'] },
  { id:'crm',        icon:'🤝', title:'CRM — Sales & Leads',   badge:'Sales / Service',      color:'#8B5CF6',
    desc:'Manage your entire sales pipeline from lead to closure. Track follow-ups, run WhatsApp campaigns, score leads, and monitor team performance in real time.',
    features:['Lead Pipeline','Follow-up Scheduler','WhatsApp Campaigns','Lead Scoring','Team Dashboard','Revenue Forecasting'] },
  { id:'hospital',   icon:'🏥', title:'Hospital Management',   badge:'Healthcare',           color:'#ef4444',
    desc:'Complete digital healthcare solution — patient records, OPD/IPD management, lab integration, pharmacy link, doctor scheduling, and billing all in one system.',
    features:['OPD + IPD Management','Patient History','Appointment Booking','Lab Integration','Pharmacy Link','Insurance Billing'] },
  { id:'school',     icon:'🎓', title:'School Management',     badge:'Education',            color:'#06b6d4',
    desc:'Run your school or college completely paperless — fee collection, attendance, exam results, parent communication, library, and transport — all digital.',
    features:['Online Fee Collection','Attendance Tracking','Exam Reports','Parent App & Alerts','Library Management','Transport Tracking'] },
  { id:'restaurant', icon:'🍽️', title:'Restaurant Management', badge:'Food & Beverage',     color:'#fb923c',
    desc:'Table orders, KOT printing, kitchen display, menu management, online ordering, delivery tracking, loyalty programs — everything a modern restaurant needs.',
    features:['Table & KOT Management','Kitchen Display System','Online Ordering','Delivery Management','Loyalty Program','Zomato / Swiggy Link'] },
  { id:'realestate', icon:'🏗️', title:'Real Estate',          badge:'Property',             color:'#3B82F6',
    desc:'Manage property listings, track buyers, generate EMI schedules, manage bookings and agreements, handle agent commissions — built for brokers and builders alike.',
    features:['Property Listings','Buyer CRM','EMI Schedule','Booking & Agreement','Agent Portal','Revenue Dashboard'] },
  { id:'pharmacy',   icon:'💊', title:'Pharmacy Management',   badge:'Healthcare / Retail',  color:'#a855f7',
    desc:'Full pharmacy solution with medicine stock management, expiry and batch tracking, prescription billing, GST invoicing, supplier orders, and reorder automation.',
    features:['Medicine Stock Management','Expiry & Batch Tracking','Prescription Management','GST Billing','Reorder Automation','Supplier Orders'] },
  { id:'analytics',  icon:'📊', title:'Analytics Dashboard',  badge:'Business Intelligence', color:'#ec4899',
    desc:'Turn your business data into actionable insights with real-time charts, KPI tracking, revenue forecasting, custom dashboards, and automated reports.',
    features:['Real-time Charts','KPI Tracking','Revenue Forecasting','Custom Dashboards','Scheduled Reports','Google Sheets Sync'] },
];

export default function SoftwaresPage() {
  const navigate = useNavigate();

  return (
    <div className="softwares-page">
      <Navbar />

      {/* HERO */}
      <section className="sw-hero">
        <div className="sw-hero-bg b1" />
        <div className="sw-hero-bg b2" />
        <div className="sw-hero-content">
          <div className="sw-badge">💻 Our Software Solutions</div>
          <h1>12+ Industry-Specific<br /><span className="gradient-text">Business Software</span></h1>
          <p>Every software is built from the ground up for Indian businesses — GST-ready, mobile-friendly, WhatsApp-integrated, and backed by lifetime support. Explore your industry below.</p>
        </div>
      </section>

      {/* SOFTWARES GRID */}
      <section className="sw-grid-section">
        <div className="sw-grid">
          {SOFTWARES.map(s => (
            <div key={s.id} className="sw-card" style={{ '--accent': s.color }}>
              <div className="sw-card-top">
                <div className="sw-icon" style={{ background:`${s.color}20` }}>{s.icon}</div>
                <span className="sw-badge-pill" style={{ background:`${s.color}18`, color:s.color, border:`1px solid ${s.color}33` }}>{s.badge}</span>
              </div>
              <h3>{s.title}</h3>
              <p className="sw-desc">{s.desc}</p>
              <ul className="sw-features">
                {s.features.map(f => (
                  <li key={f}><span style={{ color:s.color }}>✓</span> {f}</li>
                ))}
              </ul>
              <div className="sw-card-btns">
                <button
                  className="sw-demo-btn"
                  style={{ background:`linear-gradient(135deg,${s.color},${s.color}bb)` }}
                  onClick={() => navigate(`/demo/${s.id}`)}
                >
                  Live Demo →
                </button>
                <button
                  className="sw-enquire-btn"
                  onClick={() => document.getElementById('sw-cta')?.scrollIntoView({ behavior:'smooth' })}
                >
                  Get Quote
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="sw-cta-section" id="sw-cta">
        <div className="sw-cta-inner">
          <div className="sw-cta-icon">🚀</div>
          <h2>Not Sure Which Software You Need?</h2>
          <p>Our experts will understand your business, recommend the right solution, and give you a free live demo — no pressure, no commitment.</p>
          <div className="sw-cta-btns">
            <a href="https://wa.me/919991327697?text=Hi%20Tech%20Nandu%2C%20I%20want%20to%20know%20which%20software%20is%20best%20for%20my%20business." target="_blank" rel="noreferrer" className="btn btn-wa">
              💬 Chat on WhatsApp
            </a>
            <a href="tel:+919991327697" className="btn btn-call">
              📞 Call Us Now
            </a>
          </div>
          <p className="sw-cta-note">Starting from <strong>₹6,999</strong> &nbsp;·&nbsp; Free setup &amp; training &nbsp;·&nbsp; No hidden charges</p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">⚡ Tech Nandu</div>
        <p>Empowering Indian Businesses with Smart Technology</p>
        <div className="footer-links">
          <span>📞 <a href="tel:+919991327697" style={{color:'inherit',textDecoration:'none'}}>+91 99913-27697</a></span>
          <span>📞 <a href="tel:+919811017225" style={{color:'inherit',textDecoration:'none'}}>+91 98110-17225</a></span>
          <span>📧 <a href="mailto:tech.nandu.96@gmail.com" style={{color:'inherit',textDecoration:'none'}}>tech.nandu.96@gmail.com</a></span>
          <span>📍 Tikri Border, Baba Haridas Colony, Delhi – 110041</span>
        </div>
        <p className="footer-copy">© 2026 Tech Nandu. All rights reserved.</p>
      </footer>
    </div>
  );
}
