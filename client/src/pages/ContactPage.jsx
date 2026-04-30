import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import './ContactPage.css';

const API = import.meta.env.VITE_API_URL;

export default function ContactPage() {
  const [form, setForm]   = useState({ name:'', phone:'', email:'', business:'', message:'' });
  const [sub, setSub]     = useState(false);
  const [msg, setMsg]     = useState(null);

  const handleSubmit = async () => {
    if (!form.name || !form.phone) { setMsg({ type:'error', text:'Name and phone number are required.' }); return; }
    setSub(true);
    try {
      const res  = await fetch(`${API}/api/contact`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.success) {
        setMsg({ type:'success', text:`Thank you, ${form.name}! We'll contact you within 2 hours at +91 99913-27697 or WhatsApp.` });
        setForm({ name:'', phone:'', email:'', business:'', message:'' });
      } else throw new Error(data.message);
    } catch (e) {
      setMsg({ type:'error', text: e.message || 'Something went wrong. Please try again.' });
    } finally { setSub(false); }
  };

  const INFO = [
    { icon:'📍', label:'Address',   value:'Tikri Border, Baba Haridas Colony, Delhi – 110041', href:null },
    { icon:'📞', label:'Phone 1',   value:'+91 99913-27697', href:'tel:+919991327697' },
    { icon:'📞', label:'Phone 2',   value:'+91 98110-17225', href:'tel:+919811017225' },
    { icon:'📧', label:'Email',     value:'tech.nandu.96@gmail.com', href:'mailto:tech.nandu.96@gmail.com' },
    { icon:'💬', label:'WhatsApp',  value:'Chat with us on WhatsApp', href:'https://wa.me/919991327697?text=Hi%20Tech%20Nandu%2C%20I%20want%20to%20know%20more.' },
    { icon:'🕐', label:'Hours',     value:'Mon – Sat: 9 AM – 8 PM | Sun: 10 AM – 6 PM', href:null },
  ];

  return (
    <div className="contact-page">
      <Navbar />

      {/* HERO */}
      <section className="contact-hero">
        <div className="contact-hero-bg b1" />
        <div className="contact-hero-bg b2" />
        <div className="contact-hero-content">
          <div className="contact-badge">📞 Contact Us</div>
          <h1>Let's Talk About<br /><span className="gradient-text">Your Business</span></h1>
          <p>Have a question, want a free demo, or need a custom solution? We're just a call or message away. Our team responds within 2 hours.</p>
        </div>
      </section>

      {/* MAIN */}
      <section className="contact-main">
        <div className="contact-grid">

          {/* INFO */}
          <div className="contact-info-col">
            <h2>Get In Touch</h2>
            <p className="contact-info-sub">Reach us through any of the channels below. We're always happy to help.</p>
            <div className="contact-info-cards">
              {INFO.map(c => (
                <div key={c.label} className="contact-info-card">
                  <div className="cic-icon">{c.icon}</div>
                  <div>
                    <div className="cic-label">{c.label}</div>
                    {c.href
                      ? <a href={c.href} className="cic-value link" target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{c.value}</a>
                      : <div className="cic-value">{c.value}</div>
                    }
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-wa-btn-wrap">
              <a
                href="https://wa.me/919991327697?text=Hi%20Tech%20Nandu%2C%20I%20want%20to%20book%20a%20free%20demo!"
                target="_blank" rel="noreferrer"
                className="contact-wa-btn"
              >
                💬 Chat on WhatsApp — Fastest Response
              </a>
            </div>
          </div>

          {/* FORM */}
          <div className="contact-form-col">
            <div className="contact-form-card">
              <h3>Book a Free Demo</h3>
              <p>Fill in your details and our team will reach out within 2 hours with a personalised demo.</p>

              <div className="contact-form-fields">
                <div className="cff-row">
                  <div className="cff-group">
                    <label>Your Name *</label>
                    <input
                      placeholder="e.g. Rahul Sharma"
                      value={form.name}
                      onChange={e => setForm(p => ({...p, name:e.target.value}))}
                    />
                  </div>
                  <div className="cff-group">
                    <label>WhatsApp Number *</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={form.phone}
                      onChange={e => setForm(p => ({...p, phone:e.target.value}))}
                    />
                  </div>
                </div>
                <div className="cff-row">
                  <div className="cff-group">
                    <label>Email (optional)</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={e => setForm(p => ({...p, email:e.target.value}))}
                    />
                  </div>
                  <div className="cff-group">
                    <label>Business Type</label>
                    <input
                      placeholder="e.g. Retail Shop, Hospital..."
                      value={form.business}
                      onChange={e => setForm(p => ({...p, business:e.target.value}))}
                    />
                  </div>
                </div>
                <div className="cff-group full">
                  <label>Message (optional)</label>
                  <textarea
                    placeholder="Tell us about your business or what you need..."
                    rows={4}
                    value={form.message}
                    onChange={e => setForm(p => ({...p, message:e.target.value}))}
                  />
                </div>
              </div>

              {msg && (
                <div className={`contact-msg ${msg.type}`}>
                  {msg.type === 'success' ? '✅' : '⚠️'} {msg.text}
                </div>
              )}

              <button className="contact-submit-btn" onClick={handleSubmit} disabled={sub}>
                {sub ? 'Sending...' : '🚀 Book Free Demo'}
              </button>
              <p className="contact-form-note">✓ Free consultation &nbsp;·&nbsp; ✓ No hidden charges &nbsp;·&nbsp; ✓ We call within 2 hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CONTACT */}
      <section className="contact-why-section">
        <div className="section-head">
          <div className="section-badge">💡 Why Choose Us</div>
          <h2>We Make It Simple for You</h2>
        </div>
        <div className="contact-why-grid">
          {[
            { icon:'⚡', title:'Fast Response',      desc:'We reply within 2 hours on WhatsApp and within the same day on email — no long waits.' },
            { icon:'🎯', title:'Free Demo First',    desc:'We give you a full live demo before you decide anything. See the software in action for your specific business.' },
            { icon:'💰', title:'No Hidden Charges',  desc:'The price we quote is the price you pay. No surprise fees, no long contracts, no complicated pricing.' },
            { icon:'🤝', title:'Lifetime Support',   desc:'Once you\'re our client, we\'re always available. Setup, training, updates, and troubleshooting — all included.' },
          ].map(w => (
            <div key={w.title} className="contact-why-card">
              <div className="cwc-icon">{w.icon}</div>
              <h4>{w.title}</h4>
              <p>{w.desc}</p>
            </div>
          ))}
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
