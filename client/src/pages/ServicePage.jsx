import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import SEOHead from '../components/SEOHead.jsx';
import './ServicePage.css';

const SERVICE_SEO = {
  title: 'Website & Custom Software Services | ERP, Digital Solutions | Tech Nandu Delhi',
  description: 'Website from ₹6,999, custom ERP & billing software, subscription software, digital marketing & 24/7 support. Tech Nandu serves all businesses across Delhi NCR & India.',
  keywords: 'website development Delhi, custom software development India, ERP services Delhi, billing software development, digital marketing Delhi, GST software service',
  canonical: 'https://technandu.com/services',
};

const SERVICES = [
  {
    icon:'🌐', title:'Any Type of Website',
    color:'#6C63FF',
    desc:'Business, E-Commerce, Portfolio, Blog, Service, Real Estate, School, Hospital & More. We build websites for every industry.',
    points:['Business & Corporate','E-Commerce Store','Portfolio Website','Real Estate Portal','School / Hospital Website','Blog & News Website'],
  },
  {
    icon:'✏️', title:'Custom Website Design',
    color:'#FF6584',
    desc:'100% Custom Design with Unique Layout & Features as per your Business Requirements. No templates — built from scratch.',
    points:['100% Custom UI/UX','Mobile Responsive','SEO Optimized','Fast Loading','Unique Brand Design','Admin Panel Included'],
  },
  {
    icon:'⚙️', title:'Custom Software',
    color:'#43E97B',
    desc:'We build Custom Software for Billing, Inventory, CRM, HR, Accounting & More. Fully tailored to how your business actually works.',
    points:['Billing & GST Software','Inventory Management','CRM & Sales Tracking','HR & Payroll','School / Hospital ERP','Any Custom Module'],
  },
  {
    icon:'☁️', title:'Subscription Based Software',
    color:'#f59e0b',
    desc:'Use our ready-made software on Monthly or Yearly Subscription. Secure, Easy & Affordable — no upfront investment needed.',
    points:['Monthly / Yearly Plans','Instant Access','Free Updates Included','24/7 Cloud Backup','Mobile Friendly','Cancel Anytime'],
  },
  {
    icon:'📈', title:'Digital Solutions',
    color:'#06b6d4',
    desc:'Domain, Hosting, SSL, Website Maintenance, SEO & Digital Marketing Support. Everything digital under one roof.',
    points:['Domain Registration','Web Hosting Setup','SSL Certificate','Website Maintenance','SEO & Ranking','Google Business Profile'],
  },
  {
    icon:'🎧', title:'24/7 Support',
    color:'#a855f7',
    desc:'Our team is always available for you on Call, WhatsApp & Email. We don\'t disappear after delivery — we stay with you.',
    points:['WhatsApp Support','Phone Support','Email Support','Same-Day Response','Free Training','Lifetime Assistance'],
  },
];

const WHY = [
  { icon:'🚀', title:'Fast Delivery',       desc:'We deliver projects on time without compromising quality.' },
  { icon:'🔒', title:'100% Secure',         desc:'All websites and software are built with security best practices.' },
  { icon:'📱', title:'Mobile Friendly',     desc:'Every product works perfectly on phones, tablets, and desktops.' },
  { icon:'💰', title:'Affordable Pricing',  desc:'Starting from ₹6,999 for websites. No hidden charges, ever.' },
  { icon:'👥', title:'Expert Team',         desc:'Experienced developers and designers who understand your business.' },
  { icon:'🤝', title:'Lifetime Support',    desc:'We support you long after your project goes live.' },
];

export default function ServicePage() {
  const navigate = useNavigate();

  const goToContact = () => navigate('/contact');
  const goToDemo    = () => { navigate('/'); setTimeout(() => document.getElementById('cta-section')?.scrollIntoView({ behavior:'smooth' }), 500); };

  return (
    <div className="service-page">
      <SEOHead {...SERVICE_SEO} />
      <Navbar />

      {/* HERO */}
      <section className="service-hero">
        <div className="service-hero-bg b1" />
        <div className="service-hero-bg b2" />
        <div className="service-hero-content">
          <div className="service-badge">🛠️ Our Services</div>
          <h1>Complete Solutions<br /><span className="gradient-text">For Every Business</span></h1>
          <p>हर Business के लिए Smart Solution — Websites, Software, Digital Marketing & Lifetime Support. One partner for all your technology needs.</p>
          <div className="service-hero-btns">
            <button className="btn btn-primary" onClick={goToContact}>Get Free Quote</button>
            <button className="btn btn-outline" onClick={goToDemo}>Book Free Demo</button>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="service-list-section">
        <div className="section-head">
          <div className="section-badge">What We Offer</div>
          <h2>Our Core Services</h2>
          <p>Everything your business needs — built, delivered, and supported by one team.</p>
        </div>
        <div className="service-cards-grid">
          {SERVICES.map(s => (
            <div key={s.title} className="service-card" style={{ '--sc-color': s.color }}>
              <div className="sc-icon" style={{ background:`${s.color}18`, border:`1px solid ${s.color}30` }}>{s.icon}</div>
              <h3>{s.title}</h3>
              <p className="sc-desc">{s.desc}</p>
              <ul className="sc-points">
                {s.points.map(p => <li key={p}><span style={{color:s.color}}>✓</span> {p}</li>)}
              </ul>
              <button className="sc-btn" style={{ borderColor:`${s.color}40`, color:s.color }} onClick={goToContact}>
                Enquire Now →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING HIGHLIGHT */}
      <section className="service-pricing-section">
        <div className="service-pricing-inner">
          <div className="sp-tag">SPECIAL OFFER</div>
          <h2>Website Starting From <span className="gradient-text">₹6,999</span></h2>
          <p>Get your website today and grow your business online!</p>
          <div className="sp-checklist">
            {['No Hidden Charges','Free Consultation','Free Basic Support','On Time Delivery'].map(f => (
              <div key={f} className="sp-check"><span>✓</span> {f}</div>
            ))}
          </div>
          <div className="sp-also">
            <div className="sp-also-item">
              <span>☁️</span>
              <div>
                <strong>Subscription Based Software</strong>
                <p>Starting from ₹2,000/month — pay monthly, cancel anytime</p>
              </div>
            </div>
            <div className="sp-also-item">
              <span>⚙️</span>
              <div>
                <strong>One-Time Custom Software</strong>
                <p>Starting from ₹50,000 — fully yours, lifetime licence + 1 year free maintenance</p>
              </div>
            </div>
          </div>
          <button className="btn btn-primary" style={{fontSize:'1rem',padding:'14px 36px'}} onClick={goToContact}>
            📞 Contact Us for a Free Quote
          </button>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="service-why-section">
        <div className="section-head">
          <div className="section-badge">Why Choose Tech Nandu?</div>
          <h2>What Makes Us Different</h2>
        </div>
        <div className="service-why-grid">
          {WHY.map(w => (
            <div key={w.title} className="service-why-card">
              <div className="swy-icon">{w.icon}</div>
              <h4>{w.title}</h4>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="service-how-section">
        <div className="section-head">
          <div className="section-badge">Simple Process</div>
          <h2>How We Work</h2>
        </div>
        <div className="service-how-grid">
          {[
            { num:'01', icon:'📞', title:'Contact Us',       desc:'Call, WhatsApp, or fill the form. We respond within 2 hours.',     color:'#6C63FF' },
            { num:'02', icon:'💬', title:'Free Consultation', desc:'We understand your requirements and give you the best solution.',   color:'#43E97B' },
            { num:'03', icon:'⚙️', title:'We Build It',      desc:'Our team starts building your website or software immediately.',    color:'#f59e0b' },
            { num:'04', icon:'🚀', title:'Delivery & Training',desc:'We deliver on time, train you, and provide lifetime support.',    color:'#FF6584' },
          ].map(s => (
            <div key={s.num} className="service-how-card" style={{ '--hw-color': s.color }}>
              <div className="shc-num">{s.num}</div>
              <div className="shc-icon">{s.icon}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="service-cta-section">
        <h2>Let's Grow Your Business Together</h2>
        <p>Call us today for a free consultation. No pressure, no obligation.</p>
        <div className="service-cta-contacts">
          <a href="tel:+919991327697" className="scc-btn"><span>📞</span> +91 99913-27697</a>
          <a href="tel:+919811017225" className="scc-btn"><span>📞</span> +91 98110-17225</a>
          <a href="https://wa.me/919991327697?text=Hi%20Tech%20Nandu%2C%20I%20want%20to%20know%20more%20about%20your%20services." target="_blank" rel="noreferrer" className="scc-btn scc-wa">
            <span>💬</span> WhatsApp Us
          </a>
          <a href="mailto:tech.nandu.96@gmail.com" className="scc-btn"><span>📧</span> tech.nandu.96@gmail.com</a>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">⚡ Tech Nandu</div>
        <p>Empowering Indian Businesses with Smart Technology</p>
        <nav className="footer-links" aria-label="Site Navigation">
          <a href="/" style={{color:'inherit',textDecoration:'none'}}>Home</a>
          <a href="/softwares" style={{color:'inherit',textDecoration:'none'}}>Softwares</a>
          <a href="/services" style={{color:'inherit',textDecoration:'none'}}>Services</a>
          <a href="/blog" style={{color:'inherit',textDecoration:'none'}}>Blog</a>
          <a href="/about" style={{color:'inherit',textDecoration:'none'}}>About</a>
          <a href="/career" style={{color:'inherit',textDecoration:'none'}}>Careers</a>
          <a href="/contact" style={{color:'inherit',textDecoration:'none'}}>Contact</a>
        </nav>
        <div className="footer-links">
          <span>📞 <a href="tel:+919991327697" style={{color:'inherit',textDecoration:'none'}}>+91 99913-27697</a></span>
          <span>📞 <a href="tel:+919811017225" style={{color:'inherit',textDecoration:'none'}}>+91 98110-17225</a></span>
          <span>📧 <a href="mailto:tech.nandu.96@gmail.com" style={{color:'inherit',textDecoration:'none'}}>tech.nandu.96@gmail.com</a></span>
          <span>💬 <a href="https://wa.me/919991327697" target="_blank" rel="noreferrer" style={{color:'inherit',textDecoration:'none'}}>WhatsApp Us</a></span>
          <span>📍 Tikri Border, Baba Haridas Colony, Delhi – 110041</span>
        </div>
        <p className="footer-copy">© 2026 Tech Nandu. All rights reserved.</p>
      </footer>
    </div>
  );
}
