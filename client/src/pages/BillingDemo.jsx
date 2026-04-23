import { useState, useEffect, useCallback } from 'react';
import DemoLayout from '../components/DemoLayout.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
const API = import.meta.env.VITE_API_URL;
import './Demo.css';

const MENU = [
  { icon:'📊', label:'Dashboard'   },
  { icon:'🧾', label:'Invoices'    },
  { icon:'➕', label:'New Invoice' },
  { icon:'👥', label:'Customers'   },
  { icon:'📋', label:'Reports'     },
];

const statusBadge = s => {
  if (s==='Paid')    return <span className="badge badge-green">Paid</span>;
  if (s==='Pending') return <span className="badge badge-yellow">Pending</span>;
  if (s==='Overdue') return <span className="badge badge-red">Overdue</span>;
};

export default function BillingDemo() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const tBgOff = isDark ? 'rgba(255,255,255,.04)' : '#f8fafc';
  const [tab,      setTab]      = useState(0);
  const [invoices, setInvoices] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [modal,    setModal]    = useState(false);
  const [preview,  setPreview]  = useState(null);
  const [toast,    setToast]    = useState(null);
  const [form,     setForm]     = useState({ customer:'', phone:'', gstRate:18, items:[{name:'',qty:1,price:''}] });

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/billing`);
      const data = await res.json();
      setInvoices(data.data || []);
    } catch { showToast('Load failed','error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleMenuClick = (i) => {
    setTab(i);
    if (i === 2) setModal(true);
  };

  const addItem    = () => setForm(p=>({...p, items:[...p.items,{name:'',qty:1,price:''}]}));
  const removeItem = i => setForm(p=>({...p, items:p.items.filter((_,idx)=>idx!==i)}));
  const updateItem = (i,field,val) => setForm(p=>{ const items=[...p.items]; items[i]={...items[i],[field]:val}; return {...p,items}; });

  const calcTotals = () => {
    const subtotal = form.items.reduce((s,it)=>s+(Number(it.qty)||0)*(Number(it.price)||0),0);
    const gst      = (subtotal*form.gstRate)/100;
    return { subtotal, gst, total: subtotal+gst };
  };

  const handleCreate = async () => {
    if (!form.customer||!form.items[0].name) return showToast('Customer name aur item required!','error');
    try {
      const res  = await fetch(`${API}/api/billing`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,items:form.items.map(it=>({...it,qty:Number(it.qty),price:Number(it.price)}))})});
      const data = await res.json();
      if(data.success){ showToast(`Invoice ${data.data.invoiceNo} created!`); setModal(false); setForm({customer:'',phone:'',gstRate:18,items:[{name:'',qty:1,price:''}]}); load(); setTab(1); }
    } catch { showToast('Create failed','error'); }
  };

  const updateStatus = async (id,status) => {
    await fetch(`${API}/api/billing/${id}/status`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})});
    showToast(`Marked as ${status}`); load();
  };

  const deleteInvoice = async (id) => {
    if(!confirm('Delete this invoice?')) return;
    await fetch(`${API}/api/billing/${id}`,{method:'DELETE'});
    showToast('Deleted'); load();
  };

  const paid    = invoices.filter(i=>i.status==='Paid').reduce((s,i)=>s+i.total,0);
  const pending = invoices.filter(i=>i.status==='Pending').reduce((s,i)=>s+i.total,0);
  const overdue = invoices.filter(i=>i.status==='Overdue').reduce((s,i)=>s+i.total,0);
  const { subtotal, gst, total } = calcTotals();

  // Unique customers from invoices
  const customers = [...new Map(invoices.map(inv=>[ inv.customer, { name:inv.customer, phone:inv.phone, invoices:invoices.filter(i=>i.customer===inv.customer).length, total:invoices.filter(i=>i.customer===inv.customer).reduce((s,i)=>s+i.total,0) }])).values()];

  const InvoiceTable = () => (
    <div className="card">
      <div className="card-header">
        <h3>🧾 Invoice List</h3>
        <button className="btn-add" onClick={()=>{ setTab(2); setModal(true); }}>+ New Invoice</button>
      </div>
      <div className="table-wrap">
        {loading ? <div className="demo-loading">Loading...</div> : (
          <table>
            <thead><tr><th>Invoice#</th><th>Customer</th><th>Phone</th><th>Items</th><th>GST</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {invoices.length===0
                ? <tr><td colSpan={8} className="empty-row">No invoices. Create one!</td></tr>
                : invoices.map(inv=>(
                <tr key={inv._id}>
                  <td style={{fontWeight:700,color:'#6C63FF',cursor:'pointer'}} onClick={()=>setPreview(inv)}>{inv.invoiceNo}</td>
                  <td style={{fontWeight:600}}>{inv.customer}</td>
                  <td style={{color:'var(--muted)'}}>{inv.phone}</td>
                  <td>{inv.items?.length} item{inv.items?.length!==1?'s':''}</td>
                  <td>₹{inv.gstAmt?.toFixed(0)}</td>
                  <td style={{fontWeight:700,color:'#43E97B'}}>₹{inv.total?.toLocaleString('en-IN')}</td>
                  <td>{statusBadge(inv.status)}</td>
                  <td>
                    <div style={{display:'flex',gap:5}}>
                      {inv.status!=='Paid'    && <button className="btn-edit" onClick={()=>updateStatus(inv._id,'Paid')}>✓ Paid</button>}
                      {inv.status!=='Overdue' && <button className="btn-del"  onClick={()=>updateStatus(inv._id,'Overdue')}>!</button>}
                      <button className="btn-del" onClick={()=>deleteInvoice(inv._id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return (
    <DemoLayout title="Billing & Invoicing" icon="🧾" color="#43E97B" variant="flat"
      menuItems={MENU} activeItem={tab} onMenuClick={handleMenuClick}>

      {/* Stats always visible */}
      <div className="stats-grid">
        <div className="stat-card"><div className="s-label">Total Invoices</div><div className="s-val" style={{color:'#6C63FF'}}>{invoices.length}</div><div className="s-chg up">All time</div></div>
        <div className="stat-card"><div className="s-label">Paid Amount</div><div className="s-val" style={{color:'#43E97B'}}>₹{(paid/1000).toFixed(1)}K</div><div className="s-chg up">▲ Collected</div></div>
        <div className="stat-card"><div className="s-label">Pending</div><div className="s-val" style={{color:'#f59e0b'}}>₹{(pending/1000).toFixed(1)}K</div><div className="s-chg down">⏳ Awaiting</div></div>
        <div className="stat-card"><div className="s-label">Overdue</div><div className="s-val" style={{color:'#FF6584'}}>₹{(overdue/1000).toFixed(1)}K</div><div className="s-chg down">⚠ Action needed</div></div>
      </div>

      {/* TAB 0 — Dashboard */}
      {tab === 0 && (
        <>
          <InvoiceTable />
          <div className="card" style={{padding:'18px 20px',marginTop:16}}>
            <h3 style={{fontSize:'.88rem',marginBottom:14}}>📊 Payment Status Breakdown</h3>
            <div className="bar-chart">
              {[{l:'Paid',v:paid,c:'#43E97B'},{l:'Pending',v:pending,c:'#f59e0b'},{l:'Overdue',v:overdue,c:'#FF6584'}].map(({l,v,c})=>{
                const max=Math.max(paid,pending,overdue,1);
                return(
                  <div key={l} className="bar-col">
                    <div style={{fontSize:'.72rem',color:c,fontWeight:700,marginBottom:4}}>₹{(v/1000).toFixed(1)}K</div>
                    <div className="bar-fill" style={{height:`${Math.max((v/max)*90,4)}px`,background:c}} />
                    <div className="bar-label">{l}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* TAB 1 — All Invoices */}
      {tab === 1 && <InvoiceTable />}

      {/* TAB 2 — New Invoice (shows table + modal) */}
      {tab === 2 && <InvoiceTable />}

      {/* TAB 3 — Customers */}
      {tab === 3 && (
        <div className="card">
          <div className="card-header">
            <h3>👥 Customer Directory</h3>
            <button className="btn-add" onClick={()=>showToast('Customer added! (Demo)')}>+ Add Customer</button>
          </div>
          <div className="table-wrap">
            {customers.length === 0
              ? <div className="demo-loading">No customers yet. Create some invoices first!</div>
              : (
              <table>
                <thead><tr><th>Customer Name</th><th>Phone</th><th>Total Invoices</th><th>Total Business</th><th>Action</th></tr></thead>
                <tbody>
                  {customers.map((c,i)=>(
                    <tr key={i}>
                      <td style={{fontWeight:700}}>👤 {c.name}</td>
                      <td style={{color:'#43E97B'}}>📞 {c.phone||'—'}</td>
                      <td style={{textAlign:'center',fontWeight:700}}>{c.invoices}</td>
                      <td style={{color:'#43E97B',fontWeight:700}}>₹{c.total?.toLocaleString('en-IN')}</td>
                      <td>
                        <button className="btn-edit" onClick={()=>showToast(`Viewing ${c.name}'s invoices`)}>View Invoices</button>
                        <button className="btn-add" style={{marginLeft:6}} onClick={()=>{ setForm(p=>({...p,customer:c.name,phone:c.phone||''})); setTab(2); setModal(true); }}>+ New Invoice</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 4 — Reports */}
      {tab === 4 && (
        <>
          <div className="card" style={{padding:'18px 20px'}}>
            <h3 style={{fontSize:'.88rem',marginBottom:14}}>📊 Revenue Summary</h3>
            <div className="bar-chart">
              {[{l:'Paid',v:paid,c:'#43E97B'},{l:'Pending',v:pending,c:'#f59e0b'},{l:'Overdue',v:overdue,c:'#FF6584'}].map(({l,v,c})=>{
                const max=Math.max(paid,pending,overdue,1);
                return(
                  <div key={l} className="bar-col">
                    <div style={{fontSize:'.72rem',color:c,fontWeight:700,marginBottom:4}}>₹{(v/1000).toFixed(1)}K</div>
                    <div className="bar-fill" style={{height:`${Math.max((v/max)*90,4)}px`,background:c}} />
                    <div className="bar-label">{l}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card" style={{marginTop:16}}>
            <div className="card-header">
              <h3>📋 GST Report</h3>
              <div style={{display:'flex',gap:8}}>
                <button className="btn-add" onClick={()=>showToast('PDF downloading...')}>📥 PDF</button>
                <button className="btn-edit" onClick={()=>showToast('Excel exported!')}>📊 Excel</button>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Invoice#</th><th>Customer</th><th>Taxable Amt</th><th>GST%</th><th>GST Amt</th><th>Total</th><th>Status</th></tr></thead>
                <tbody>
                  {invoices.map(inv=>(
                    <tr key={inv._id}>
                      <td style={{color:'#6C63FF',fontWeight:700}}>{inv.invoiceNo}</td>
                      <td>{inv.customer}</td>
                      <td>₹{inv.subtotal?.toLocaleString('en-IN')}</td>
                      <td>{inv.gstRate}%</td>
                      <td style={{color:'#f59e0b'}}>₹{inv.gstAmt?.toFixed(2)}</td>
                      <td style={{fontWeight:700}}>₹{inv.total?.toLocaleString('en-IN')}</td>
                      <td>{statusBadge(inv.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* PREVIEW MODAL */}
      {preview && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setPreview(null)}>
          <div className="modal" style={{maxWidth:'500px'}}>
            <div className="modal-head">
              <h3>🧾 Invoice — {preview.invoiceNo}</h3>
              <button className="close-btn" onClick={()=>setPreview(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="invoice-preview">
                <div className="inv-head">
                  <div>
                    <div className="inv-co">TECH NANDU</div>
                    <div className="inv-num">📍 Tikri Border, Delhi – 110041</div>
                    <div className="inv-num">📞 +91 96671-91540</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="inv-num">{preview.invoiceNo}</div>
                    <div className="inv-num">{new Date(preview.createdAt).toLocaleDateString('en-IN')}</div>
                    <div className="inv-total">₹{preview.total?.toLocaleString('en-IN')}</div>
                    {statusBadge(preview.status)}
                  </div>
                </div>
                <div className="inv-line" style={{fontWeight:600,color:'var(--muted)',fontSize:'.75rem'}}><span>Item</span><span>Qty × Price</span></div>
                {preview.items?.map((it,i)=><div key={i} className="inv-line"><span>{it.name}</span><span>{it.qty} × ₹{it.price} = ₹{it.qty*it.price}</span></div>)}
                <div className="inv-line"><span>Subtotal</span><span>₹{preview.subtotal?.toLocaleString('en-IN')}</span></div>
                <div className="inv-line"><span>GST ({preview.gstRate}%)</span><span>₹{preview.gstAmt?.toFixed(2)}</span></div>
                <div className="inv-line" style={{fontWeight:800,fontSize:'1rem',color:'#43E97B'}}><span>Total</span><span>₹{preview.total?.toLocaleString('en-IN')}</span></div>
              </div>
              <div style={{textAlign:'center',marginTop:14}}>
                <button className="btn-add" onClick={()=>{showToast('PDF downloading!');setPreview(null);}}>📥 Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal" style={{maxWidth:'620px'}}>
            <div className="modal-head">
              <h3>🧾 Create New Invoice</h3>
              <button className="close-btn" onClick={()=>setModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group"><label>Customer Name *</label><input className="form-control" placeholder="e.g. Sharma Traders" value={form.customer} onChange={e=>setForm(p=>({...p,customer:e.target.value}))} /></div>
                <div className="form-group"><label>Phone</label><input className="form-control" placeholder="+91 XXXXX" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} /></div>
                <div className="form-group"><label>GST Rate (%)</label>
                  <select className="form-control" value={form.gstRate} onChange={e=>setForm(p=>({...p,gstRate:Number(e.target.value)}))}>
                    {[0,5,12,18,28].map(r=><option key={r} value={r}>{r}%</option>)}
                  </select>
                </div>
              </div>
              <div style={{margin:'14px 0 8px',fontSize:'.8rem',fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.5px'}}>Items</div>
              {form.items.map((it,i)=>(
                <div key={i} className="item-row">
                  <input className="form-control" placeholder="Item name" value={it.name} onChange={e=>updateItem(i,'name',e.target.value)} />
                  <input className="form-control" type="number" placeholder="Qty" value={it.qty} onChange={e=>updateItem(i,'qty',e.target.value)} style={{textAlign:'center'}} />
                  <input className="form-control" type="number" placeholder="Price ₹" value={it.price} onChange={e=>updateItem(i,'price',e.target.value)} />
                  <button className="btn-del" onClick={()=>removeItem(i)} disabled={form.items.length===1}>✕</button>
                </div>
              ))}
              <button className="add-item-btn" onClick={addItem}>+ Add Another Item</button>
              <div style={{background:tBgOff,border:'1px solid var(--border)',borderRadius:10,padding:'12px 16px',marginTop:14}}>
                <div className="inv-line"><span style={{color:'var(--muted)'}}>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                <div className="inv-line"><span style={{color:'var(--muted)'}}>GST ({form.gstRate}%)</span><span>₹{gst.toFixed(2)}</span></div>
                <div className="inv-line" style={{fontWeight:800,color:'#43E97B',fontSize:'1rem'}}><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div>
              </div>
              <div className="form-footer">
                <button className="btn-cancel" onClick={()=>setModal(false)}>Cancel</button>
                <button className="btn-add" onClick={handleCreate}>💾 Create Invoice</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.type==='success'?'✅':'❌'} {toast.msg}</div>}
    </DemoLayout>
  );
}
