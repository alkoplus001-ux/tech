import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import './DemoLayout.css';

export default function DemoLayout({ title, icon, color, menuItems, activeItem, onMenuClick, children, variant = 'default' }) {
  const { theme, toggle } = useTheme();

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
          <div className="live-dot" style={{ background: color }} />
          <span style={{ color }}>Live</span>
        </div>
      </div>

      <div className="demo-body">
        {/* Sidebar */}
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
            <div>📞 +91 93061-74393</div>
            <div>
              💬 <a href="https://wa.me/919667191540" target="_blank" rel="noreferrer"
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
    </div>
  );
}
