import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

export default function AdminPanel() {
  const [contacts,  setContacts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [toast,     setToast]     = useState(null);
  const [filter,    setFilter]    = useState('');

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const load = async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/contact');
      const data = await res.json();
      setContacts(data.data || []);
    } catch { showToast('Failed to load','error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); const t = setInterval(load, 30000); return ()=>clearInterval(t); }, []);

  const deleteLead = async (id) => {
    if (!confirm('Delete this lead?')) return;
    await fetch(`/api/contact/${id}`, { method:'DELETE' });
    setContacts(prev => prev.filter(c=>c._id!==id));
    showToast('Lead deleted');
  };

  const exportCSV = () => {
    const rows = [['#','Name','Phone','Email','Business','Message','Date']];
    contacts.forEach((c,i) => rows.push([i+1,c.name,c.phone,c.email||'',c.business||'',c.message||'',new Date(c.createdAt).toLocaleString('en-IN')]));
    const csv = rows.map(r => r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = `technandu_leads_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    showToast('CSV exported!');
  };

  const now      = new Date();
  const today    = contacts.filter(c => new Date(c.createdAt).toDateString() === now.toDateString()).length;
  const thisWeek = contacts.filter(c => (now - new Date(c.createdAt)) < 7*864e5).length;
  const thisMonth= contacts.filter(c => { const d=new Date(c.createdAt); return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear(); }).length;

  const filtered = contacts.filter(c =>
    !filter || c.name?.toLowerCase().includes(filter.toLowerCase()) || c.phone?.includes(filter) || c.business?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="admin-page">
      <div className="admin-nav">
        <div className="admin-logo">⚡ Tech Nandu</div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <span className="admin-badge">🔐 Admin Panel</span>
          <Link to="/" className="back-link">← Website</Link>
        </div>
      </div>

      <div className="admin-body">
        <div className="admin-head">
          <div>
            <h1>📊 Lead Dashboard</h1>
            <p>Saare demo requests yahan — real-time MongoDB data</p>
          </div>
          <div style={{display:'flex',gap:10}}>
            <button className="btn-export" onClick={exportCSV}>📥 Export CSV</button>
            <button className="btn-refresh" onClick={load}>🔄 Refresh</button>
          </div>
        </div>

        {/* Stats */}
        <div className="admin-stats">
          <div className="a-stat"><div className="a-label">Total Leads</div><div className="a-val" style={{color:'#6C63FF'}}>{contacts.length}</div></div>
          <div className="a-stat"><div className="a-label">Today</div><div className="a-val" style={{color:'#43E97B'}}>{today}</div></div>
          <div className="a-stat"><div className="a-label">This Week</div><div className="a-val" style={{color:'#f59e0b'}}>{thisWeek}</div></div>
          <div className="a-stat"><div className="a-label">This Month</div><div className="a-val" style={{color:'#FF6584'}}>{thisMonth}</div></div>
        </div>

        {/* Filter */}
        <div style={{marginBottom:16}}>
          <input className="a-search" placeholder="🔍 Filter by name, phone, or business..." value={filter} onChange={e=>setFilter(e.target.value)} />
        </div>

        {/* Table */}
        <div className="admin-card">
          <div className="admin-card-head">
            <h3>📋 All Demo Requests (Latest First)</h3>
            <span style={{color:'var(--muted)',fontSize:'.8rem'}}>Auto-refreshes every 30s</span>
          </div>
          {loading ? (
            <div className="a-loading">⏳ Loading contacts...</div>
          ) : filtered.length === 0 ? (
            <div className="a-empty">
              <div style={{fontSize:'2.5rem',marginBottom:10}}>📭</div>
              <div>{contacts.length===0 ? 'Koi lead nahi abhi. Website pe form fill hoga to yahan dikhega.' : 'No results for your search.'}</div>
            </div>
          ) : (
            <div style={{overflowX:'auto'}}>
              <table className="a-table">
                <thead><tr><th>#</th><th>Name</th><th>Phone / WhatsApp</th><th>Email</th><th>Business</th><th>Message</th><th>Date & Time</th><th>Actions</th></tr></thead>
                <tbody>
                  {filtered.map((c,i)=>(
                    <tr key={c._id}>
                      <td style={{color:'var(--muted)'}}>{filtered.length-i}</td>
                      <td style={{fontWeight:700}}>👤 {c.name}</td>
                      <td style={{color:'#43E97B',fontWeight:600}}>📞 {c.phone}</td>
                      <td style={{color:'var(--muted)'}}>{c.email||'—'}</td>
                      <td>{c.business||'—'}</td>
                      <td style={{color:'var(--muted)',maxWidth:160,whiteSpace:'pre-wrap',fontSize:'.78rem'}}>{c.message||'—'}</td>
                      <td style={{color:'var(--muted)',fontSize:'.78rem',whiteSpace:'nowrap'}}>{new Date(c.createdAt).toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</td>
                      <td>
                        <div style={{display:'flex',gap:6}}>
                          <a className="wa-link" href={`https://wa.me/91${c.phone?.replace(/\D/g,'')}`} target="_blank" rel="noreferrer">💬 WA</a>
                          <button className="btn-del" onClick={()=>deleteLead(c._id)}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {toast && <div className={`toast ${toast.type}`}>{toast.type==='success'?'✅':'❌'} {toast.msg}</div>}
    </div>
  );
}
