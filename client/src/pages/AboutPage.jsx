import Navbar from '../components/Navbar.jsx';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const STATS = [
  { num:'500+',  label:'Happy Clients' },
  { num:'15+',   label:'Industries Served' },
  { num:'99.9%', label:'Uptime Guaranteed' },
  { num:'24/7',  label:'Customer Support' },
];

const VALUES = [
  { icon:'🎯', title:'Customer First',    desc:'Every decision we make starts with one question — how does this help our customer? Your success is our success, and we never lose sight of that.' },
  { icon:'💡', title:'Innovation',        desc:'We continuously improve our products to stay ahead of the curve. From GST updates to new features, we bring the best technology to your doorstep.' },
  { icon:'🤝', title:'Trust & Honesty',  desc:'No hidden charges, no confusing contracts. We believe in complete transparency — what you see is what you get, every single time.' },
  { icon:'⚡', title:'Speed & Reliability',desc:'Your business cannot afford downtime. Our software is built for speed and runs on secure cloud infrastructure with 99.9% uptime.' },
  { icon:'🇮🇳', title:'Made for India',  desc:'Our software is designed specifically for Indian businesses — GST-ready, Hindi/regional friendly, and built for the way India does business.' },
  { icon:'🔧', title:'Lifetime Support',  desc:'We don\'t disappear after the sale. Our support team is always available via WhatsApp, phone, and email to help you every step of the way.' },
];

const TEAM = [
  { name:'Nandu Sir',     role:'Founder & CEO',           emoji:'👨‍💼', desc:'Visionary leader with 10+ years of experience in software and business consulting.' },
  { name:'Dev Team',      role:'Software Development',     emoji:'👨‍💻', desc:'Expert React & Node.js developers building fast, secure, and scalable software.' },
  { name:'Design Team',   role:'UI/UX Design',             emoji:'🎨', desc:'Creative designers crafting beautiful, intuitive interfaces your team will love.' },
  { name:'Support Team',  role:'Customer Success',         emoji:'📞', desc:'Dedicated support specialists available 24/7 to resolve any issue instantly.' },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      <Navbar />

      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-bg blob1" />
        <div className="about-hero-bg blob2" />
        <div className="about-hero-content">
          <div className="about-badge">⚡ About Tech Nandu</div>
          <h1>Empowering Indian Businesses<br /><span className="gradient-text">Through Smart Technology</span></h1>
          <p>We are a Delhi-based software company on a mission to make world-class business software accessible to every Indian entrepreneur — affordable, simple, and built for how India works.</p>
          <div className="about-hero-btns">
            <Link to="/#cta-section" className="btn btn-primary">Book Free Demo</Link>
            <Link to="/softwares" className="btn btn-outline">View Our Softwares</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="about-stats-section">
        <div className="about-stats-grid">
          {STATS.map(s => (
            <div key={s.label} className="about-stat-card">
              <div className="about-stat-num">{s.num}</div>
              <div className="about-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* OUR STORY */}
      <section className="about-story-section">
        <div className="about-story-inner">
          <div className="about-story-text">
            <div className="section-badge">📖 Our Story</div>
            <h2>Started with a Simple Idea</h2>
            <p>Tech Nandu was founded in the heart of Delhi with one goal — to bring affordable, powerful software to Indian businesses that have long been ignored by expensive foreign software companies.</p>
            <p>We saw small shop owners struggling with manual billing, kirana stores losing track of stock, clinics managing patient records in notebooks, and schools collecting fees with paper registers. We knew technology could solve all of this — and we set out to make it happen.</p>
            <p>Today, we serve 500+ businesses across Delhi and beyond, from single-counter retail shops to multi-branch hospitals and school chains. Every product we build is crafted with care, keeping the real needs of Indian businesses at the center.</p>
            <div className="about-story-highlight">
              <span>🏆</span>
              <p>Our clients don't just buy software — they gain a long-term technology partner who is always there for them.</p>
            </div>
          </div>
          <div className="about-story-visual">
            <div className="about-visual-card">
              <div className="avc-icon">⚡</div>
              <div className="avc-title">Tech Nandu</div>
              <div className="avc-sub">Est. Delhi, India</div>
              <div className="avc-divider" />
              <div className="avc-row"><span>📍</span><span>Tikri Border, Delhi – 110041</span></div>
              <div className="avc-row"><span>📞</span><span>+91 99913-27697</span></div>
              <div className="avc-row"><span>📧</span><span>tech.nandu.96@gmail.com</span></div>
              <div className="avc-row"><span>🏢</span><span>500+ Clients Served</span></div>
              <div className="avc-row"><span>💻</span><span>12+ Software Solutions</span></div>
              <div className="avc-row"><span>🌍</span><span>15+ Industries</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="about-mv-section">
        <div className="about-mv-grid">
          <div className="about-mv-card mission">
            <div className="mv-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>To empower every Indian business — big or small — with affordable, easy-to-use software that saves time, reduces errors, and drives real growth. We believe technology should work for you, not the other way around.</p>
          </div>
          <div className="about-mv-card vision">
            <div className="mv-icon">🔭</div>
            <h3>Our Vision</h3>
            <p>To become India's most trusted business software company — one that every entrepreneur thinks of first when they need a technology partner. We want to be in every shop, clinic, school, and office across India.</p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values-section">
        <div className="section-head">
          <div className="section-badge">💎 What We Stand For</div>
          <h2>Our Core Values</h2>
          <p>The principles that guide every product we build and every client we serve.</p>
        </div>
        <div className="about-values-grid">
          {VALUES.map(v => (
            <div key={v.title} className="about-value-card">
              <div className="av-icon">{v.icon}</div>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="about-team-section">
        <div className="section-head">
          <div className="section-badge">👥 The People Behind It</div>
          <h2>Meet Our Team</h2>
          <p>Passionate professionals dedicated to your business success.</p>
        </div>
        <div className="about-team-grid">
          {TEAM.map(t => (
            <div key={t.name} className="about-team-card">
              <div className="atc-emoji">{t.emoji}</div>
              <div className="atc-name">{t.name}</div>
              <div className="atc-role">{t.role}</div>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta-section">
        <h2>Ready to Work With Us?</h2>
        <p>Join 500+ businesses who trust Tech Nandu as their technology partner.</p>
        <div className="about-cta-btns">
          <Link to="/contact" className="btn btn-primary">Contact Us</Link>
          <Link to="/softwares" className="btn btn-outline">Explore Softwares</Link>
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
