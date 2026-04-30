import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import './BlogPage.css';

const POSTS = [
  {
    id:1, tag:'Billing Software', color:'#43E97B', img:'/images/blog-1.jpg',
    title:'5 Reasons Every Small Business Needs a Billing Software',
    summary:'Manual billing in registers leads to errors, delays, and lost revenue. Here\'s why switching to GST-ready billing software changes everything for small businesses.',
    date:'April 2026', readTime:'4 min read',
    points:[
      'Auto-generate GST invoices in seconds — no manual calculation errors',
      'Track pending payments and send auto-reminders via WhatsApp',
      'Generate monthly, quarterly & yearly reports instantly',
      'Works on phone, tablet, and computer — bill from anywhere',
      'Fully compliant with GST rules — no penalties, no worries',
    ],
  },
  {
    id:2, tag:'Inventory Management', color:'#6C63FF', img:'/images/blog-2.jpg',
    title:'How to Choose the Right Inventory Software for Your Shop',
    summary:'Whether you run a kirana store, wholesale business, or retail chain — picking the right stock management software saves time and prevents loss.',
    date:'April 2026', readTime:'5 min read',
    points:[
      'Look for real-time stock tracking with low-stock alerts',
      'Barcode scanning speeds up billing and stock counting',
      'Multi-warehouse support if you have more than one location',
      'Supplier management and purchase order tracking',
      'GST-ready reports for easy filing',
    ],
  },
  {
    id:3, tag:'GST & Compliance', color:'#f59e0b', img:'/images/blog-3.jpg',
    title:'What is GST Billing? A Simple Guide for Indian Businesses',
    summary:'GST (Goods and Services Tax) can feel complicated, but with the right software it becomes effortless. This guide explains GST billing in simple language.',
    date:'March 2026', readTime:'6 min read',
    points:[
      'GST invoice must include GSTIN, HSN/SAC codes, and tax breakup',
      'CGST + SGST for same-state transactions, IGST for interstate',
      'E-invoicing mandatory for businesses above ₹5 crore turnover',
      'Input Tax Credit (ITC) reduces your overall tax liability',
      'Good billing software auto-calculates all of this for you',
    ],
  },
  {
    id:4, tag:'Digital Growth', color:'#FF6584', img:'/images/blog-4.jpg',
    title:'Benefits of Going Digital for Your Business Operations',
    summary:'Many Indian businesses still run on paper and manual processes. Moving to digital tools — even simple ones — makes a massive difference in speed, accuracy, and profit.',
    date:'March 2026', readTime:'4 min read',
    points:[
      'Reduce data entry errors that cost money and time',
      'Access your business data anytime from your phone',
      'Send professional invoices and reports to clients instantly',
      'Track employees, stock, and sales all in one place',
      'Build a professional image that wins more customer trust',
    ],
  },
  {
    id:5, tag:'Software Guide', color:'#a855f7', img:'/images/blog-5.jpg',
    title:'Subscription vs One-Time Software: Which is Right for You?',
    summary:'When buying business software, you have two options — monthly subscription or one-time custom purchase. Here\'s how to decide which fits your business better.',
    date:'February 2026', readTime:'5 min read',
    points:[
      'Subscription: Low upfront cost (₹2,000/month), always updated',
      'One-Time: Higher upfront (₹50,000+), yours forever with no monthly fees',
      'Subscription is better if you\'re just starting and want to test',
      'One-Time is better for large businesses with specific custom needs',
      'Both include free training and setup at Tech Nandu',
    ],
  },
  {
    id:6, tag:'Business Tips', color:'#06b6d4', img:'/images/blog-6.jpg',
    title:'How WhatsApp Alerts are Changing Business Communication',
    summary:'WhatsApp is not just for chatting — businesses are now using it to send invoices, payment reminders, stock alerts, and delivery confirmations automatically.',
    date:'February 2026', readTime:'3 min read',
    points:[
      'Send GST invoices directly to customer\'s WhatsApp in one click',
      'Auto-reminder for overdue payments without manual follow-up',
      'Low stock alerts sent directly to your phone via WhatsApp',
      '147 customers can be notified about offers with one click',
      'Tech Nandu software integrates WhatsApp alerts in all modules',
    ],
  },
];

export default function BlogPage() {
  const navigate   = useNavigate();
  const [open, setOpen] = useState(null);

  const goToContact = () => navigate('/contact');

  return (
    <div className="blog-page">
      <Navbar />

      {/* HERO */}
      <section className="blog-hero">
        <div className="blog-hero-bg b1" />
        <div className="blog-hero-bg b2" />
        <div className="blog-hero-content">
          <div className="blog-badge">📝 Tech Nandu Blog</div>
          <h1>Business Tips &amp;<br /><span className="gradient-text">Software Guides</span></h1>
          <p>Practical guides, tips, and insights to help Indian businesses grow with the right technology.</p>
        </div>
      </section>

      {/* POSTS */}
      <section className="blog-posts-section">
        <div className="blog-posts-grid">
          {POSTS.map(post => (
            <article key={post.id} className="blog-card" style={{ '--bp-color': post.color }}>
              {/* thumbnail — shows if image exists, else colored banner */}
              <div className="bc-thumb" style={{ background:`${post.color}18` }}>
                <img
                  src={post.img}
                  alt={post.title}
                  className="bc-thumb-img"
                  onError={e => { e.target.style.display='none'; }}
                />
                <span className="bc-thumb-tag" style={{background:`${post.color}25`,color:post.color}}>{post.tag}</span>
              </div>
              <div className="bc-top">
                <div className="bc-meta">
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
              <h2>{post.title}</h2>
              <p className="bc-summary">{post.summary}</p>

              {open === post.id ? (
                <>
                  <ul className="bc-points">
                    {post.points.map((p,i) => (
                      <li key={i}><span style={{color:post.color}}>✓</span> {p}</li>
                    ))}
                  </ul>
                  <div className="bc-footer">
                    <button className="bc-btn-read" style={{color:post.color}} onClick={() => setOpen(null)}>
                      ↑ Show Less
                    </button>
                    <button className="bc-btn-cta" onClick={goToContact}>
                      📞 Contact Us
                    </button>
                  </div>
                </>
              ) : (
                <div className="bc-footer">
                  <button className="bc-btn-read" style={{color:post.color}} onClick={() => setOpen(post.id)}>
                    Read More →
                  </button>
                  <button className="bc-btn-cta" onClick={goToContact}>
                    Get Free Demo
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="blog-cta-section">
        <div className="blog-cta-inner">
          <h2>Have Questions About Software for Your Business?</h2>
          <p>Talk to our team — free consultation, no pressure. We'll recommend the best solution for your specific business type.</p>
          <div className="blog-cta-btns">
            <a href="https://wa.me/919991327697?text=Hi%20Tech%20Nandu%2C%20I%20read%20your%20blog%20and%20want%20to%20know%20more." target="_blank" rel="noreferrer" className="btn btn-wa">
              💬 WhatsApp Us
            </a>
            <button className="btn btn-primary" onClick={goToContact}>
              📞 Get Free Consultation
            </button>
          </div>
          <div className="blog-contact-row">
            <a href="tel:+919991327697">📞 +91 99913-27697</a>
            <span>·</span>
            <a href="tel:+919811017225">📞 +91 98110-17225</a>
            <span>·</span>
            <a href="mailto:tech.nandu.96@gmail.com">📧 tech.nandu.96@gmail.com</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">TN Tech Nandu</div>
        <p>Empowering Indian Businesses with Smart Technology</p>
        <div className="footer-links">
          <span>📞 <a href="tel:+919991327697" style={{color:'inherit',textDecoration:'none'}}>+91 99913-27697</a></span>
          <span>📞 <a href="tel:+919811017225" style={{color:'inherit',textDecoration:'none'}}>+91 98110-17225</a></span>
          <span>📧 <a href="mailto:tech.nandu.96@gmail.com" style={{color:'inherit',textDecoration:'none'}}>tech.nandu.96@gmail.com</a></span>
          <span>📍 Tikri Border, Baba Haridas Colony, Delhi – 110041</span>
        </div>
        <p className="footer-copy">© 2026 Tech Nandu. All rights reserved.</p>
      </footer>
    </div>
  );
}
