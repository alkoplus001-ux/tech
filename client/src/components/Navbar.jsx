import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggle } = useTheme();

  const scrollTo = (id) => {
    if (location.pathname === '/') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <div className="nav-logo-icon">⚡</div>
        <span className="nav-logo-text">Tech Nandu</span>
      </Link>

      <ul className="nav-links">
        <li><button className="nav-btn" onClick={() => scrollTo('templates')}>Templates</button></li>
        <li><button className="nav-btn" onClick={() => scrollTo('features')}>Features</button></li>
        <li><a href="tel:+919667191540" className="nav-btn">📞 Call</a></li>
        <li>
          <a href="https://wa.me/919667191540" target="_blank" rel="noreferrer" className="nav-btn nav-wa">
            💬 WhatsApp
          </a>
        </li>
        <li><Link to="/admin" className="nav-btn nav-admin">Admin</Link></li>
      </ul>

      <div style={{ display:'flex', gap:10, alignItems:'center' }}>
        <button
          className="theme-toggle"
          onClick={toggle}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button className="btn btn-primary btn-sm" onClick={() => scrollTo('cta-section')}>
          Free Demo
        </button>
      </div>
    </nav>
  );
}
