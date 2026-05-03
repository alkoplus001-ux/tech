import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import './Navbar.css';

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 55);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setMenuOpen(false);
  const path  = location.pathname;

  const isActive = (p) => path === p ? 'nav-btn nav-active' : 'nav-btn';

  const goToDemo = () => {
    close();
    if (path === '/') {
      document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => document.getElementById('cta-section')?.scrollIntoView({ behavior: 'smooth' }), 600);
    }
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <Link to="/" className="nav-logo" onClick={close}>
          <div className="nav-logo-icon">TN</div>
          <div className="nav-logo-wrap">
            <span className="nav-logo-text">Tech Nandu</span>
            <span className="nav-logo-sub">SOFTWARE</span>
          </div>
        </Link>

        <ul className="nav-links">
          <li><Link to="/softwares" className={isActive('/softwares')}>Softwares</Link></li>
          <li><Link to="/services"  className={isActive('/services')}>Services</Link></li>
          <li><Link to="/blog"      className={isActive('/blog')}>Blog</Link></li>
          <li><Link to="/about"     className={isActive('/about')}>About Us</Link></li>
          <li><Link to="/career"    className={isActive('/career')}>Career</Link></li>
          <li><Link to="/contact"   className={isActive('/contact')}>Contact Us</Link></li>
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
          <button className="nav-demo-btn" onClick={goToDemo}>
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
          <Link to="/softwares" className={isActive('/softwares')} onClick={close}>💻 Softwares</Link>
          <Link to="/services"  className={isActive('/services')}  onClick={close}>🛠️ Services</Link>
          <Link to="/blog"      className={isActive('/blog')}      onClick={close}>📝 Blog</Link>
          <Link to="/about"     className={isActive('/about')}     onClick={close}>👥 About Us</Link>
          <Link to="/career"    className={isActive('/career')}    onClick={close}>💼 Career</Link>
          <Link to="/contact"   className={isActive('/contact')}   onClick={close}>📞 Contact Us</Link>
          <div className="mobile-nav-divider" />
          <a href="tel:+919991327697" className="nav-btn" onClick={close}>📞 Call Us</a>
          <a href="https://wa.me/919991327697" target="_blank" rel="noreferrer"
            className="nav-btn nav-wa" onClick={close}>💬 WhatsApp</a>
          <Link to="/admin" className="nav-btn nav-admin" onClick={close}>🔐 Admin Panel</Link>
          <div className="mobile-nav-divider" />
          <button className="mobile-nav-cta" onClick={goToDemo}>
            🎯 Get Free Demo
          </button>
        </div>
      )}
    </>
  );
}
