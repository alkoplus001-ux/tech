import { useRef, useState } from 'react';
import './CatalogueCard.css';

export default function CatalogueCard({ product, onClose }) {
  const cardRef = useRef(null);
  const [busy, setBusy]   = useState(false);
  const [err,  setErr]    = useState('');

  const download = async () => {
    setBusy(true);
    setErr('');
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#1a1a22',
        logging: false,
        imageTimeout: 15000,
      });
      const a = document.createElement('a');
      a.download = `catalogue_${(product.sku || product.name).replace(/\s+/g, '_')}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    } catch {
      setErr('PNG generation failed. If your image is from Cloudinary, ensure CORS is enabled, or right-click → Save image.');
    } finally {
      setBusy(false);
    }
  };

  const brand    = (product.supplier || 'BRAND').toUpperCase();
  const catLabel = (product.category || 'PRODUCTS').toUpperCase();
  const specs    = product.specs    || 'Quality Material | Comfortable Fit | Durable Sole';
  const sizes    = product.sizes    || '6 - 10';
  const minOrder = product.minOrder || 'Set of 10';

  return (
    <div className="cat-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="cat-wrapper">

        {/* ── Card captured by html2canvas ── */}
        <div ref={cardRef} className="cat-card">

          {/* Brand Logo — top-left */}
          <div className="cat-logo">
            <div className="cat-logo-circle">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C12 2 6 7 6 12a6 6 0 0012 0c0-5-6-10-6-10z" fill="rgba(200,168,75,0.85)"/>
                <path d="M12 12v8M9 16l3 2 3-2" stroke="rgba(200,168,75,0.6)" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="cat-logo-text">
              <div className="cat-brand-name">{brand}</div>
              <div className="cat-brand-sub">{catLabel}</div>
            </div>
          </div>

          {/* Product Image — center-left */}
          <div className="cat-img-area">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="cat-product-img"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="cat-no-img">
                <span>📦</span>
                <p>No Image</p>
                <p className="cat-no-img-hint">Add an image URL when creating the product</p>
              </div>
            )}
          </div>

          {/* Thumbnails — bottom-left (only when image exists) */}
          {product.imageUrl && (
            <div className="cat-thumbs">
              {[0, 1, 2].map(i => (
                <div key={i} className="cat-thumb">
                  <img src={product.imageUrl} alt="" crossOrigin="anonymous" />
                </div>
              ))}
            </div>
          )}

          {/* Right Info Panel */}
          <div className="cat-info-panel">
            {/* Decorative strap visual */}
            <div className="cat-strap" />

            <div className="cat-info-block">
              <div className="cat-info-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M3 17l3-6 3 3 3-5 3 4 3-6" stroke="#c8a84b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="cat-info-content">
                <div className="cat-info-label">MODEL:</div>
                <div className="cat-info-val">{product.name}</div>
                {product.sku && <div className="cat-info-sku">{product.sku}</div>}
              </div>
            </div>

            <div className="cat-panel-divider" />

            <div className="cat-info-block">
              <div className="cat-info-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="#c8a84b" strokeWidth="1.8"/>
                  <path d="M7 8h10M7 12h7M7 16h5" stroke="#c8a84b" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="cat-info-content">
                <div className="cat-info-label">SPECIFICATIONS:</div>
                <div className="cat-info-val cat-specs">{specs}</div>
              </div>
            </div>

            <div className="cat-panel-divider" />

            <div className="cat-info-block">
              <div className="cat-info-icon-wrap">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#c8a84b" strokeWidth="1.8"/>
                  <path d="M12 7v5l3 3" stroke="#c8a84b" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="cat-info-content">
                <div className="cat-info-label">SIZES:</div>
                <div className="cat-info-val">{sizes}</div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="cat-bottom-bar">
            <div className="cat-bottom-main">
              <span className="cat-bottom-label">STANDARD CATALOGUE TEMPLATE</span>
              <span className="cat-bottom-sep">|</span>
              <span>Offer Price: <strong>Rs {product.price?.toLocaleString('en-IN') || '—'}</strong></span>
            </div>
            <div className="cat-bottom-sub">
              (Minimum Order: {minOrder})
            </div>
            <div className="cat-bottom-sparkle">✦</div>
          </div>
        </div>

        {/* ── Controls below card ── */}
        {err && <div className="cat-err">{err}</div>}
        <div className="cat-controls">
          <button className="cat-btn-close" onClick={onClose}>✕ Close</button>
          <button className="cat-btn-download" onClick={download} disabled={busy}>
            {busy ? '⏳ Generating...' : '⬇ Download PNG'}
          </button>
        </div>
      </div>
    </div>
  );
}
