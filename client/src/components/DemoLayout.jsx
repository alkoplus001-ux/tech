import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import './DemoLayout.css';

export default function DemoLayout({ title, icon, color, menuItems, activeItem, onMenuClick, children, variant = 'default' }) {
  const { theme, toggle } = useTheme();
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <div className={`demo-shell variant-${variant}`}>

      {/* Top bar */}
      <div className="demo-topbar" style={{ borderBottom: `2px solid ${color}28` }}>
        <div className="demo-topbar-left">
          <Link to="/" className="back-btn">← Back</Link>
          <div className="demo-title">
            <span className="demo-title-icon" style={{ background: `${color}22` }}>{icon}</span>
            <div>
              <h2>{title}</h2>
              <span className="demo-badge">Live Demo — Tech Nandu</span>
            </div>
          </div>
        </div>
        <div className="demo-topbar-right">
          <button
            className="demo-theme-toggle"
            onClick={toggle}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {/* Mobile: info button to show contact */}
          <button
            className="demo-info-btn"
            onClick={() => setInfoOpen(o => !o)}
            title="Contact Info"
          >
            ℹ️
          </button>
          <div className="live-dot" style={{ background: color }} />
          <span className="live-label" style={{ color }}>Live</span>
        </div>
      </div>

      {/* Mobile info sheet */}
      {infoOpen && (
        <>
          <div className="demo-info-backdrop" onClick={() => setInfoOpen(false)} />
          <div className="demo-info-sheet">
            <div className="demo-info-sheet-head">
              <span>⚡ Tech Nandu</span>
              <button onClick={() => setInfoOpen(false)}>✕</button>
            </div>
            <a href="tel:+919991327697" className="demo-info-row">📞 +91 99913-27697</a>
            <a href="tel:+919811017225" className="demo-info-row">📞 +91 98110-17225</a>
            <a href="https://wa.me/919991327697" target="_blank" rel="noreferrer" className="demo-info-row" style={{color:'#25D366'}}>
              💬 WhatsApp Chat
            </a>
            <div className="demo-info-row" style={{opacity:.6,fontSize:'.75rem'}}>
              📍 Tikri Border, Baba Haridas Colony, Delhi – 110041
            </div>
          </div>
        </>
      )}

      <div className="demo-body">
        {/* Sidebar — desktop only */}
        <aside className="demo-sidebar">
          <div className="sidebar-section-label">Navigation</div>
          {menuItems.map((item, i) => (
            <button
              key={i}
              className={`sidebar-item ${activeItem === i ? 'active' : ''}`}
              style={activeItem === i ? { background: `${color}18`, borderColor: `${color}40` } : {}}
              onClick={() => onMenuClick(i)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <div className="sidebar-divider" />
          <div className="sidebar-section-label">Quick Info</div>
          <div className="sidebar-info">
            <div>⚡ Tech Nandu</div>
            <div>📞 +91 96671-91540</div>
            <div>📞 +91 80103-47835</div>
            <div>
              💬 <a href="https://wa.me/919991327697" target="_blank" rel="noreferrer"
                style={{ color:'#25D366', textDecoration:'none' }}>WhatsApp</a>
            </div>
            <div style={{ fontSize:'.65rem', lineHeight:1.5, marginTop:4, opacity:.6 }}>
              Tikri Border, Delhi–110041
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="demo-main">{children}</main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="mobile-tabs">
        {menuItems.map((item, i) => (
          <button
            key={i}
            className={`mobile-tab ${activeItem === i ? 'active' : ''}`}
            style={activeItem === i ? { color: color, borderTopColor: color } : {}}
            onClick={() => onMenuClick(i)}
          >
            <span className="mobile-tab-icon">{item.icon}</span>
            <span className="mobile-tab-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
