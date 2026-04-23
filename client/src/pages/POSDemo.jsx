import { useState } from 'react';
import DemoLayout from '../components/DemoLayout.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import './Demo.css';

const MENU = [
  { icon:'🏪', label:'POS Counter'  },
  { icon:'📋', label:'Products'     },
  { icon:'📜', label:'Today Bills'  },
  { icon:'📊', label:'Sales Report' },
];

const INIT_PRODUCTS = [
  { id:1, icon:'🍫', name:'Dairy Milk',       price:50,  cat:'FMCG',      stock:145 },
  { id:2, icon:'🍟', name:'Lays Chips',        price:20,  cat:'FMCG',      stock:230 },
  { id:3, icon:'🥤', name:'Pepsi 500ml',       price:45,  cat:'Beverages',  stock:80  },
  { id:4, icon:'🍪', name:'Parle-G Biscuit',  price:10,  cat:'FMCG',      stock:400 },
  { id:5, icon:'🧴', name:'Colgate 200g',      price:85,  cat:'Personal',   stock:12  },
  { id:6, icon:'🥛', name:'Amul Milk 1L',     price:60,  cat:'Dairy',      stock:45  },
  { id:7, icon:'☕', name:'Nescafe Classic',   price:180, cat:'Beverages',  stock:8   },
  { id:8, icon:'🍞', name:'Britannia Bread',  price:45,  cat:'Bakery',     stock:22  },
  { id:9, icon:'🧃', name:'Real Juice 1L',    price:95,  cat:'Beverages',  stock:3   },
];

const BILLS = [
  { no:'#087', amount:235,  payment:'UPI',  items:3, time:'10:42 AM' },
  { no:'#086', amount:540,  payment:'Cash', items:6, time:'10:18 AM' },
  { no:'#085', amount:1200, payment:'Card', items:8, time:'9:55 AM'  },
  { no:'#084', amount:89,   payment:'UPI',  items:1, time:'9:30 AM'  },
  { no:'#083', amount:320,  payment:'Cash', items:4, time:'9:05 AM'  },
];

const HOURLY = [
  {h:'9 AM', s:320},{h:'10 AM',s:760},{h:'11 AM',s:540},{h:'12 PM',s:890},
  {h:'1 PM', s:420},{h:'2 PM', s:680},{h:'3 PM', s:240},
];

const CAT_SALES = [
  {cat:'FMCG',      amount:2450, qty:180, pct:38},
  {cat:'Beverages', amount:1890, qty:52,  pct:30},
  {cat:'Dairy',     amount:840,  qty:14,  pct:13},
  {cat:'Personal',  amount:680,  qty:8,   pct:11},
  {cat:'Bakery',    amount:495,  qty:11,  pct:8 },
];

export default function POSDemo() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const tMuted  = isDark ? 'rgba(255,255,255,.6)' : '#475569';
  const tBorder = isDark ? 'rgba(255,255,255,.15)' : '#cbd5e1';
  const tBgOff  = isDark ? 'rgba(255,255,255,.04)' : '#f8fafc';

  const [tab,      setTab]      = useState(0);
  const [cart,     setCart]     = useState([]);
  const [payment,  setPayment]  = useState('Cash');
  const [bills,    setBills]    = useState(BILLS);
  const [products, setProducts] = useState(INIT_PRODUCTS);
  const [toast,    setToast]    = useState(null);
  const [catFil,   setCatFil]   = useState('All');

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const addToCart = (prod) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === prod.id);
      if (ex) return prev.map(c => c.id===prod.id ? {...c, qty:c.qty+1} : c);
      return [...prev, { ...prod, qty:1 }];
    });
    showToast(`${prod.name} added to cart`);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(c => c.id===id ? {...c, qty:Math.max(0,c.qty+delta)} : c).filter(c=>c.qty>0));
  };

  const total      = cart.reduce((s,c) => s + c.price*c.qty, 0);
  const gst        = Math.round(total * 0.05);
  const grandTotal = total + gst;

  const processPayment = () => {
    if (!cart.length) return showToast('Cart khali hai!','error');
    const newBill = {
      no:`#${88+bills.length}`, amount:grandTotal, payment,
      items:cart.reduce((s,c)=>s+c.qty,0),
      time: new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'}),
    };
    setBills(prev => [newBill, ...prev]);
    setCart([]);
    showToast(`Bill ${newBill.no} processed! ₹${grandTotal} via ${payment}`);
  };

  const cats     = ['All', ...new Set(INIT_PRODUCTS.map(p=>p.cat))];
  const filtered = catFil==='All' ? products : products.filter(p=>p.cat===catFil);
  const todaySales = bills.reduce((s,b)=>s+b.amount,0);
  const maxHourly  = Math.max(...HOURLY.map(h=>h.s));

  return (
    <DemoLayout title="Point of Sale (POS)" icon="🏪" color="#f59e0b" variant="neon"
      menuItems={MENU} activeItem={tab} onMenuClick={setTab}>

      <div className="stats-grid">
        <div className="stat-card"><div className="s-label">Today's Sales</div><div className="s-val" style={{color:'#f59e0b'}}>₹{todaySales.toLocaleString('en-IN')}</div><div className="s-chg up">▲ {bills.length} bills</div></div>
        <div className="stat-card"><div className="s-label">Cart Items</div><div className="s-val" style={{color:'#6C63FF'}}>{cart.reduce((s,c)=>s+c.qty,0)}</div><div className="s-chg up">Current bill</div></div>
        <div className="stat-card"><div className="s-label">Cart Total</div><div className="s-val" style={{color:'#43E97B'}}>₹{grandTotal}</div><div className="s-chg up">incl. GST 5%</div></div>
        <div className="stat-card"><div className="s-label">Products</div><div className="s-val" style={{color:'#FF6584'}}>{products.length}</div><div className="s-chg up">In catalog</div></div>
      </div>

      {/* POS COUNTER */}
      {tab===0 && (
        <div className="pos-grid">
          <div>
            <div className="card" style={{padding:'14px 16px'}}>
              <div style={{display:'flex',gap:8,marginBottom:12,flexWrap:'wrap'}}>
                {cats.map(c=>(
                  <button key={c} onClick={()=>setCatFil(c)} style={{padding:'5px 12px',borderRadius:20,border:'1px solid',borderColor:catFil===c?'#f59e0b':tBorder,background:catFil===c?'rgba(245,158,11,.2)':'transparent',color:catFil===c?'#f59e0b':tMuted,cursor:'pointer',fontSize:'.75rem',fontWeight:600}}>{c}</button>
                ))}
              </div>
              <div className="product-grid">
                {filtered.map(p=>(
                  <div key={p.id} className="product-tile" onClick={()=>addToCart(p)}>
                    <div className="pt-icon">{p.icon}</div>
                    <div className="pt-name">{p.name}</div>
                    <div className="pt-price">₹{p.price}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card" style={{padding:'16px 18px',display:'flex',flexDirection:'column'}}>
            <h3 style={{fontSize:'.9rem',marginBottom:14,borderBottom:'1px solid var(--border)',paddingBottom:10}}>🛒 Current Bill</h3>
            {cart.length===0 ? (
              <div style={{textAlign:'center',color:'var(--muted)',padding:'30px 0',fontSize:'.85rem'}}>Click products to add to cart</div>
            ) : (
              <div style={{flex:1,overflowY:'auto',maxHeight:260}}>
                {cart.map(item=>(
                  <div key={item.id} className="cart-item">
                    <div>{item.icon} {item.name}</div>
                    <div className="cart-qty">
                      <button className="qty-btn" onClick={()=>updateQty(item.id,-1)}>−</button>
                      <span style={{minWidth:20,textAlign:'center',fontWeight:700}}>{item.qty}</span>
                      <button className="qty-btn" onClick={()=>updateQty(item.id,1)}>+</button>
                    </div>
                    <div style={{color:'#43E97B',fontWeight:700}}>₹{item.price*item.qty}</div>
                  </div>
                ))}
              </div>
            )}
            <div style={{borderTop:'1px solid var(--border)',paddingTop:12,marginTop:12}}>
              <div className="inv-line"><span style={{color:'var(--muted)'}}>Subtotal</span><span>₹{total}</span></div>
              <div className="inv-line"><span style={{color:'var(--muted)'}}>GST (5%)</span><span>₹{gst}</span></div>
              <div className="inv-line" style={{fontWeight:800,fontSize:'1.1rem',color:'#43E97B'}}><span>Total</span><span>₹{grandTotal}</span></div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginTop:12}}>
              {['Cash','UPI','Card'].map(m=>(
                <button key={m} onClick={()=>setPayment(m)} style={{padding:'10px',borderRadius:10,border:'1px solid',borderColor:payment===m?'#f59e0b':tBorder,background:payment===m?'rgba(245,158,11,.2)':tBgOff,color:payment===m?'#f59e0b':tMuted,cursor:'pointer',fontWeight:700,fontSize:'.8rem'}}>
                  {m==='Cash'?'💵':m==='UPI'?'📱':'💳'} {m}
                </button>
              ))}
            </div>
            <button className="pay-btn" style={{background:'linear-gradient(135deg,#f59e0b,#ff6b6b)',marginTop:10}} onClick={processPayment}>
              ✅ Process Payment — ₹{grandTotal}
            </button>
          </div>
        </div>
      )}

      {/* PRODUCTS MANAGEMENT */}
      {tab===1 && (
        <div className="card">
          <div className="card-header">
            <h3>📋 Product Catalog</h3>
            <button className="btn-add" onClick={()=>showToast('New product form opened!')}>+ Add Product</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {products.map(p=>(
                  <tr key={p.id}>
                    <td style={{fontWeight:700,color:'#f59e0b'}}>{p.id}</td>
                    <td><span style={{marginRight:6}}>{p.icon}</span>{p.name}</td>
                    <td><span className="badge badge-blue">{p.cat}</span></td>
                    <td style={{fontWeight:700}}>₹{p.price}</td>
                    <td>{p.stock} units</td>
                    <td>
                      <span className={`badge ${p.stock>20?'badge-green':p.stock>5?'badge-yellow':'badge-red'}`}>
                        {p.stock>20?'In Stock':p.stock>5?'Low Stock':'Critical'}
                      </span>
                    </td>
                    <td style={{display:'flex',gap:6}}>
                      <button className="btn-del" onClick={()=>showToast(`${p.name} updated!`)}>✏️</button>
                      <button className="btn-del" onClick={()=>{setProducts(pr=>pr.filter(x=>x.id!==p.id));showToast(`${p.name} removed`,'error');}}>🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TODAY'S BILLS */}
      {tab===2 && (
        <div className="card">
          <div className="card-header">
            <h3>📜 Today's Bills</h3>
            <span style={{color:'#43E97B',fontSize:'.85rem',fontWeight:700}}>Total: ₹{todaySales.toLocaleString('en-IN')}</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Bill#</th><th>Amount</th><th>Items</th><th>Payment</th><th>Time</th></tr></thead>
              <tbody>
                {bills.map((b,i)=>(
                  <tr key={i}>
                    <td style={{fontWeight:700,color:'#f59e0b'}}>{b.no}</td>
                    <td style={{fontWeight:700}}>₹{b.amount}</td>
                    <td>{b.items} items</td>
                    <td><span className={`badge ${b.payment==='UPI'?'badge-blue':b.payment==='Card'?'badge-yellow':'badge-green'}`}>{b.payment}</span></td>
                    <td style={{color:'var(--muted)'}}>{b.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SALES REPORT */}
      {tab===3 && (
        <>
          <div className="card" style={{padding:'18px 20px',marginBottom:16}}>
            <div className="card-header" style={{padding:'0 0 14px',border:'none'}}>
              <h3>⏰ Hourly Sales — Today</h3>
              <button className="btn-add" onClick={()=>showToast('Report exported as PDF!')}>📄 Export PDF</button>
            </div>
            <div className="bar-chart" style={{height:130}}>
              {HOURLY.map(d=>(
                <div key={d.h} className="bar-col">
                  <div style={{color:'#f59e0b',fontSize:'.72rem',fontWeight:700,marginBottom:4}}>₹{d.s}</div>
                  <div className="bar-fill" style={{height:`${(d.s/maxHourly)*110}px`,background:'linear-gradient(to top,#f59e0b,#FF6584)'}} />
                  <div className="bar-label" style={{fontSize:'.7rem'}}>{d.h}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>🏷️ Category-wise Sales</h3>
              <span style={{color:'var(--muted)',fontSize:'.85rem'}}>Today's breakdown</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Category</th><th>Revenue</th><th>Qty Sold</th><th>Share</th><th>Trend</th></tr></thead>
                <tbody>
                  {CAT_SALES.map((c,i)=>(
                    <tr key={i}>
                      <td style={{fontWeight:700}}>{c.cat}</td>
                      <td style={{color:'#43E97B',fontWeight:700}}>₹{c.amount.toLocaleString('en-IN')}</td>
                      <td>{c.qty} units</td>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <div style={{width:80,height:6,borderRadius:3,background:isDark?'rgba(255,255,255,.1)':'#e2e8f0',overflow:'hidden'}}>
                            <div style={{width:`${c.pct}%`,height:'100%',background:'linear-gradient(90deg,#f59e0b,#FF6584)',borderRadius:3}} />
                          </div>
                          <span style={{fontSize:'.8rem',color:'var(--muted)'}}>{c.pct}%</span>
                        </div>
                      </td>
                      <td><span className="badge badge-green">↑ Good</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.type==='success'?'✅':'❌'} {toast.msg}</div>}
    </DemoLayout>
  );
}
