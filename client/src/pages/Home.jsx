import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
const API = import.meta.env.VITE_API_URL;
import './Home.css';

const TEMPLATES = [
  { id:'inventory',  icon:'📦', title:'Inventory Management', badge:'Retail / Warehouse',  color:'#6C63FF', desc:'Real-time stock tracking, low-stock alerts, barcode & supplier management.', features:['Stock Tracking','Low-Stock Alerts','Multi-Warehouse','Barcode'] },
  { id:'billing',    icon:'🧾', title:'Billing & Invoicing',   badge:'All Businesses',      color:'#43E97B', desc:'GST invoicing, payment tracking, auto-reminders & digital receipts.',      features:['GST Billing','E-Invoice','Auto Reminder','Payment Track'] },
  { id:'hr',         icon:'👥', title:'HR Management',          badge:'Corporate / SME',     color:'#FF6584', desc:'Employee records, attendance, leave management & appraisals.',             features:['Attendance','Leave Mgmt','Appraisals','Onboarding'] },
  { id:'pos',        icon:'🏪', title:'Point of Sale (POS)',    badge:'Retail / Restaurant', color:'#f59e0b', desc:'Fast checkout, multiple payment modes, receipt printing & daily reports.',  features:['Fast Checkout','Multi-Payment','Receipt Print','Daily Reports'] },
  { id:'payroll',    icon:'💰', title:'Payroll Management',     badge:'All Companies',       color:'#10b981', desc:'Auto salary, PF/ESI/TDS, payslips & bank transfer.',                      features:['Auto Salary','PF/ESI/TDS','Payslips','Bank Transfer'] },
  { id:'crm',        icon:'🤝', title:'CRM — Sales & Leads',    badge:'Sales / Service',     color:'#8B5CF6', desc:'Lead pipeline, follow-ups, customer history & team performance.',          features:['Lead Pipeline','Follow-ups','Deal Tracking','Performance'] },
  { id:'hospital',   icon:'🏥', title:'Hospital Management',    badge:'Healthcare',          color:'#ef4444', desc:'Patient records, OPD/IPD, prescriptions & appointments.',                  features:['Patient Records','OPD/IPD','Prescriptions','Appointments'] },
  { id:'school',     icon:'🎓', title:'School Management',      badge:'Education',           color:'#06b6d4', desc:'Student records, fees, attendance, exam results & timetable.',             features:['Fee Management','Attendance','Exam Results','Timetable'] },
  { id:'restaurant', icon:'🍽️', title:'Restaurant Management', badge:'Food & Beverage',     color:'#fb923c', desc:'Table orders, KOT system, menu management & kitchen display.',             features:['Table Orders','KOT System','Menu Mgmt','Delivery Track'] },
  { id:'realestate', icon:'🏗️', title:'Real Estate',           badge:'Property',            color:'#3B82F6', desc:'Property listings, buyer tracking, EMI schedules & agent portal.',         features:['Property Listings','Buyer CRM','EMI Schedule','Agent Portal'] },
  { id:'pharmacy',   icon:'💊', title:'Pharmacy Management',    badge:'Healthcare / Retail', color:'#a855f7', desc:'Medicine stock, expiry alerts, prescription billing & GST.',               features:['Medicine Stock','Expiry Alert','Rx Billing','Reorder Mgmt'] },
  { id:'analytics',  icon:'📊', title:'Analytics Dashboard',   badge:'Business Intelligence',color:'#ec4899', desc:'Real-time charts, KPI tracking, revenue forecasting & custom reports.',    features:['Real-time Charts','KPI Tracking','Forecasting','Custom Reports'] },
];

const STATS = [
  { num:'500+', label:'Happy Clients' },
  { num:'15+',  label:'Industries' },
  { num:'99.9%',label:'Uptime' },
  { num:'24/7', label:'Support' },
];

// ── Per-software pricing plans ──────────────────────────────────────────────
const PRICING = {
  inventory: {
    plans: [
      { name:'Starter',    desc:'Small shops & kirana stores', popular:false,
        features:['Up to 500 products','GST billing','Stock reports','Low-stock alerts','1 user login','WhatsApp support'], locked:[] },
      { name:'Business',   desc:'Growing retail & wholesale',   popular:true,
        features:['Unlimited products','Supplier management','Purchase orders','Barcode support','Advanced reports','5 users','Priority support'], locked:[] },
      { name:'Enterprise', desc:'Large chains & distributors',  popular:false,
        features:['Multi-warehouse support','Custom dashboards','Unlimited users','Dedicated account manager','Free training','24/7 support'], locked:[] },
    ],
  },
  billing: {
    plans: [
      { name:'Starter',    desc:'Freelancers & small business', popular:false,
        features:['GST invoice (PDF)','50 invoices/month','UPI QR on invoice','Payment tracking','1 user','WhatsApp support'], locked:[] },
      { name:'Business',   desc:'SMEs & service providers',     popular:true,
        features:['Unlimited invoices','Auto payment reminders','E-way bill','Customer ledger','Recurring invoices','3 users','Priority support'], locked:[] },
      { name:'Enterprise', desc:'CA firms & large businesses',  popular:false,
        features:['Unlimited invoices','GST filing ready','Tally export','Unlimited users','Custom branding','Free training','24/7 support'], locked:[] },
    ],
  },
  hr: {
    plans: [
      { name:'Starter',    desc:'Up to 25 employees',           popular:false,
        features:['25 employee profiles','Attendance tracking','Leave management','Monthly reports','Offer letter templates','WhatsApp support'], locked:[] },
      { name:'Business',   desc:'Up to 100 employees',          popular:true,
        features:['100 employee profiles','Biometric integration','Appraisal module','Onboarding workflow','Document management','Priority support'], locked:[] },
      { name:'Enterprise', desc:'Unlimited employees',          popular:false,
        features:['Unlimited employees','Custom leave policies','360° appraisals','Payroll integration','Dedicated HR consultant','24/7 support'], locked:[] },
    ],
  },
  pos: {
    plans: [
      { name:'Starter',    desc:'Single counter retail',        popular:false,
        features:['1 POS counter','Cash & UPI payments','Daily sales report','500 product catalog','Thermal receipt print','WhatsApp support'], locked:[] },
      { name:'Business',   desc:'Multi-counter shops',          popular:true,
        features:['3 POS counters','All payment modes','Loyalty program','Unlimited products','Customer database','Barcode scanner','Priority support'], locked:[] },
      { name:'Enterprise', desc:'Chains & franchise outlets',   popular:false,
        features:['Unlimited counters','Franchise management','Online order integration','Loyalty & gift cards','Custom dashboards','24/7 support'], locked:[] },
    ],
  },
  payroll: {
    plans: [
      { name:'Starter',    desc:'Up to 20 employees',           popular:false,
        features:['20 employees','Auto salary calculation','PF & ESI','PDF payslips','Monthly summary','WhatsApp support'], locked:[] },
      { name:'Business',   desc:'Up to 200 employees',          popular:true,
        features:['200 employees','Full PF / ESI / TDS','Custom payslips','Bulk bank transfer','Bonus processing','Form 16','Priority support'], locked:[] },
      { name:'Enterprise', desc:'Unlimited employees',          popular:false,
        features:['Unlimited employees','Full statutory compliance','CTC structure builder','Form 16 & 24Q','CA-reviewed templates','24/7 support'], locked:[] },
    ],
  },
  crm: {
    plans: [
      { name:'Starter',    desc:'Solo sales reps & startups',   popular:false,
        features:['500 leads','Sales pipeline','Follow-up reminders','WhatsApp templates','Call log','Basic reports'], locked:[] },
      { name:'Business',   desc:'Sales teams up to 10',         popular:true,
        features:['Unlimited leads','Custom pipeline stages','Auto follow-up scheduler','Email & WhatsApp campaigns','Lead scoring','Team dashboard','Priority support'], locked:[] },
      { name:'Enterprise', desc:'Large sales organisations',    popular:false,
        features:['Multi-team pipelines','Revenue forecasting','Email + WhatsApp + SMS','Territory management','Custom branding','Dedicated consultant','24/7 support'], locked:[] },
    ],
  },
  hospital: {
    plans: [
      { name:'Clinic',     desc:'Small clinics & solo doctors', popular:false,
        features:['50 patients/day','OPD management','Digital prescriptions','Appointment booking','Patient history','WhatsApp support'], locked:[] },
      { name:'Hospital',   desc:'Multi-specialty hospitals',    popular:true,
        features:['Unlimited patients','OPD + IPD management','Lab integration','Pharmacy link','Bed management','Doctor scheduling','Priority support'], locked:[] },
      { name:'Enterprise', desc:'Hospital chains & groups',     popular:false,
        features:['Complete HMS','Lab + Radiology','Insurance & TPA billing','NABH compliance','Multi-branch support','24/7 support'], locked:[] },
    ],
  },
  school: {
    plans: [
      { name:'Starter',    desc:'Up to 200 students',           popular:false,
        features:['200 students','Fee collection','Attendance tracking','Result entry','WhatsApp alerts to parents','Timetable'], locked:[] },
      { name:'Institution',desc:'Up to 1000 students',          popular:true,
        features:['1000 students','Online fee payment (UPI)','Exam reports','Parent app & alerts','Library management','Transport tracking','Priority support'], locked:[] },
      { name:'Enterprise', desc:'Multi-branch school groups',   popular:false,
        features:['Unlimited students','Online admissions','Biometric attendance','Multi-branch dashboard','Parent & student app','24/7 support'], locked:[] },
    ],
  },
  restaurant: {
    plans: [
      { name:'Starter',    desc:'Single outlet, small cafe',    popular:false,
        features:['1 outlet','Table management','KOT printing','Menu management','Daily sales report','WhatsApp support'], locked:[] },
      { name:'Business',   desc:'Full-service restaurants',     popular:true,
        features:['Unlimited tables','Kitchen display system','Online ordering','Delivery management','Loyalty program','Priority support'], locked:[] },
      { name:'Enterprise', desc:'Restaurant chains & cloud kitchens', popular:false,
        features:['Unlimited outlets','Zomato / Swiggy integration','Multi-outlet dashboard','Loyalty & offers','Inventory link','24/7 support'], locked:[] },
    ],
  },
  realestate: {
    plans: [
      { name:'Agent',      desc:'Individual agents & brokers',  popular:false,
        features:['50 property listings','Buyer CRM','Follow-up reminders','WhatsApp templates','Commission tracking','Basic reports'], locked:[] },
      { name:'Builder',    desc:'Builders & small developers',  popular:true,
        features:['Unlimited listings','Full buyer CRM','Booking & agreement management','EMI schedule generator','Agent portal','Revenue dashboard','Priority support'], locked:[] },
      { name:'Enterprise', desc:'Large builders & RE groups',   popular:false,
        features:['Multi-project management','Channel partner portal','Document management','Legal checklist','Revenue forecasting','Custom branding','24/7 support'], locked:[] },
    ],
  },
  pharmacy: {
    plans: [
      { name:'Starter',    desc:'Small pharmacies & medical shops', popular:false,
        features:['500 medicines','Expiry date alerts','GST billing','Reorder alerts','Daily stock report','WhatsApp support'], locked:[] },
      { name:'Business',   desc:'Full-service pharmacies',      popular:true,
        features:['Unlimited medicines','Batch & expiry tracking','Prescription management','Supplier orders','Reorder automation','Priority support'], locked:[] },
      { name:'Enterprise', desc:'Pharmacy chains & hospitals',  popular:false,
        features:['Multi-branch inventory','Doctor prescription link','Insurance billing','Supplier integration','Free training','24/7 support'], locked:[] },
    ],
  },
  analytics: {
    plans: [
      { name:'Starter',    desc:'Small businesses & startups',  popular:false,
        features:['5 dashboards','Basic KPI tracking','Sales & revenue charts','Excel / CSV export','Monthly report','WhatsApp support'], locked:[] },
      { name:'Business',   desc:'Data-driven SMEs',             popular:true,
        features:['Unlimited dashboards','Revenue forecasting','Custom chart builder','Multi-user access','Scheduled reports','Google Sheets sync','Priority support'], locked:[] },
      { name:'Enterprise', desc:'Large organisations & agencies',popular:false,
        features:['AI-powered insights','Predictive forecasting','Custom dashboards','Unlimited users','Dedicated analyst','Free training','24/7 support'], locked:[] },
    ],
  },
};

export default function Home() {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ name:'', phone:'', email:'', business:'' });
  const [submitting, setSub]    = useState(false);
  const [msg, setMsg]           = useState(null);
  const [pricingTab, setPricingTab] = useState('inventory');

  const handleBook = async () => {
    if (!form.name || !form.phone) { setMsg({ type:'error', text:'Name and phone number are required.' }); return; }
    setSub(true);
    try {
      const res  = await fetch(`${API}/api/contact`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setMsg({ type:'success', text:`Demo booked, ${form.name}! Our team will contact you within 2 hours at +91 99913-27697 or WhatsApp.` });
        setForm({ name:'', phone:'', email:'', business:'' });
      } else throw new Error(data.message);
    } catch (e) {
      setMsg({ type:'error', text: e.message || 'Something went wrong. Please try again.' });
    } finally { setSub(false); }
  };

  const activeTpl   = TEMPLATES.find(t => t.id === pricingTab) || TEMPLATES[0];
  const activePlans = PRICING[pricingTab]?.plans || [];

  return (
    <div className="home">
      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg-blob blob1" />
        <div className="hero-bg-blob blob2" />
        <div className="hero-bg-blob blob3" />
        <div className="hero-content">
          <div className="hero-badge">🚀 India's Trusted Business Software</div>
          <h1>Smart Software for<br /><span className="gradient-text">Every Business</span></h1>
          <p>Complete ERP & management solutions — from Inventory to HR, Billing to CRM. One platform, infinite possibilities for your business.</p>
          <div className="hero-btns">
            <button className="btn btn-primary" onClick={() => document.getElementById('templates')?.scrollIntoView({ behavior:'smooth' })}>
              Explore Templates
            </button>
            <button className="btn btn-outline" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior:'smooth' })}>
              View Pricing
            </button>
          </div>
          <div className="hero-stats">
            {STATS.map(s => (
              <div key={s.label} className="hero-stat">
                <div className="hero-stat-num">{s.num}</div>
                <div className="hero-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEMPLATES */}
      <section className="templates-section" id="templates">
        <div className="section-head">
          <div className="section-badge">Live Interactive Demos</div>
          <h2>Choose Your Business Domain</h2>
          <p>Click any card to open a fully working demo — add data, view reports, interact live</p>
        </div>

        <div className="templates-grid">
          {TEMPLATES.map(t => (
            <div key={t.id} className="template-card" style={{ '--card-accent': t.color }}>
              <div className="tc-top">
                <div className="tc-icon" style={{ background: `${t.color}20` }}>{t.icon}</div>
                <span className="tc-badge" style={{ background:`${t.color}18`, color:t.color, border:`1px solid ${t.color}33` }}>{t.badge}</span>
              </div>
              <h3>{t.title}</h3>
              <p>{t.desc}</p>
              <div className="tc-features">
                {t.features.map(f => <span key={f} className="tc-feat">{f}</span>)}
              </div>
              <button
                className="tc-btn"
                style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}bb)` }}
                onClick={() => navigate(`/demo/${t.id}`)}
              >
                View Live Demo →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div className="section-head">
          <div className="section-badge">Transparent Pricing</div>
          <h2>Simple Plans for Every Business</h2>
          <p>No hidden charges. Cancel anytime. All plans include free setup & training.</p>
        </div>

        {/* Software type tabs */}
        <div className="pricing-tabs">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              className={`ptab${pricingTab === t.id ? ' ptab-active' : ''}`}
              style={pricingTab === t.id ? { borderColor: t.color, color: t.color, background: `${t.color}15` } : {}}
              onClick={() => setPricingTab(t.id)}
            >
              <span>{t.icon}</span> {t.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Active software label */}
        <div className="pricing-label">
          <span style={{ color: activeTpl.color }}>{activeTpl.icon} {activeTpl.title}</span>
          <span className="pricing-label-badge" style={{ background:`${activeTpl.color}15`, color:activeTpl.color, border:`1px solid ${activeTpl.color}30` }}>{activeTpl.badge}</span>
        </div>

        {/* Special offer banner */}
        <div className="pricing-offer-banner">
          <div className="pricing-offer-left">
            <div className="pricing-offer-tag">SPECIAL OFFER</div>
            <div className="pricing-offer-price">
              <span className="pricing-offer-from">Starting from</span>
              <span className="pricing-offer-amount">₹6,999</span>
            </div>
            <div className="pricing-offer-sub">Get your website or software today &amp; grow your business online!</div>
          </div>
          <div className="pricing-offer-checklist">
            {['No Hidden Charges','Free Consultation','Free Basic Support','On Time Delivery'].map(f => (
              <div key={f} className="pricing-offer-check"><span>✓</span> {f}</div>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        <div className="plans-grid">
          {activePlans.map((plan, i) => {
            const isStarter = ['Starter','Agent','Clinic'].includes(plan.name);
            const isEnterprise = plan.name === 'Enterprise';
            const priceLabel  = isStarter ? '₹6,999' : isEnterprise ? 'Custom' : 'Contact Us';
            const priceSub    = isStarter ? 'onwards' : isEnterprise ? 'Quote'  : 'for pricing';
            return (
              <div key={i} className={`plan-card${plan.popular ? ' plan-popular' : ''}`}
                style={plan.popular ? { borderColor: activeTpl.color, boxShadow: `0 0 0 1px ${activeTpl.color}40, 0 20px 50px ${activeTpl.color}20` } : {}}>

                {plan.popular && (
                  <div className="plan-badge" style={{ background: `linear-gradient(135deg, ${activeTpl.color}, ${activeTpl.color}bb)` }}>
                    ⭐ Most Popular
                  </div>
                )}

                <div className="plan-name">{plan.name}</div>
                <div className="plan-desc">{plan.desc}</div>

                <div className="plan-price">
                  <span className="plan-amount" style={plan.popular ? { color: activeTpl.color } : {}}>{priceLabel}</span>
                  <span className="plan-period">{priceSub}</span>
                </div>

                <button
                  className="plan-btn"
                  style={{ background: plan.popular ? `linear-gradient(135deg, ${activeTpl.color}, ${activeTpl.color}bb)` : 'transparent',
                           border: `1px solid ${plan.popular ? activeTpl.color : 'rgba(255,255,255,.15)'}`,
                           color: plan.popular ? '#fff' : 'inherit' }}
                  onClick={() => document.getElementById('cta-section')?.scrollIntoView({ behavior:'smooth' })}
                >
                  {plan.popular ? '🚀 Get Started' : 'Book Free Demo'}
                </button>

                <div className="plan-divider" />

                <ul className="plan-features">
                  {plan.features.map((f, j) => (
                    <li key={j} className="pf-yes">
                      <span className="pf-icon" style={{ color: activeTpl.color }}>✓</span> {f}
                    </li>
                  ))}
                  {plan.locked.map((f, j) => (
                    <li key={j} className="pf-no">
                      <span className="pf-icon">✕</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="pricing-footer">
          <span>🔒 No credit card required for demo</span>
          <span>🎓 Free onboarding &amp; training included</span>
          <span>📞 +91 99913-27697</span>
          <span>📱 Mobile Friendly &amp; 100% Secure</span>
        </div>
      </section>

      {/* WHY US */}
      <section className="why-section" id="features">
        <div className="section-head">
          <div className="section-badge">Why Tech Nandu?</div>
          <h2>Everything Your Business Needs</h2>
        </div>
        <div className="why-grid">
          {[
            { icon:'⚡', title:'Lightning Fast',    desc:'Our software is optimized for speed. No lag, no crashes.' },
            { icon:'🔒', title:'100% Secure',       desc:'Your data is encrypted and backed up daily on secure servers.' },
            { icon:'📱', title:'Mobile Friendly',   desc:'Works perfectly on any device — desktop, tablet, or phone.' },
            { icon:'🎯', title:'GST Ready',         desc:'Fully GST compliant. File returns directly from the software.' },
            { icon:'🔧', title:'Free Training',     desc:'Free onboarding training and setup for every client.' },
            { icon:'📞', title:'24/7 Support',      desc:'Our team is always available via WhatsApp, call, or email.' },
          ].map(w => (
            <div key={w.title} className="why-card">
              <div className="why-icon">{w.icon}</div>
              <h4>{w.title}</h4>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta-section">
        <div className="cta-inner">
          <h2>Ready to Grow Your Business?</h2>
          <p>Contact us today — free demo, free setup consultation. Call or WhatsApp us at <strong style={{color:'#43E97B'}}>+91 99913-27697</strong></p>
          <div className="cta-form">
            <input className="cta-input" placeholder="Your Name *" value={form.name}     onChange={e => setForm(p => ({...p, name:e.target.value}))} />
            <input className="cta-input" placeholder="WhatsApp Number *" type="tel" value={form.phone} onChange={e => setForm(p => ({...p, phone:e.target.value}))} />
            <input className="cta-input" placeholder="Email (optional)" type="email" value={form.email} onChange={e => setForm(p => ({...p, email:e.target.value}))} />
            <input className="cta-input" placeholder="Business Type (e.g. Retail, Hospital)" value={form.business} onChange={e => setForm(p => ({...p, business:e.target.value}))} />
            <button className="btn btn-primary cta-btn" onClick={handleBook} disabled={submitting}>
              {submitting ? 'Booking...' : 'Book Free Demo'}
            </button>
          </div>
          {msg && <div className={`cta-msg ${msg.type}`}>{msg.type==='success'?'✅':'⚠️'} {msg.text}</div>}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">⚡ Tech Nandu</div>
        <p>Empowering Indian Businesses with Smart Technology</p>
        <div className="footer-links">
          <span>📞 <a href="tel:+919991327697" style={{color:'inherit',textDecoration:'none'}}>+91 99913-27697</a></span>
          <span>📞 <a href="tel:+919811017225" style={{color:'inherit',textDecoration:'none'}}>+91 98110-17225</a></span>
          <span>📧 <a href="mailto:tech.nandu.96@gmail.com" style={{color:'inherit',textDecoration:'none'}}>tech.nandu.96@gmail.com</a></span>
          <span>💬 <a href="https://wa.me/919991327697" target="_blank" rel="noreferrer" style={{color:'inherit',textDecoration:'none'}}>WhatsApp Us</a></span>
          <span>📍 Tikri Border, Baba Haridas Colony, Delhi – 110041</span>
        </div>
        <p className="footer-copy">© 2026 Tech Nandu. All rights reserved. | Tikri Border, Baba Haridas Colony, Delhi – 110041</p>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/919991327697?text=Hi%20Tech%20Nandu%2C%20I%20want%20a%20free%20demo!"
        target="_blank" rel="noreferrer"
        style={{
          position:'fixed', bottom:28, right:28, zIndex:9999,
          width:58, height:58, borderRadius:'50%',
          background:'#25D366', display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'1.6rem', boxShadow:'0 6px 24px rgba(37,211,102,0.5)',
          textDecoration:'none', transition:'transform .2s',
          animation:'waPulse 2s infinite',
        }}
        title="Chat on WhatsApp"
      >
        💬
      </a>
    </div>
  );
}
