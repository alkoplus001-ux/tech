import { useState, useEffect, useCallback } from 'react';
import DemoLayout from '../components/DemoLayout.jsx';
const API = import.meta.env.VITE_API_URL;
import './Demo.css';

const MENU = [
  { icon:'📊', label:'Dashboard'   },
  { icon:'📦', label:'Products'    },
  { icon:'➕', label:'Add Product' },
  { icon:'🏭', label:'Suppliers'   },
  { icon:'📋', label:'Reports'     },
];

const CATS = ['All','Electronics','Grocery','Clothing','Footwear','FMCG'];

const SUPPLIERS = [
  { name:'Samsung India',   contact:'9876000001', category:'Electronics', products:12, status:'Active'   },
  { name:'Nike Dist.',      contact:'9876000002', category:'Footwear',    products:8,  status:'Active'   },
  { name:'India Gate',      contact:'9876000003', category:'Grocery',     products:24, status:'Active'   },
  { name:'HP India',        contact:'9876000004', category:'Electronics', products:6,  status:'Active'   },
  { name:'Rupa Co.',        contact:'9876000005', category:'Clothing',    products:32, status:'Active'   },
  { name:'Colgate India',   contact:'9876000006', category:'FMCG',        products:15, status:'Inactive' },
  { name:'boAt Lifestyle',  contact:'9876000007', category:'Electronics', products:9,  status:'Active'   },
];

const statusBadge = s => {
  if (s === 'In Stock')     return <span className="badge badge-green">{s}</span>;
  if (s === 'Low Stock')    return <span className="badge badge-yellow">{s}</span>;
  if (s === 'Out of Stock') return <span className="badge badge-red">{s}</span>;
  if (s === 'Active')       return <span className="badge badge-green">{s}</span>;
  if (s === 'Inactive')     return <span className="badge badge-red">{s}</span>;
};

export default function InventoryDemo() {
  const [tab,      setTab]      = useState(0);
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [cat,      setCat]      = useState('All');
  const [modal,    setModal]    = useState(false);
  const [toast,    setToast]    = useState(null);
  const [form,     setForm]     = useState({ name:'', sku:'', category:'Electronics', stock:'', price:'', supplier:'' });

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (cat !== 'All') params.set('category', cat);
      const res  = await fetch(`${API}/api/inventory?${params}`);
      const data = await res.json();
      setProducts(data.data || []);
    } catch { showToast('Load failed','error'); }
    finally { setLoading(false); }
  }, [search, cat]);

  useEffect(() => { load(); }, [load]);

  const handleMenuClick = (i) => {
    setTab(i);
    if (i === 2) setModal(true);
  };

  const handleAdd = async () => {
    if (!form.name || !form.stock || !form.price) return showToast('Name, stock aur price required!','error');
    try {
      const res  = await fetch(`${API}/api/inventory`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({...form, stock:Number(form.stock), price:Number(form.price)}) });
      const data = await res.json();
      if (data.success) { showToast(`"${data.data.name}" added!`); setModal(false); setForm({name:'',sku:'',category:'Electronics',stock:'',price:'',supplier:''}); load(); setTab(1); }
    } catch { showToast('Add failed','error'); }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`${API}/api/inventory/${id}`, { method:'DELETE' });
    showToast(`"${name}" deleted`);
    load();
  };

  const totalVal = products.reduce((s,p) => s+p.stock*p.price, 0);
  const lowStock = products.filter(p=>p.status==='Low Stock').length;
  const outStock = products.filter(p=>p.status==='Out of Stock').length;

  // ── VIEWS ──────────────────────────────────────────────────────────────────

  const StatsRow = () => (
    <div className="stats-grid">
      <div className="stat-card"><div className="s-label">Total Products</div><div className="s-val" style={{color:'#6C63FF'}}>{products.length}</div><div className="s-chg up">▲ Active inventory</div></div>
      <div className="stat-card"><div className="s-label">Low Stock Items</div><div className="s-val" style={{color:'#f59e0b'}}>{lowStock}</div><div className="s-chg down">⚠ Need reorder</div></div>
      <div className="stat-card"><div className="s-label">Out of Stock</div><div className="s-val" style={{color:'#FF6584'}}>{outStock}</div><div className="s-chg down">✕ Not available</div></div>
      <div className="stat-card"><div className="s-label">Total Stock Value</div><div className="s-val" style={{color:'#43E97B'}}>₹{(totalVal/1000).toFixed(0)}K</div><div className="s-chg up">▲ Current value</div></div>
    </div>
  );

  const ProductTable = ({ showSearch=true }) => (
    <div className="card">
      <div className="card-header">
        <h3>📦 Product List</h3>
        {showSearch && (
          <div className="table-actions">
            <input className="search-bar" placeholder="🔍 Search..." value={search} onChange={e=>setSearch(e.target.value)} />
            <select className="search-bar" style={{width:'130px'}} value={cat} onChange={e=>setCat(e.target.value)}>
              {CATS.map(c=><option key={c}>{c}</option>)}
            </select>
            <button className="btn-add" onClick={()=>{ setTab(2); setModal(true); }}>+ Add Product</button>
          </div>
        )}
      </div>
      <div className="table-wrap">
        {loading ? <div className="demo-loading">Loading...</div> : (
          <table>
            <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Stock</th><th>Price</th><th>Supplier</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {products.length === 0
                ? <tr><td colSpan={8} className="empty-row">No products. Click "Add Product" to add one!</td></tr>
                : products.map(p=>(
                <tr key={p._id}>
                  <td style={{fontWeight:600}}>{p.name}</td>
                  <td style={{color:'var(--muted)'}}>{p.sku||'—'}</td>
                  <td>{p.category}</td>
                  <td style={{fontWeight:700}}>{p.stock} pcs</td>
                  <td style={{color:'#43E97B',fontWeight:700}}>₹{p.price.toLocaleString('en-IN')}</td>
                  <td style={{color:'var(--muted)'}}>{p.supplier||'—'}</td>
                  <td>{statusBadge(p.status)}</td>
                  <td><button className="btn-del" onClick={()=>handleDelete(p._id,p.name)}>🗑</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  const ChartRow = () => {
    const catCounts = CATS.filter(c=>c!=='All').map(c=>({ c, n: products.filter(p=>p.category===c).length }));
    const maxN = Math.max(...catCounts.map(x=>x.n), 1);
    return (
      <div className="card" style={{padding:'18px 20px'}}>
        <h3 style={{fontSize:'.88rem',marginBottom:14}}>📊 Stock by Category</h3>
        <div className="bar-chart">
          {catCounts.map(({c,n})=>(
            <div key={c} className="bar-col">
              <div style={{fontSize:'.7rem',color:'#6C63FF',fontWeight:700,marginBottom:4}}>{n}</div>
              <div className="bar-fill" style={{height:`${Math.max((n/maxN)*80,4)}px`,background:'linear-gradient(to top,#6C63FF,#8B5CF6)'}} />
              <div className="bar-label">{c.slice(0,5)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <DemoLayout title="Inventory Management" icon="📦" color="#6C63FF" variant="glass"
      menuItems={MENU} activeItem={tab} onMenuClick={handleMenuClick}>

      {/* TAB 0 — Dashboard */}
      {tab === 0 && (
        <>
          <StatsRow />
          <ProductTable showSearch={false} />
          <div style={{marginTop:16}}><ChartRow /></div>
        </>
      )}

      {/* TAB 1 — Products */}
      {tab === 1 && (
        <>
          <StatsRow />
          <ProductTable showSearch={true} />
        </>
      )}

      {/* TAB 2 — Add Product (modal only, stays on products) */}
      {tab === 2 && (
        <>
          <StatsRow />
          <ProductTable showSearch={true} />
        </>
      )}

      {/* TAB 3 — Suppliers */}
      {tab === 3 && (
        <>
          <div className="stats-grid">
            <div className="stat-card"><div className="s-label">Total Suppliers</div><div className="s-val" style={{color:'#6C63FF'}}>{SUPPLIERS.length}</div><div className="s-chg up">Registered</div></div>
            <div className="stat-card"><div className="s-label">Active</div><div className="s-val" style={{color:'#43E97B'}}>{SUPPLIERS.filter(s=>s.status==='Active').length}</div><div className="s-chg up">Working</div></div>
            <div className="stat-card"><div className="s-label">Total Products Supplied</div><div className="s-val" style={{color:'#f59e0b'}}>{SUPPLIERS.reduce((s,x)=>s+x.products,0)}</div><div className="s-chg up">Items</div></div>
            <div className="stat-card"><div className="s-label">Inactive</div><div className="s-val" style={{color:'#FF6584'}}>{SUPPLIERS.filter(s=>s.status==='Inactive').length}</div><div className="s-chg down">Review needed</div></div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3>🏭 Supplier Directory</h3>
              <button className="btn-add" onClick={()=>showToast('Supplier added! (Demo)')}>+ Add Supplier</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Supplier Name</th><th>Contact</th><th>Category</th><th>Products</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {SUPPLIERS.map((s,i)=>(
                    <tr key={i}>
                      <td style={{fontWeight:600}}>🏭 {s.name}</td>
                      <td style={{color:'#43E97B'}}>📞 {s.contact}</td>
                      <td>{s.category}</td>
                      <td style={{textAlign:'center',fontWeight:700}}>{s.products}</td>
                      <td>{statusBadge(s.status)}</td>
                      <td>
                        <button className="btn-edit" onClick={()=>showToast(`Calling ${s.name}...`)}>📞 Contact</button>
                        <button className="btn-del" style={{marginLeft:4}} onClick={()=>showToast(`Order placed with ${s.name}!`)}>📦 Order</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 4 — Reports */}
      {tab === 4 && (
        <>
          <div className="stats-grid">
            <div className="stat-card"><div className="s-label">Total Stock Value</div><div className="s-val" style={{color:'#6C63FF'}}>₹{(totalVal/1000).toFixed(1)}K</div><div className="s-chg up">▲ Current</div></div>
            <div className="stat-card"><div className="s-label">Healthy Items</div><div className="s-val" style={{color:'#43E97B'}}>{products.filter(p=>p.status==='In Stock').length}</div><div className="s-chg up">Good stock</div></div>
            <div className="stat-card"><div className="s-label">Need Attention</div><div className="s-val" style={{color:'#f59e0b'}}>{lowStock+outStock}</div><div className="s-chg down">Low/Out</div></div>
            <div className="stat-card"><div className="s-label">Avg Product Price</div><div className="s-val" style={{color:'#FF6584'}}>₹{products.length ? Math.round(products.reduce((s,p)=>s+p.price,0)/products.length).toLocaleString('en-IN') : 0}</div><div className="s-chg up">Average</div></div>
          </div>
          <ChartRow />
          <div className="card" style={{padding:'18px 20px',marginTop:16}}>
            <h3 style={{fontSize:'.88rem',marginBottom:14}}>📋 Low Stock Alert Report</h3>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Product</th><th>Category</th><th>Current Stock</th><th>Min Required</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {products.filter(p=>p.status!=='In Stock').length === 0
                    ? <tr><td colSpan={6} className="empty-row">All products have healthy stock levels! 🎉</td></tr>
                    : products.filter(p=>p.status!=='In Stock').map(p=>(
                    <tr key={p._id}>
                      <td style={{fontWeight:600}}>{p.name}</td>
                      <td>{p.category}</td>
                      <td style={{color:'#FF6584',fontWeight:700}}>{p.stock} pcs</td>
                      <td style={{color:'var(--muted)'}}>20 pcs</td>
                      <td>{statusBadge(p.status)}</td>
                      <td><button className="btn-add" onClick={()=>showToast(`Reorder placed for ${p.name}!`)}>Reorder</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{textAlign:'right',marginTop:14,display:'flex',gap:10,justifyContent:'flex-end'}}>
              <button className="btn-add" onClick={()=>showToast('PDF report downloading...')}>📥 Export PDF</button>
              <button className="btn-edit" onClick={()=>showToast('Excel exported!')}>📊 Export Excel</button>
            </div>
          </div>
        </>
      )}

      {/* ADD MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal">
            <div className="modal-head">
              <h3>📦 Add New Product</h3>
              <button className="close-btn" onClick={()=>setModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group"><label>Product Name *</label><input className="form-control" placeholder="e.g. Samsung TV" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} /></div>
                <div className="form-group"><label>SKU Code</label><input className="form-control" placeholder="e.g. EL-001" value={form.sku} onChange={e=>setForm(p=>({...p,sku:e.target.value}))} /></div>
                <div className="form-group"><label>Category *</label>
                  <select className="form-control" value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                    {CATS.filter(c=>c!=='All').map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Stock Quantity *</label><input className="form-control" type="number" min="0" placeholder="0" value={form.stock} onChange={e=>setForm(p=>({...p,stock:e.target.value}))} /></div>
                <div className="form-group"><label>Price (₹) *</label><input className="form-control" type="number" min="0" placeholder="0" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))} /></div>
                <div className="form-group"><label>Supplier</label><input className="form-control" placeholder="Supplier name" value={form.supplier} onChange={e=>setForm(p=>({...p,supplier:e.target.value}))} /></div>
              </div>
              <div className="form-footer">
                <button className="btn-cancel" onClick={()=>setModal(false)}>Cancel</button>
                <button className="btn-add" onClick={handleAdd}>💾 Save Product</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.type==='success'?'✅':'❌'} {toast.msg}</div>}
    </DemoLayout>
  );
}
