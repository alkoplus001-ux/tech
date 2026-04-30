import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { Link } from 'react-router-dom';
import './CareerPage.css';

const PERKS = [
  { icon:'💰', title:'Competitive Pay',       desc:'We offer market-competitive salaries with performance-based bonuses and increments.' },
  { icon:'📈', title:'Clear Growth Path',      desc:'From junior to senior, we have a defined career ladder so you always know your next step.' },
  { icon:'🎓', title:'Learning & Development', desc:'Regular training sessions, workshops, and access to premium online learning resources.' },
  { icon:'🤝', title:'Team Culture',           desc:'A friendly, collaborative environment where your ideas are heard and your work is valued.' },
  { icon:'⏰', title:'Flexible Hours',          desc:'We believe in work-life balance. Get the flexibility you need to do your best work.' },
  { icon:'🎉', title:'Fun & Celebrations',     desc:'Monthly team outings, festival celebrations, and recognition for every achievement.' },
];

const OPENINGS = [
  {
    title:'React.js Developer',
    type:'Full-Time',
    location:'Delhi (On-site)',
    exp:'1–3 Years',
    color:'#6C63FF',
    skills:['React.js','JavaScript','HTML/CSS','REST APIs','Git'],
    desc:'We are looking for a passionate React developer to build and maintain our web-based ERP modules. You will work directly with our product team to deliver features used by hundreds of businesses.',
  },
  {
    title:'Sales Executive',
    type:'Full-Time',
    location:'Delhi (Field + Office)',
    exp:'0–2 Years',
    color:'#43E97B',
    skills:['Communication','Lead Generation','CRM Tools','Hindi & English','Negotiation'],
    desc:'Join our sales team and help us grow our client base across Delhi NCR. You will demo our software to business owners, understand their needs, and close deals. Excellent earning potential with incentives.',
  },
  {
    title:'Customer Support Executive',
    type:'Full-Time',
    location:'Delhi (Office)',
    exp:'Fresher Welcome',
    color:'#f59e0b',
    skills:['Communication','Problem Solving','MS Office','Hindi','Patient & Helpful'],
    desc:'Be the first point of contact for our clients. Help them set up the software, resolve issues, and ensure they get the most out of their Tech Nandu subscription. Training provided.',
  },
  {
    title:'UI/UX Designer',
    type:'Full-Time / Freelance',
    location:'Delhi / Remote',
    exp:'1–2 Years',
    color:'#FF6584',
    skills:['Figma','Canva','Adobe XD','Mobile UI','Prototyping'],
    desc:'Design clean, intuitive interfaces for our business software products and marketing materials. You will work closely with developers and clients to create experiences that are both beautiful and functional.',
  },
];

export default function CareerPage() {
  const [applied, setApplied] = useState(null);

  return (
    <div className="career-page">
      <Navbar />

      {/* HERO */}
      <section className="career-hero">
        <div className="career-hero-bg b1" />
        <div className="career-hero-bg b2" />
        <div className="career-hero-content">
          <div className="career-badge">💼 Careers at Tech Nandu</div>
          <h1>Build the Future of<br /><span className="gradient-text">Indian Business Software</span></h1>
          <p>Join a passionate team that is transforming how thousands of Indian businesses operate every day. We are growing fast — and we want talented people like you to grow with us.</p>
          <a href="#openings" className="btn btn-primary" onClick={e => { e.preventDefault(); document.getElementById('openings')?.scrollIntoView({ behavior:'smooth' }); }}>
            See Open Positions ↓
          </a>
        </div>
      </section>

      {/* WHY JOIN US */}
      <section className="career-perks-section">
        <div className="section-head">
          <div className="section-badge">🌟 Why Join Us</div>
          <h2>More Than Just a Job</h2>
          <p>We invest in our people because our people are our product. Here's what you can expect when you join Tech Nandu.</p>
        </div>
        <div className="career-perks-grid">
          {PERKS.map(p => (
            <div key={p.title} className="career-perk-card">
              <div className="perk-icon">{p.icon}</div>
              <h4>{p.title}</h4>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM IMAGE — put file: client/public/images/career-team.jpg */}
      <div className="career-img-section">
        <div className="career-banner-wrap">
          <img
            src="/images/career-team.jpg"
            alt="Tech Nandu Team"
            className="career-banner-img"
            onError={e => { e.target.closest('.career-banner-wrap').style.display='none'; e.target.closest('.career-banner-wrap').nextElementSibling.style.display='flex'; }}
          />
        </div>
        <div className="career-img-placeholder" style={{display:'none'}}>
          <span>🖼️</span>
          <p>Add team photo → <code>client/public/images/career-team.jpg</code></p>
        </div>
      </div>

      {/* OPENINGS */}
      <section className="career-openings-section" id="openings">
        <div className="section-head">
          <div className="section-badge">🚀 Current Openings</div>
          <h2>We Are Hiring!</h2>
          <p>Find the role that matches your skills and passion. All positions include training and growth opportunities.</p>
        </div>
        <div className="career-openings-grid">
          {OPENINGS.map((job, i) => (
            <div key={i} className="job-card" style={{ borderTop:`3px solid ${job.color}` }}>
              <div className="job-card-top">
                <div>
                  <div className="job-title">{job.title}</div>
                  <div className="job-meta">
                    <span>📍 {job.location}</span>
                    <span>💼 {job.type}</span>
                    <span>⏳ {job.exp}</span>
                  </div>
                </div>
                <div className="job-type-badge" style={{ background:`${job.color}18`, color:job.color, border:`1px solid ${job.color}30` }}>
                  {job.type}
                </div>
              </div>
              <p className="job-desc">{job.desc}</p>
              <div className="job-skills">
                {job.skills.map(s => <span key={s} className="skill-pill">{s}</span>)}
              </div>
              <button
                className="job-apply-btn"
                style={{ background:`linear-gradient(135deg,${job.color},${job.color}bb)` }}
                onClick={() => setApplied(job.title)}
              >
                Apply Now →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* APPLY MODAL */}
      {applied && (
        <>
          <div className="career-modal-backdrop" onClick={() => setApplied(null)} />
          <div className="career-modal">
            <div className="career-modal-head">
              <h3>Apply for: {applied}</h3>
              <button onClick={() => setApplied(null)}>✕</button>
            </div>
            <p className="career-modal-sub">Send your CV and a short introduction to our team. We'll get back within 48 hours.</p>
            <div className="career-apply-options">
              <a
                href={`mailto:tech.nandu.96@gmail.com?subject=Job Application — ${applied}&body=Hi Tech Nandu Team,%0A%0AI am applying for the ${applied} position.%0A%0AName:%0APhone:%0AExperience:%0A%0APlease find my CV attached.%0A%0AThank you.`}
                className="apply-option email-option"
              >
                <span>📧</span>
                <div>
                  <div className="apply-opt-title">Send via Email</div>
                  <div className="apply-opt-sub">tech.nandu.96@gmail.com</div>
                </div>
              </a>
              <a
                href={`https://wa.me/919991327697?text=Hi%20Tech%20Nandu%2C%20I%20want%20to%20apply%20for%20the%20${encodeURIComponent(applied)}%20position.%20My%20Name%3A%20%0AExperience%3A%20%0ALocation%3A`}
                target="_blank" rel="noreferrer"
                className="apply-option wa-option"
              >
                <span>💬</span>
                <div>
                  <div className="apply-opt-title">Apply via WhatsApp</div>
                  <div className="apply-opt-sub">+91 99913-27697</div>
                </div>
              </a>
            </div>
          </div>
        </>
      )}

      {/* OPEN APPLICATION */}
      <section className="career-open-section">
        <div className="career-open-inner">
          <div className="co-icon">📬</div>
          <h3>Don't See a Matching Role?</h3>
          <p>We are always interested in meeting talented people. Send us your CV and tell us how you can contribute — we will reach out when the right opportunity comes up.</p>
          <a
            href="mailto:tech.nandu.96@gmail.com?subject=Open Application — Tech Nandu"
            className="btn btn-primary"
          >
            Send Open Application
          </a>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">⚡ Tech Nandu</div>
        <p>Empowering Indian Businesses with Smart Technology</p>
        <div className="footer-links">
          <span>📞 <a href="tel:+919991327697" style={{color:'inherit',textDecoration:'none'}}>+91 99913-27697</a></span>
          <span>📧 <a href="mailto:tech.nandu.96@gmail.com" style={{color:'inherit',textDecoration:'none'}}>tech.nandu.96@gmail.com</a></span>
          <span>📍 Tikri Border, Baba Haridas Colony, Delhi – 110041</span>
        </div>
        <p className="footer-copy">© 2026 Tech Nandu. All rights reserved.</p>
      </footer>
    </div>
  );
}
