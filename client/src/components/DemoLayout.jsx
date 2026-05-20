import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext.jsx';
import './DemoLayout.css';

const HOW_TO_USE = [
  { icon:'🧭', title:'Navigate Sections', desc:'Use the sidebar (desktop) or bottom tabs (mobile) to switch between Dashboard, Records, Reports & more.' },
  { icon:'➕', title:'Add New Records', desc:'Click the "+ Add" or "New" button on any table to open a form and add live data instantly.' },
  { icon:'🗑️', title:'Delete Records', desc:'Click the trash 🗑 icon on any row to remove a record from the demo.' },
  { icon:'🔍', title:'Search & Filter', desc:'Use the search bar and category dropdowns to filter records in real time.' },
  { icon:'📊', title:'View Reports & Charts', desc:'Go to the Reports tab to see visual bar charts and summary tables with export options.' },
  { icon:'📥', title:'Export Data', desc:'Use "Export PDF" or "Export Excel" in the Reports section to download data.' },
  { icon:'🌙', title:'Dark / Light Mode', desc:'Toggle the theme using the ☀️/🌙 button in the top bar — works across all demos.' },
  { icon:'📞', title:'Contact Us', desc:'Tap ℹ️ on mobile (or see sidebar) for direct WhatsApp, call, and email contact links.' },
];

export default function DemoLayout({ title, icon, color, menuItems, activeItem, onMenuClick, children, variant = 'default' }) {
  const { theme, toggle } = useTheme();
  const [infoOpen, setInfoOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

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
          <button
            className="demo-help-btn"
            onClick={() => setHelpOpen(true)}
            title="How to Use This Demo"
          >
            ❓
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
            <a href="mailto:tech.nandu.96@gmail.com" className="demo-info-row">📧 tech.nandu.96@gmail.com</a>
            <a href="https://wa.me/919991327697" target="_blank" rel="noreferrer" className="demo-info-row" style={{color:'#25D366'}}>
              💬 WhatsApp Chat
            </a>
            <div className="demo-info-row" style={{opacity:.6,fontSize:'.75rem'}}>
              📍 Tikri Border, Baba Haridas Colony, Delhi – 110041
            </div>
          </div>
        </>
      )}

      {/* HOW TO USE MODAL */}
      {helpOpen && (
        <div className="demo-help-overlay" onClick={() => setHelpOpen(false)}>
          <div className="demo-help-modal" onClick={e => e.stopPropagation()}>
            <div className="demo-help-head" style={{ borderBottom:`2px solid ${color}30` }}>
              <div>
                <div style={{ fontSize:'1.3rem', fontWeight:900 }}>❓ How to Use This Demo</div>
                <div style={{ fontSize:'.78rem', opacity:.6, marginTop:3 }}>This is a fully interactive live demo — try everything!</div>
              </div>
              <button className="close-btn" onClick={() => setHelpOpen(false)}>✕</button>
            </div>
            <div className="demo-help-body">
              <div className="demo-help-note" style={{ background:`${color}12`, border:`1px solid ${color}30`, borderRadius:12, padding:'12px 16px', marginBottom:18 }}>
                <strong style={{ color }}>Note:</strong> This is a demo environment. All data is sample/test data. You can add, delete, search, and export — nothing is permanent in demo mode.
              </div>
              <div className="demo-help-grid">
                {HOW_TO_USE.map((h, i) => (
                  <div key={i} className="demo-help-item">
                    <div className="demo-help-icon">{h.icon}</div>
                    <div>
                      <div className="demo-help-item-title">{h.title}</div>
                      <div className="demo-help-item-desc">{h.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="demo-help-cta">
                <div style={{ fontWeight:700, marginBottom:10 }}>Want this software for your business?</div>
                <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
                  <a href="tel:+919991327697" style={{ background:color, color:'#fff', padding:'10px 22px', borderRadius:10, fontWeight:700, fontSize:'.85rem', textDecoration:'none', display:'inline-block' }}>📞 Call Now</a>
                  <a href="https://wa.me/919991327697?text=Hi%20Tech%20Nandu%2C%20I%20saw%20the%20live%20demo%20and%20want%20to%20know%20more!" target="_blank" rel="noreferrer" style={{ background:'#25D366', color:'#fff', padding:'10px 22px', borderRadius:10, fontWeight:700, fontSize:'.85rem', textDecoration:'none', display:'inline-block' }}>💬 WhatsApp</a>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            <div><a href="tel:+919991327697" style={{color:'inherit',textDecoration:'none'}}>📞 +91 99913-27697</a></div>
            <div><a href="tel:+919811017225" style={{color:'inherit',textDecoration:'none'}}>📞 +91 98110-17225</a></div>
            <div><a href="mailto:tech.nandu.96@gmail.com" style={{color:'inherit',textDecoration:'none'}}>📧 tech.nandu.96@gmail.com</a></div>
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
        <main className="demo-main">
          {/* HOW TO USE GUIDE BANNER */}
          <div className="demo-guide-banner" style={{ borderColor:`${color}30`, background:`${color}08` }}>
            <div className="demo-guide-steps">
              <span className="demo-guide-step"><span style={{color}}>1.</span> Use sidebar or bottom tabs to navigate</span>
              <span className="demo-guide-sep">·</span>
              <span className="demo-guide-step"><span style={{color}}>2.</span> Click "+ Add" to add live records</span>
              <span className="demo-guide-sep">·</span>
              <span className="demo-guide-step"><span style={{color}}>3.</span> Delete with 🗑 icon on any row</span>
              <span className="demo-guide-sep">·</span>
              <span className="demo-guide-step"><span style={{color}}>4.</span> Export reports as PDF or Excel</span>
            </div>
            <button className="demo-guide-help-btn" style={{ color, borderColor:`${color}40` }} onClick={() => setHelpOpen(true)}>
              ❓ Full Guide
            </button>
          </div>
          {children}
        </main>
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
