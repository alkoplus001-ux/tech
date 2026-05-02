import { useEffect } from 'react';

const BASE = 'https://technandu.com';
const DEFAULT_IMG = `${BASE}/og-image.jpg`;

export default function SEOHead({ title, description, keywords, canonical, ogImage, ogType = 'website', jsonLd }) {
  useEffect(() => {
    const url = canonical || `${BASE}${window.location.pathname}`;
    const img = ogImage || DEFAULT_IMG;

    const setMeta = (attr, key, val) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    };

    const setLink = (rel, val) => {
      let el = document.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }
      el.setAttribute('href', val);
    };

    if (title) document.title = title;
    if (description) setMeta('name', 'description', description);
    if (keywords) setMeta('name', 'keywords', keywords);
    setMeta('name', 'robots', 'index, follow');
    setLink('canonical', url);

    setMeta('property', 'og:title', title || '');
    setMeta('property', 'og:description', description || '');
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('property', 'og:site_name', 'Tech Nandu');
    setMeta('property', 'og:locale', 'en_IN');

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title || '');
    setMeta('name', 'twitter:description', description || '');
    setMeta('name', 'twitter:image', img);

    if (jsonLd) {
      let el = document.querySelector('script[data-seo="jsonld"]');
      if (!el) {
        el = document.createElement('script');
        el.setAttribute('type', 'application/ld+json');
        el.setAttribute('data-seo', 'jsonld');
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(jsonLd);
    }
  }, [title, description, keywords, canonical, ogImage, ogType, jsonLd]);

  return null;
}
