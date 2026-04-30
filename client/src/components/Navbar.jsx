import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import './Navbar.css';

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  const scrollTo = (id) => {
    close();
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="nav-logo" onClick={close}>
          <div className="nav-logo-icon">⚡</div>
          <span className="nav-logo-text">Tech Nandu</span>
        </Link>

        <ul className="nav-links">
          <li><Link to="/softwares" className="nav-btn">Softwares</Link></li>
          <li><Link to="/about" className="nav-btn">About Us</Link></li>
          <li><Link to="/career" className="nav-btn">Career</Link></li>
          <li><a href="tel:+919991327697" className="nav-btn">📞 Call</a></li>
          <li>
            <a href="https://wa.me/919991327697" target="_blank" rel="noreferrer" className="nav-btn nav-wa">
              💬 WhatsApp
            </a>
          </li>
          <li><Link to="/admin" className="nav-btn nav-admin">Admin</Link></li>
        </ul>

        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <button className="theme-toggle" onClick={toggle}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="btn btn-primary btn-sm nav-demo-btn" onClick={() => scrollTo('cta-section')}>
            Free Demo
          </button>
          <button className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      {menuOpen && <div className="nav-backdrop" onClick={close} />}

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="mobile-nav">
          <Link to="/softwares" className="nav-btn" onClick={close}>💻 Softwares</Link>
          <Link to="/about" className="nav-btn" onClick={close}>👥 About Us</Link>
          <Link to="/career" className="nav-btn" onClick={close}>💼 Career</Link>
          <div className="mobile-nav-divider" />
          <a href="tel:+919991327697" className="nav-btn" onClick={close}>📞 Call Us</a>
          <a href="https://wa.me/919991327697" target="_blank" rel="noreferrer"
            className="nav-btn nav-wa" onClick={close}>💬 WhatsApp</a>
          <Link to="/admin" className="nav-btn nav-admin" onClick={close}>🔐 Admin Panel</Link>
          <div className="mobile-nav-divider" />
          <button className="mobile-nav-cta" onClick={() => scrollTo('cta-section')}>
            🎯 Get Free Demo
          </button>
        </div>
      )}
    </>
  );
}
