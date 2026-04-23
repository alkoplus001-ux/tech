import { useState, useEffect, useCallback } from 'react';
import DemoLayout from '../components/DemoLayout.jsx';
import './Demo.css';

const MENU = [
  { icon:'📊', label:'Dashboard'    },
  { icon:'👤', label:'Employees'    },
  { icon:'➕', label:'Add Employee' },
  { icon:'📅', label:'Attendance'   },
  { icon:'🏖️', label:'Leave Mgmt'  },
  { icon:'💰', label:'Payroll'      },
];
const DEPTS = ['All','Engineering','Marketing','Sales','HR','Finance','Operations'];

const ATTENDANCE = [
  { name:'Rahul Sharma',  dept:'Engineering', in:'9:02 AM', out:'6:15 PM', hrs:'9h 13m', status:'Present' },
  { name:'Priya Patel',   dept:'Marketing',   in:'9:15 AM', out:'6:00 PM', hrs:'8h 45m', status:'Present' },
  { name:'Amit Kumar',    dept:'Sales',        in:'—',       out:'—',       hrs:'—',      status:'Leave'   },
  { name:'Sunita Singh',  dept:'HR',           in:'9:00 AM', out:'5:45 PM', hrs:'8h 45m', status:'Present' },
  { name:'Vikram Nair',   dept:'Finance',      in:'9:30 AM', out:'6:30 PM', hrs:'9h 00m', status:'Present' },
  { name:'Deepa Mehta',   dept:'Engineering',  in:'8:55 AM', out:'5:55 PM', hrs:'9h 00m', status:'Present' },
];

const LEAVES = [
  { name:'Amit Kumar',    type:'Sick Leave',   from:'20 Apr', to:'22 Apr', days:3, reason:'Fever',         status:'Approved' },
  { name:'Priya Patel',   type:'Casual Leave', from:'25 Apr', to:'25 Apr', days:1, reason:'Personal work', status:'Pending'  },
  { name:'Rahul Sharma',  type:'Annual Leave', from:'01 May', to:'05 May', days:5, reason:'Vacation',      status:'Pending'  },
  { name:'Deepa Mehta',   type:'Sick Leave',   from:'10 Apr', to:'10 Apr', days:1, reason:'Doctor visit',  status:'Approved' },
];

const statusBadge = s => {
  if (s==='Active')   return <span className="badge badge-green">{s}</span>;
  if (s==='On Leave') return <span className="badge badge-yellow">{s}</span>;
  if (s==='Inactive') return <span className="badge badge-red">{s}</span>;
  if (s==='Present')  return <span className="badge badge-green">{s}</span>;
  if (s==='Leave')    return <span className="badge badge-yellow">{s}</span>;
  if (s==='Approved') return <span className="badge badge-green">{s}</span>;
  if (s==='Pending')  return <span className="badge badge-yellow">{s}</span>;
  if (s==='Rejected') return <span className="badge badge-red">{s}</span>;
};

export default function HRDemo() {
  const [tab,      setTab]  = useState(0);
  const [emps,     setEmps] = useState([]);
  const [loading,  setLoad] = useState(true);
  const [search,   setSrch] = useState('');
  const [dept,     setDept] = useState('All');
  const [modal,    setModal]= useState(false);
  const [toast,    setToast]= useState(null);
  const [leaves,   setLeaves]=useState(LEAVES);
  const [form, setForm]     = useState({ name:'', department:'Engineering', position:'', phone:'', email:'', salary:'', status:'Active' });

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const load = useCallback(async () => {
    setLoad(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (dept !== 'All') params.set('department', dept);
      const res  = await fetch(`/api/hr?${params}`);
      const data = await res.json();
      setEmps(data.data || []);
    } catch { showToast('Load failed','error'); }
    finally { setLoad(false); }
  }, [search, dept]);

  useEffect(() => { load(); }, [load]);

  const handleMenuClick = (i) => { setTab(i); if (i===2) setModal(true); };

  const handleAdd = async () => {
    if (!form.name||!form.position) return showToast('Name aur position required!','error');
    try {
      const res  = await fetch('/api/hr',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,salary:Number(form.salary)})});
      const data = await res.json();
      if(data.success){ showToast(`${data.data.name} added!`); setModal(false); setForm({name:'',department:'Engineering',position:'',phone:'',email:'',salary:'',status:'Active'}); load(); setTab(1); }
    } catch { showToast('Add failed','error'); }
  };

  const handleDelete = async (id, name) => {
    if(!confirm(`Delete ${name}?`)) return;
    await fetch(`/api/hr/${id}`,{method:'DELETE'});
    showToast(`${name} removed`); load();
  };

  const handleLeave = (i, action) => {
    setLeaves(prev => prev.map((l,idx)=>idx===i?{...l,status:action==='approve'?'Approved':'Rejected'}:l));
    showToast(action==='approve'?'Leave approved!':'Leave rejected.');
  };

  const active  = emps.filter(e=>e.status==='Active').length;
  const onLeave = emps.filter(e=>e.status==='On Leave').length;
  const avgSal  = emps.length ? Math.round(emps.reduce((s,e)=>s+(e.salary||0),0)/emps.length) : 0;
  const totalPayroll = emps.reduce((s,e)=>s+(e.salary||0),0);

  const EmployeeTable = () => (
    <div className="card">
      <div className="card-header">
        <h3>👤 Employee Directory</h3>
        <div className="table-actions">
          <input className="search-bar" placeholder="🔍 Search..." value={search} onChange={e=>setSrch(e.target.value)} />
          <select className="search-bar" style={{width:'130px'}} value={dept} onChange={e=>setDept(e.target.value)}>
            {DEPTS.map(d=><option key={d}>{d}</option>)}
          </select>
          <button className="btn-add" onClick={()=>{setTab(2);setModal(true);}}>+ Add Employee</button>
        </div>
      </div>
      <div className="table-wrap">
        {loading ? <div className="demo-loading">Loading...</div> : (
          <table>
            <thead><tr><th>Emp ID</th><th>Name</th><th>Department</th><th>Position</th><th>Phone</th><th>Salary</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {emps.length===0
                ? <tr><td colSpan={8} className="empty-row">No employees found.</td></tr>
                : emps.map(e=>(
                <tr key={e._id}>
                  <td style={{color:'#6C63FF',fontWeight:700}}>{e.empId}</td>
                  <td style={{fontWeight:600}}>🧑 {e.name}</td>
                  <td><span className="badge badge-blue">{e.department}</span></td>
                  <td>{e.position}</td>
                  <td style={{color:'var(--muted)'}}>{e.phone}</td>
                  <td style={{color:'#43E97B',fontWeight:700}}>₹{(e.salary||0).toLocaleString('en-IN')}</td>
                  <td>{statusBadge(e.status)}</td>
                  <td><button className="btn-del" onClick={()=>handleDelete(e._id,e.name)}>🗑</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return (
    <DemoLayout title="HR Management" icon="👥" color="#FF6584" variant="warm"
      menuItems={MENU} activeItem={tab} onMenuClick={handleMenuClick}>

      <div className="stats-grid">
        <div className="stat-card"><div className="s-label">Total Employees</div><div className="s-val" style={{color:'#FF6584'}}>{emps.length}</div><div className="s-chg up">Team strength</div></div>
        <div className="stat-card"><div className="s-label">Active Today</div><div className="s-val" style={{color:'#43E97B'}}>{active}</div><div className="s-chg up">▲ Present</div></div>
        <div className="stat-card"><div className="s-label">On Leave</div><div className="s-val" style={{color:'#f59e0b'}}>{onLeave}</div><div className="s-chg down">Today</div></div>
        <div className="stat-card"><div className="s-label">Avg Salary</div><div className="s-val" style={{color:'#6C63FF'}}>₹{(avgSal/1000).toFixed(0)}K</div><div className="s-chg up">Per month</div></div>
      </div>

      {/* TAB 0 — Dashboard */}
      {tab === 0 && (
        <>
          <EmployeeTable />
          <div className="card" style={{padding:'18px 20px',marginTop:16}}>
            <h3 style={{fontSize:'.88rem',marginBottom:14}}>📊 Department Distribution</h3>
            <div className="bar-chart">
              {DEPTS.filter(d=>d!=='All').map(d=>{
                const n = emps.filter(e=>e.department===d).length;
                const max = Math.max(...DEPTS.filter(x=>x!=='All').map(d2=>emps.filter(e=>e.department===d2).length),1);
                return (
                  <div key={d} className="bar-col">
                    <div style={{fontSize:'.65rem',color:'#FF6584',fontWeight:700,marginBottom:4}}>{n}</div>
                    <div className="bar-fill" style={{height:`${Math.max((n/max)*80,4)}px`,background:'linear-gradient(to top,#FF6584,#f093fb)'}} />
                    <div className="bar-label">{d.slice(0,4)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* TAB 1 — Employees */}
      {tab === 1 && <EmployeeTable />}

      {/* TAB 2 — Add Employee (shows table while modal open) */}
      {tab === 2 && <EmployeeTable />}

      {/* TAB 3 — Attendance */}
      {tab === 3 && (
        <div className="card">
          <div className="card-header">
            <h3>📅 Today's Attendance — {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</h3>
            <div style={{display:'flex',gap:8}}>
              <span style={{color:'#43E97B',fontSize:'.82rem',fontWeight:600}}>Present: {ATTENDANCE.filter(a=>a.status==='Present').length}</span>
              <span style={{color:'#f59e0b',fontSize:'.82rem',fontWeight:600}}>Leave: {ATTENDANCE.filter(a=>a.status==='Leave').length}</span>
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Employee</th><th>Department</th><th>Check In</th><th>Check Out</th><th>Hours</th><th>Status</th></tr></thead>
              <tbody>
                {ATTENDANCE.map((a,i)=>(
                  <tr key={i}>
                    <td style={{fontWeight:600}}>🧑 {a.name}</td>
                    <td><span className="badge badge-blue">{a.dept}</span></td>
                    <td style={{color:'#43E97B',fontWeight:600}}>{a.in}</td>
                    <td style={{color:'#FF6584',fontWeight:600}}>{a.out}</td>
                    <td style={{color:'var(--muted)'}}>{a.hrs}</td>
                    <td>{statusBadge(a.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4 — Leave */}
      {tab === 4 && (
        <div className="card">
          <div className="card-header">
            <h3>🏖️ Leave Applications</h3>
            <button className="btn-add" onClick={()=>showToast('Leave application submitted!')}>+ Apply Leave</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {leaves.map((l,i)=>(
                  <tr key={i}>
                    <td style={{fontWeight:600}}>{l.name}</td>
                    <td>{l.type}</td>
                    <td>{l.from}</td>
                    <td>{l.to}</td>
                    <td style={{textAlign:'center',fontWeight:700}}>{l.days}</td>
                    <td style={{color:'var(--muted)',fontSize:'.8rem'}}>{l.reason}</td>
                    <td>{statusBadge(l.status)}</td>
                    <td>
                      {l.status==='Pending' && (
                        <div style={{display:'flex',gap:5}}>
                          <button className="btn-edit" onClick={()=>handleLeave(i,'approve')}>✓ Approve</button>
                          <button className="btn-del"  onClick={()=>handleLeave(i,'reject')}>✕ Reject</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5 — Payroll */}
      {tab === 5 && (
        <>
          <div className="stats-grid">
            <div className="stat-card"><div className="s-label">Total Payroll</div><div className="s-val" style={{color:'#10b981'}}>₹{(totalPayroll/1000).toFixed(0)}K</div><div className="s-chg up">This month</div></div>
            <div className="stat-card"><div className="s-label">Employees Paid</div><div className="s-val" style={{color:'#43E97B'}}>{emps.length}</div><div className="s-chg up">All processed</div></div>
            <div className="stat-card"><div className="s-label">PF (12%)</div><div className="s-val" style={{color:'#6C63FF'}}>₹{((totalPayroll*0.12)/1000).toFixed(0)}K</div><div className="s-chg up">Contributed</div></div>
            <div className="stat-card"><div className="s-label">TDS</div><div className="s-val" style={{color:'#f59e0b'}}>₹{((totalPayroll*0.08)/1000).toFixed(0)}K</div><div className="s-chg up">Deducted</div></div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3>💰 April 2026 Payroll</h3>
              <div style={{display:'flex',gap:8}}>
                <button className="btn-add" onClick={()=>showToast('Payroll processed! Bank transfer initiated.')}>▶ Run Payroll</button>
                <button className="btn-edit" onClick={()=>showToast('Payslips sent to all employees!')}>📧 Send Payslips</button>
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Emp ID</th><th>Name</th><th>Basic</th><th>HRA (40%)</th><th>PF (12%)</th><th>TDS</th><th>Net Pay</th><th>Status</th></tr></thead>
                <tbody>
                  {emps.length===0
                    ? <tr><td colSpan={8} className="empty-row">No employees found.</td></tr>
                    : emps.map(e=>{
                    const basic = e.salary||0;
                    const hra   = Math.round(basic*0.4);
                    const pf    = Math.round(basic*0.12);
                    const tds   = Math.round(basic*0.08);
                    const net   = basic + hra - pf - tds;
                    return (
                      <tr key={e._id}>
                        <td style={{color:'#6C63FF',fontWeight:700}}>{e.empId}</td>
                        <td style={{fontWeight:600}}>{e.name}</td>
                        <td>₹{basic.toLocaleString('en-IN')}</td>
                        <td>₹{hra.toLocaleString('en-IN')}</td>
                        <td style={{color:'#f59e0b'}}>₹{pf.toLocaleString('en-IN')}</td>
                        <td style={{color:'#FF6584'}}>₹{tds.toLocaleString('en-IN')}</td>
                        <td style={{color:'#43E97B',fontWeight:800}}>₹{net.toLocaleString('en-IN')}</td>
                        <td><span className="badge badge-green">Paid</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ADD MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal">
            <div className="modal-head">
              <h3>👤 Add New Employee</h3>
              <button className="close-btn" onClick={()=>setModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group"><label>Full Name *</label><input className="form-control" placeholder="e.g. Rahul Sharma" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} /></div>
                <div className="form-group"><label>Department *</label>
                  <select className="form-control" value={form.department} onChange={e=>setForm(p=>({...p,department:e.target.value}))}>
                    {DEPTS.filter(d=>d!=='All').map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Position *</label><input className="form-control" placeholder="e.g. Software Developer" value={form.position} onChange={e=>setForm(p=>({...p,position:e.target.value}))} /></div>
                <div className="form-group"><label>Phone</label><input className="form-control" placeholder="+91 XXXXX" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} /></div>
                <div className="form-group"><label>Email</label><input className="form-control" type="email" placeholder="name@company.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} /></div>
                <div className="form-group"><label>Monthly Salary (₹)</label><input className="form-control" type="number" placeholder="e.g. 45000" value={form.salary} onChange={e=>setForm(p=>({...p,salary:e.target.value}))} /></div>
                <div className="form-group"><label>Status</label>
                  <select className="form-control" value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>
                    <option>Active</option><option>On Leave</option><option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="form-footer">
                <button className="btn-cancel" onClick={()=>setModal(false)}>Cancel</button>
                <button className="btn-add" onClick={handleAdd}>💾 Save Employee</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.type==='success'?'✅':'❌'} {toast.msg}</div>}
    </DemoLayout>
  );
}
