import Navbar from '../components/Navbar.jsx';
import SEOHead from '../components/SEOHead.jsx';
import { Link, useNavigate } from 'react-router-dom';
import useReveal from '../hooks/useReveal.js';
import './AboutPage.css';

const ABOUT_SEO = {
  title: 'About Tech Nandu | Affordable Business Software Company in Delhi',
  description: 'Tech Nandu is a Delhi-based software company building affordable GST billing, inventory management, ERP & CRM solutions for Indian businesses. Know our story, mission & team.',
  keywords: 'Tech Nandu about, business software company Delhi, ERP company India, affordable software Delhi, GST software company',
  canonical: 'https://technandu.com/about',
};

const VALUES = [
  { icon:'🎯', title:'Customer First',      desc:'Every decision starts with one question — how does this help our customer? Your growth is our priority.' },
  { icon:'💡', title:'Practical Innovation', desc:'We build simple, useful tools instead of complex systems no one knows how to use.' },
  { icon:'🤝', title:'Trust & Transparency', desc:'No hidden charges, no confusing contracts — just honest work and clear communication.' },
  { icon:'⚡', title:'Speed & Reliability',  desc:'Fast, dependable software built for everyday business use without crashes or lag.' },
  { icon:'🇮🇳', title:'Built for India',     desc:'Designed for Indian businesses — GST-ready, simple UI, and workflows that match how India operates.' },
  { icon:'🔧', title:'Lifetime Support',     desc:'We stay with you even after delivery — always ready to help via WhatsApp, call, or email.' },
];

const TEAM = [
  { name:'Kajal Kumari',    role:'Co-Founder & CEO',         emoji:'👩‍💼', desc:'Leading the vision and building impactful, easy-to-use solutions for businesses.' },
  { name:'Sushil Kumar',    role:'Co-Founder & Operations',  emoji:'👨‍💼', desc:'Ensuring smooth operations and a great experience for every client.' },
  { name:'Development Team',role:'Engineering',              emoji:'👨‍💻', desc:'Building secure, fast, and scalable software using modern technologies.' },
  { name:'Support Team',    role:'Customer Success',         emoji:'📞', desc:'Available on WhatsApp and call to help clients resolve issues quickly.' },
];

export default function AboutPage() {
  const navigate = useNavigate();
  useReveal();

  const goToDemo = () => {
    navigate('/');
    setTimeout(() => document.getElementById('cta-section')?.scrollIntoView({ behavior:'smooth' }), 500);
  };

  return (
    <div className="about-page">
      <SEOHead {...ABOUT_SEO} />
      <Navbar />

      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-bg blob1" />
        <div className="about-hero-bg blob2" />
        <div className="about-hero-content">
          <div className="about-badge">⚡ About Tech Nandu</div>
          <h1>Empowering Businesses<br /><span className="gradient-text">Through Smart Technology</span></h1>
          <p>We build simple, reliable, and affordable software solutions that help businesses reduce manual work, improve efficiency, and grow faster.</p>
          <div className="about-hero-btns">
            <button className="btn btn-primary" onClick={goToDemo}>Book Free Demo</button>
            <Link to="/softwares" className="btn btn-outline">View Softwares</Link>
          </div>
        </div>
      </section>

      {/* STORY WITH IMAGE */}
      <section className="about-story-section">
        <div className="about-story-inner">
          <div className="about-story-text reveal">
            <div className="section-badge">📖 Our Story</div>
            <h2>Started with a Simple Idea</h2>
            <p>Tech Nandu was started with a simple belief — technology should make business easier, not more complicated. We saw many small and growing businesses still relying on manual processes, registers, and outdated systems.</p>
            <p>From retail shops managing stock manually, to service businesses struggling with operations — the problem was clear. Good software was either too expensive or too complex.</p>
            <p>That's why we focused on building simple, practical, and affordable solutions that anyone can use without technical knowledge. We are growing step by step — building trust, delivering value, and improving with every product we create.</p>
            <div className="about-story-highlight">
              <span>🚀</span>
              <p>Our goal is to become a long-term technology partner for every business we serve.</p>
            </div>
          </div>

          {/* IMAGE SLOT 1 — put file: client/public/images/about-story.jpg */}
          <div className="about-story-visual">
            <div className="about-img-wrap">
              <img
                src="/images/about-story.jpg"
                alt="Tech Nandu founders working on business software solutions for Indian SMEs"
                className="about-img"
                loading="lazy"
                width="600"
                height="400"
                onError={e => { e.target.closest('.about-img-wrap').style.display='none'; e.target.closest('.about-img-wrap').nextElementSibling.style.display='flex'; }}
              />
            </div>
            <div className="about-img-placeholder" style={{display:'none'}}>
              <span>🖼️</span>
              <p>Add image: <code>client/public/images/about-story.jpg</code></p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION VISION */}
      <section className="about-mv-section">
        <div className="about-mv-grid">
          <div className="about-mv-card mission reveal">
            <div className="mv-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>To empower every Indian business — big or small — with affordable, easy-to-use software that saves time, reduces errors, and drives real growth. Technology should work for you.</p>
          </div>
          <div className="about-mv-card vision reveal" style={{ transitionDelay:'.15s' }}>
            <div className="mv-icon">🔭</div>
            <h3>Our Vision</h3>
            <p>To become a trusted software partner for businesses across India — one that every entrepreneur thinks of first when they need a reliable technology solution.</p>
          </div>
        </div>
      </section>

      {/* IMAGE BANNER SLOT — put file: client/public/images/about-office.jpg */}
      <section className="about-img-banner-section">
        <div className="about-banner-wrap">
          <img
            src="/images/about-office.jpg"
            alt="Tech Nandu office in Tikri Border Delhi - GST billing and ERP software company"
            className="about-banner-img"
            loading="lazy"
            width="1200"
            height="500"
            onError={e => { e.target.closest('.about-banner-wrap').style.display='none'; e.target.closest('.about-banner-wrap').nextElementSibling.style.display='flex'; }}
          />
        </div>
        <div className="about-img-placeholder about-banner-placeholder" style={{display:'none'}}>
          <span>🖼️</span>
          <p>Add office/team photo → <code>client/public/images/about-office.jpg</code></p>
        </div>
      </section>

      {/* VALUES */}
      <section className="about-values-section">
        <div className="section-head reveal">
          <div className="section-badge">💎 What We Stand For</div>
          <h2>Our Core Values</h2>
          <p>The principles that guide every product we build and every client we serve.</p>
        </div>
        <div className="about-values-grid">
          {VALUES.map((v, i) => (
            <div key={v.title} className="about-value-card reveal" style={{ transitionDelay:`${i * 0.09}s` }}>
              <div className="av-icon">{v.icon}</div>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="about-team-section">
        <div className="section-head reveal">
          <div className="section-badge">👥 The People Behind It</div>
          <h2>Meet Our Team</h2>
          <p>Passionate professionals dedicated to your business success.</p>
        </div>
        <div className="about-team-grid">
          {TEAM.map((t, i) => (
            <div key={t.name} className="about-team-card reveal" style={{ transitionDelay:`${i * 0.12}s` }}>
              {/* IMAGE SLOT — put file: client/public/images/team-[name].jpg (optional) */}
              <div className="atc-emoji">{t.emoji}</div>
              <div className="atc-name">{t.name}</div>
              <div className="atc-role">{t.role}</div>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
        <p className="about-team-note">💡 To add team photos, place images in <code>client/public/images/</code> and update the img src in AboutPage.jsx</p>
      </section>

      {/* WHY CHOOSE US */}
      <section className="about-why-section">
        <div className="section-head reveal">
          <div className="section-badge">✅ Why Choose Tech Nandu</div>
          <h2>What Makes Us Different</h2>
        </div>
        <div className="about-why-grid">
          {[
            { icon:'💰', title:'Affordable Pricing',  desc:'Subscription from ₹2,000/month or one-time custom. No hidden charges, ever.' },
            { icon:'🎓', title:'Free Training',        desc:'Every client gets full onboarding training — no extra cost, no rush.' },
            { icon:'📱', title:'Mobile Friendly',      desc:'Works perfectly on any device — desktop, tablet, or phone.' },
            { icon:'🇮🇳', title:'GST & Compliance',   desc:'Fully GST compliant, invoice-ready, and built for Indian tax requirements.' },
            { icon:'⚡', title:'Quick Setup',          desc:'We set everything up for you. You can go live the same day.' },
            { icon:'📞', title:'Always Reachable',     desc:'WhatsApp, call, or email — we\'re always there when you need help.' },
          ].map((w, i) => (
            <div key={w.title} className="about-why-card reveal" style={{ transitionDelay:`${i * 0.1}s` }}>
              <div className="awy-icon">{w.icon}</div>
              <h4>{w.title}</h4>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta-section">
        <h2>Let's Build Something Together</h2>
        <p>Book a free demo and see how our software can simplify your business operations.</p>
        <div className="about-cta-btns">
          <Link to="/contact" className="btn btn-primary">Contact Us</Link>
          <button className="btn btn-outline" onClick={goToDemo}>Book Free Demo</button>
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
