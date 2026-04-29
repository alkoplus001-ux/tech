import { useState, useEffect, useCallback } from 'react';
import DemoLayout from '../components/DemoLayout.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
const API = import.meta.env.VITE_API_URL;
import './Demo.css';

const hexRgb = (hex) => {
  let h = (hex||'#888888').replace('#','');
  if (h.length===3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
};

const MENU = [
  { icon:'📊', label:'Dashboard'    },
  { icon:'🧾', label:'Invoices'     },
  { icon:'➕', label:'New Invoice'  },
  { icon:'👥', label:'Customers'    },
  { icon:'🖨️', label:'Challan'     },
  { icon:'📋', label:'Reports'      },
];

const CHALLAN_TEMPLATES = [
  {
    id: 'classic', name: 'Classic GST', desc: 'Traditional GST invoice format with purple accent',
    accent: '#6C63FF', headerBg: '#6C63FF', headerText: '#fff',
    bodyBg: '#fff', bodyText: '#1e293b', accentColor: '#6C63FF',
  },
  {
    id: 'modern', name: 'Modern Dark', desc: 'Bold dark theme with green highlights',
    accent: '#43E97B', headerBg: '#0f172a', headerText: '#43E97B',
    bodyBg: '#1a2535', bodyText: '#e2e8f0', accentColor: '#43E97B',
  },
  {
    id: 'minimal', name: 'Minimal Clean', desc: 'Light white layout with amber accents',
    accent: '#f59e0b', headerBg: '#fffbeb', headerText: '#1e293b',
    bodyBg: '#ffffff', bodyText: '#374151', accentColor: '#f59e0b',
  },
  {
    id: 'corporate', name: 'Corporate Blue', desc: 'Formal blue theme for professional invoices',
    accent: '#1d4ed8', headerBg: '#1d4ed8', headerText: '#fff',
    bodyBg: '#fff', bodyText: '#1e293b', accentColor: '#1d4ed8',
  },
];

const statusBadge = s => {
  if (s === 'Paid')    return <span className="badge badge-green">Paid</span>;
  if (s === 'Pending') return <span className="badge badge-yellow">Pending</span>;
  if (s === 'Overdue') return <span className="badge badge-red">Overdue</span>;
};

function ChallanPaper({ inv, tpl }) {
  if (!inv || !tpl) return null;
  return (
    <div className="challan-paper" style={{ background: tpl.bodyBg, color: tpl.bodyText, fontFamily: "'Segoe UI', sans-serif" }}>
      <div className="challan-header" style={{ background: tpl.headerBg, color: tpl.headerText }}>
        <div>
          <div className="challan-co-name" style={{ color: tpl.headerText }}>{`TECH NANDU`}</div>
          <div className="challan-co-addr" style={{ color: tpl.headerText, opacity: .82 }}>📍 Tikri Border, Baba Haridas Colony, Delhi – 110041</div>
          <div className="challan-co-addr" style={{ color: tpl.headerText, opacity: .82 }}>📞 +91 96671-91540  |  +91 80103-47835</div>
        </div>
        <div className="challan-title-block" style={{ borderLeftColor: tpl.id === 'minimal' ? tpl.accentColor : `${tpl.headerText}44` }}>
          <div className="challan-title" style={{ color: tpl.id === 'minimal' ? tpl.accentColor : tpl.headerText }}>TAX INVOICE</div>
          <div className="challan-inv-no" style={{ color: tpl.headerText, opacity: .78 }}>{inv.invoiceNo}</div>
        </div>
      </div>

      <div className="challan-meta" style={{ borderColor: `${tpl.accentColor}28`, background: `${tpl.accentColor}06`, color: tpl.bodyText }}>
        <div>
          <div style={{ color: tpl.accentColor, fontWeight: 700, fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 4 }}>Bill To</div>
          <div style={{ fontWeight: 700 }}>{inv.customer}</div>
          {inv.phone && <div style={{ opacity: .65, fontSize: '.8rem' }}>{inv.phone}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: tpl.accentColor, fontWeight: 700, fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 4 }}>Invoice Date</div>
          <div style={{ fontWeight: 700 }}>{new Date(inv.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
          <div style={{ marginTop: 4 }}>
            <span style={{
              background: inv.status === 'Paid' ? 'rgba(22,163,74,.15)' : inv.status === 'Overdue' ? 'rgba(220,38,38,.15)' : 'rgba(217,119,6,.15)',
              color: inv.status === 'Paid' ? '#16a34a' : inv.status === 'Overdue' ? '#dc2626' : '#d97706',
              padding: '2px 10px', borderRadius: 12, fontSize: '.68rem', fontWeight: 700,
            }}>{inv.status}</span>
          </div>
        </div>
      </div>

      <table className="challan-table" style={{ color: tpl.bodyText }}>
        <thead>
          <tr style={{ background: tpl.accentColor }}>
            <th style={{ color: '#fff', width: '5%' }}>#</th>
            <th style={{ color: '#fff' }}>Item Description</th>
            <th style={{ color: '#fff', width: '10%', textAlign: 'center' }}>Qty</th>
            <th style={{ color: '#fff', width: '18%', textAlign: 'right' }}>Unit Price</th>
            <th style={{ color: '#fff', width: '18%', textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {inv.items?.map((it, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? `${tpl.accentColor}07` : 'transparent' }}>
              <td style={{ color: tpl.bodyText }}>{i + 1}</td>
              <td style={{ color: tpl.bodyText, fontWeight: 500 }}>{it.name}</td>
              <td style={{ color: tpl.bodyText, textAlign: 'center' }}>{it.qty}</td>
              <td style={{ color: tpl.bodyText, textAlign: 'right' }}>₹{Number(it.price).toLocaleString('en-IN')}</td>
              <td style={{ color: tpl.bodyText, textAlign: 'right', fontWeight: 600 }}>₹{(it.qty * it.price).toLocaleString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="challan-totals" style={{ borderTopColor: `${tpl.accentColor}20`, color: tpl.bodyText }}>
        <div className="challan-total-row" style={{ color: tpl.bodyText }}><span>Subtotal</span><span>₹{inv.subtotal?.toLocaleString('en-IN')}</span></div>
        <div className="challan-total-row" style={{ color: tpl.bodyText }}><span>GST ({inv.gstRate}%)</span><span>₹{inv.gstAmt?.toFixed(2)}</span></div>
        <div className="challan-grand-total" style={{ color: tpl.accentColor, borderTopColor: tpl.accentColor }}>
          <span>Grand Total</span><span>₹{inv.total?.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="challan-footer" style={{ borderTopColor: `${tpl.accentColor}20`, color: tpl.bodyText }}>
        <div style={{ opacity: .55, fontSize: '.72rem' }}>Generated by Tech Nandu ERP • technandu.in</div>
        <div style={{ opacity: .55, fontSize: '.72rem' }}>Thank you for your business!</div>
      </div>
    </div>
  );
}

export default function BillingDemo() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const tBgOff = isDark ? 'rgba(255,255,255,.04)' : '#f8fafc';
  const [tab,             setTab]            = useState(0);
  const [invoices,        setInvoices]       = useState([]);
  const [loading,         setLoading]        = useState(true);
  const [modal,           setModal]          = useState(false);
  const [preview,         setPreview]        = useState(null);
  const [toast,           setToast]          = useState(null);
  const [form,            setForm]           = useState({ customer:'', phone:'', gstRate:18, items:[{name:'',qty:1,price:''}] });
  const [challanTemplate, setChallanTemplate] = useState('classic');
  const [printMode,       setPrintMode]      = useState(false);

  const activeTpl = CHALLAN_TEMPLATES.find(t => t.id === challanTemplate) || CHALLAN_TEMPLATES[0];

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/billing`);
      const data = await res.json();
      setInvoices(data.data || []);
    } catch { showToast('Failed to load invoices','error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleMenuClick = (i) => {
    setTab(i);
    if (i === 2) setModal(true);
  };

  const addItem    = () => setForm(p=>({...p,items:[...p.items,{name:'',qty:1,price:''}]}));
  const removeItem = i  => setForm(p=>({...p,items:p.items.filter((_,idx)=>idx!==i)}));
  const updateItem = (i,field,val) => setForm(p=>{ const items=[...p.items]; items[i]={...items[i],[field]:val}; return {...p,items}; });

  const calcTotals = () => {
    const subtotal = form.items.reduce((s,it)=>s+(Number(it.qty)||0)*(Number(it.price)||0),0);
    const gst      = (subtotal*form.gstRate)/100;
    return { subtotal, gst, total: subtotal+gst };
  };

  const handleCreate = async () => {
    if (!form.customer||!form.items[0].name) return showToast('Customer name and at least one item are required!','error');
    try {
      const res  = await fetch(`${API}/api/billing`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,items:form.items.map(it=>({...it,qty:Number(it.qty),price:Number(it.price)}))})});
      const data = await res.json();
      if(data.success){ showToast(`Invoice ${data.data.invoiceNo} created!`); setModal(false); setForm({customer:'',phone:'',gstRate:18,items:[{name:'',qty:1,price:''}]}); load(); setTab(1); }
    } catch { showToast('Failed to create invoice','error'); }
  };

  const updateStatus = async (id,status) => {
    await fetch(`${API}/api/billing/${id}/status`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})});
    showToast(`Marked as ${status}`); load();
  };

  const deleteInvoice = async (id) => {
    if(!confirm('Delete this invoice?')) return;
    await fetch(`${API}/api/billing/${id}`,{method:'DELETE'});
    showToast('Invoice deleted'); load();
  };

  const cutChallan = (inv) => { setPreview(inv); setPrintMode(true); };

  const downloadChallanPDF = (inv, tpl) => {
    const doc = new jsPDF({ unit:'mm', format:'a4' });
    const W   = doc.internal.pageSize.getWidth();

    const hRgb  = hexRgb(tpl.headerBg);
    const htRgb = hexRgb(tpl.headerText === '#fff' ? '#ffffff' : tpl.headerText);
    const aRgb  = hexRgb(tpl.accentColor);
    const bRgb  = hexRgb(tpl.bodyBg === '#fff' || tpl.bodyBg === '#ffffff' ? '#ffffff' : tpl.bodyBg);
    const btRgb = hexRgb(tpl.bodyText);
    const isDark = tpl.id === 'modern';

    // ── Header ────────────────────────────────────────────────────────
    doc.setFillColor(...hRgb);
    doc.rect(0, 0, W, 38, 'F');

    doc.setTextColor(...htRgb);
    doc.setFontSize(20); doc.setFont('helvetica','bold');
    doc.text('TECH NANDU', 14, 14);

    doc.setFontSize(8); doc.setFont('helvetica','normal');
    doc.text('Tikri Border, Baba Haridas Colony, Delhi - 110041', 14, 20);
    doc.text('+91 96671-91540  |  +91 80103-47835', 14, 26);

    const titleClr = tpl.id === 'minimal' ? aRgb : htRgb;
    doc.setTextColor(...titleClr);
    doc.setFontSize(15); doc.setFont('helvetica','bold');
    doc.text('TAX INVOICE', W - 14, 14, { align:'right' });

    doc.setTextColor(...htRgb);
    doc.setFontSize(9); doc.setFont('helvetica','normal');
    doc.text(inv.invoiceNo, W - 14, 21, { align:'right' });

    // ── Meta ──────────────────────────────────────────────────────────
    const metaBg = isDark ? [20,33,54] : [248,248,255];
    doc.setFillColor(...metaBg);
    doc.rect(0, 38, W, 24, 'F');

    doc.setTextColor(...aRgb);
    doc.setFontSize(7); doc.setFont('helvetica','bold');
    doc.text('BILL TO', 14, 47);

    doc.setTextColor(...btRgb);
    doc.setFontSize(11); doc.setFont('helvetica','bold');
    doc.text(String(inv.customer||''), 14, 54);

    if (inv.phone) {
      doc.setFontSize(8.5); doc.setFont('helvetica','normal');
      doc.text(String(inv.phone), 14, 59);
    }

    doc.setTextColor(...aRgb);
    doc.setFontSize(7); doc.setFont('helvetica','bold');
    doc.text('INVOICE DATE', W - 14, 47, { align:'right' });

    const dateStr = new Date(inv.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});
    doc.setTextColor(...btRgb);
    doc.setFontSize(10); doc.setFont('helvetica','bold');
    doc.text(dateStr, W - 14, 54, { align:'right' });

    const sClr = inv.status==='Paid'?[22,163,74]:inv.status==='Overdue'?[220,38,38]:[217,119,6];
    doc.setTextColor(...sClr);
    doc.setFontSize(8); doc.setFont('helvetica','bold');
    doc.text(`[ ${inv.status} ]`, W - 14, 60, { align:'right' });

    // ── Items Table ───────────────────────────────────────────────────
    const altRow = isDark ? [20,30,47] : [248,246,255];
    autoTable(doc, {
      startY: 68,
      head: [['#', 'Item Description', 'Qty', 'Unit Price', 'Amount']],
      body: (inv.items||[]).map((it,i) => [
        i+1, it.name, it.qty,
        `Rs.${Number(it.price).toLocaleString('en-IN')}`,
        `Rs.${(it.qty*it.price).toLocaleString('en-IN')}`,
      ]),
      headStyles:      { fillColor:aRgb, textColor:[255,255,255], fontStyle:'bold', fontSize:9, cellPadding:4 },
      bodyStyles:      { textColor:btRgb, fillColor:bRgb, fontSize:10 },
      alternateRowStyles: { fillColor:altRow },
      columnStyles: {
        0: { cellWidth:12, halign:'center' },
        2: { cellWidth:16, halign:'center' },
        3: { cellWidth:34, halign:'right' },
        4: { cellWidth:34, halign:'right' },
      },
      margin: { left:14, right:14 },
    });

    const fy = doc.lastAutoTable.finalY + 6;

    // ── Totals ────────────────────────────────────────────────────────
    doc.setTextColor(...btRgb);
    doc.setFontSize(10); doc.setFont('helvetica','normal');
    doc.text('Subtotal:', 130, fy);
    doc.text(`Rs.${inv.subtotal?.toLocaleString('en-IN')}`, W-14, fy, { align:'right' });

    doc.text(`GST (${inv.gstRate}%):`, 130, fy+7);
    doc.text(`Rs.${inv.gstAmt?.toFixed(2)}`, W-14, fy+7, { align:'right' });

    doc.setDrawColor(...aRgb);
    doc.line(125, fy+11, W-14, fy+11);

    doc.setTextColor(...aRgb);
    doc.setFontSize(13); doc.setFont('helvetica','bold');
    doc.text('Grand Total:', 130, fy+19);
    doc.text(`Rs.${inv.total?.toLocaleString('en-IN')}`, W-14, fy+19, { align:'right' });

    // ── Footer ────────────────────────────────────────────────────────
    doc.setDrawColor(...aRgb);
    doc.line(14, fy+26, W-14, fy+26);
    doc.setTextColor(140,140,140);
    doc.setFontSize(8); doc.setFont('helvetica','normal');
    doc.text('Generated by Tech Nandu ERP', 14, fy+32);
    doc.text('Thank you for your business!', W-14, fy+32, { align:'right' });

    doc.save(`${inv.invoiceNo}-challan.pdf`);
  };

  // Print challan in a new window (clean print without page chrome)
  const printChallan = (inv, tpl) => {
    const rows = (inv.items||[]).map((it,i)=>`
      <tr style="background:${i%2===0?`${tpl.accentColor}09`:'transparent'}">
        <td>${i+1}</td><td>${it.name}</td>
        <td style="text-align:center">${it.qty}</td>
        <td style="text-align:right">&#8377;${Number(it.price).toLocaleString('en-IN')}</td>
        <td style="text-align:right;font-weight:600">&#8377;${(it.qty*it.price).toLocaleString('en-IN')}</td>
      </tr>`).join('');
    const sBg = inv.status==='Paid'?'rgba(22,163,74,.15)':inv.status==='Overdue'?'rgba(220,38,38,.15)':'rgba(217,119,6,.15)';
    const sClr= inv.status==='Paid'?'#16a34a':inv.status==='Overdue'?'#dc2626':'#d97706';
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${inv.invoiceNo}</title>
      <style>*{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:'Segoe UI',Arial,sans-serif;background:${tpl.bodyBg};color:${tpl.bodyText};}
      .w{max-width:794px;margin:0 auto;}
      .h{background:${tpl.headerBg};color:${tpl.headerText};padding:22px 28px;display:flex;justify-content:space-between;align-items:flex-start;}
      .cn{font-size:21px;font-weight:900;color:${tpl.headerText};}
      .cs{font-size:10px;opacity:.8;margin-top:3px;color:${tpl.headerText};}
      .tb{text-align:right;border-left:3px solid ${tpl.id==='minimal'?tpl.accentColor:`${tpl.headerText}44`};padding-left:14px;}
      .tt{font-size:17px;font-weight:800;color:${tpl.id==='minimal'?tpl.accentColor:tpl.headerText};}
      .tn{font-size:11px;opacity:.78;color:${tpl.headerText};margin-top:3px;}
      .m{padding:14px 28px;display:flex;justify-content:space-between;background:${tpl.accentColor}07;border-bottom:1px solid ${tpl.accentColor}28;}
      .ml{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:${tpl.accentColor};margin-bottom:3px;}
      .mv{font-weight:700;font-size:13px;color:${tpl.bodyText};}
      .ms{font-size:11px;opacity:.65;margin-top:2px;color:${tpl.bodyText};}
      .badge{display:inline-block;background:${sBg};color:${sClr};padding:2px 10px;border-radius:10px;font-size:10px;font-weight:700;margin-top:5px;}
      table{width:100%;border-collapse:collapse;}
      th{background:${tpl.accentColor};color:#fff;padding:9px 11px;font-size:10px;text-transform:uppercase;letter-spacing:.3px;}
      td{padding:8px 11px;border-bottom:1px solid ${tpl.accentColor}14;font-size:12px;color:${tpl.bodyText};}
      .tot{padding:14px 28px;border-top:1px solid ${tpl.accentColor}20;}
      .tr{display:flex;justify-content:space-between;padding:4px 0;font-size:12px;color:${tpl.bodyText};}
      .gt{display:flex;justify-content:space-between;padding:9px 0 0;margin-top:5px;border-top:2px solid ${tpl.accentColor};font-size:15px;font-weight:800;color:${tpl.accentColor};}
      .ft{padding:12px 28px;border-top:1px solid ${tpl.accentColor}20;display:flex;justify-content:space-between;opacity:.5;font-size:10px;color:${tpl.bodyText};}
      @media print{@page{margin:0;}body{padding:0;}}</style></head><body>
      <div class="w"><div class="h">
        <div><div class="cn">TECH NANDU</div>
        <div class="cs">Tikri Border, Baba Haridas Colony, Delhi &#8211; 110041</div>
        <div class="cs">+91 96671-91540 | +91 80103-47835</div></div>
        <div class="tb"><div class="tt">TAX INVOICE</div><div class="tn">${inv.invoiceNo}</div></div>
      </div>
      <div class="m">
        <div><div class="ml">Bill To</div><div class="mv">${inv.customer}</div>${inv.phone?`<div class="ms">${inv.phone}</div>`:''}</div>
        <div style="text-align:right"><div class="ml">Invoice Date</div>
        <div class="mv">${new Date(inv.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</div>
        <div class="badge">${inv.status}</div></div>
      </div>
      <table><thead><tr><th style="width:5%">#</th><th>Item</th><th style="width:10%;text-align:center">Qty</th><th style="width:18%;text-align:right">Rate</th><th style="width:18%;text-align:right">Amount</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <div class="tot">
        <div class="tr"><span>Subtotal</span><span>&#8377;${inv.subtotal?.toLocaleString('en-IN')}</span></div>
        <div class="tr"><span>GST (${inv.gstRate}%)</span><span>&#8377;${inv.gstAmt?.toFixed(2)}</span></div>
        <div class="gt"><span>Grand Total</span><span>&#8377;${inv.total?.toLocaleString('en-IN')}</span></div>
      </div>
      <div class="ft"><span>Generated by Tech Nandu ERP</span><span>Thank you for your business!</span></div>
      </div><script>window.onload=()=>{window.print();}</script></body></html>`;
    const w = window.open('','_blank');
    w.document.write(html);
    w.document.close();
  };;

  const paid    = invoices.filter(i=>i.status==='Paid').reduce((s,i)=>s+i.total,0);
  const pending = invoices.filter(i=>i.status==='Pending').reduce((s,i)=>s+i.total,0);
  const overdue = invoices.filter(i=>i.status==='Overdue').reduce((s,i)=>s+i.total,0);
  const { subtotal, gst, total } = calcTotals();

  const customers = [...new Map(invoices.map(inv=>[inv.customer,{name:inv.customer,phone:inv.phone,invoices:invoices.filter(i=>i.customer===inv.customer).length,total:invoices.filter(i=>i.customer===inv.customer).reduce((s,i)=>s+i.total,0)}])).values()];

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
                ? <tr><td colSpan={8} className="empty-row">No invoices yet. Create one to get started!</td></tr>
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
                      <button className="btn-edit"
                        style={{background:'rgba(108,99,255,.12)',color:'#6C63FF',border:'1px solid rgba(108,99,255,.25)'}}
                        onClick={()=>cutChallan(inv)}>🖨️ Challan</button>
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

      <div className="stats-grid">
        <div className="stat-card"><div className="s-label">Total Invoices</div><div className="s-val" style={{color:'#6C63FF'}}>{invoices.length}</div><div className="s-chg up">All time</div></div>
        <div className="stat-card"><div className="s-label">Paid Amount</div><div className="s-val" style={{color:'#43E97B'}}>₹{(paid/1000).toFixed(1)}K</div><div className="s-chg up">▲ Collected</div></div>
        <div className="stat-card"><div className="s-label">Pending</div><div className="s-val" style={{color:'#f59e0b'}}>₹{(pending/1000).toFixed(1)}K</div><div className="s-chg down">⏳ Awaiting</div></div>
        <div className="stat-card"><div className="s-label">Overdue</div><div className="s-val" style={{color:'#FF6584'}}>₹{(overdue/1000).toFixed(1)}K</div><div className="s-chg down">⚠ Action needed</div></div>
      </div>

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

      {tab === 1 && <InvoiceTable />}
      {tab === 2 && <InvoiceTable />}

      {tab === 3 && (
        <div className="card">
          <div className="card-header">
            <h3>👥 Customer Directory</h3>
            <button className="btn-add" onClick={()=>showToast('Customer added! (Demo)')}>+ Add Customer</button>
          </div>
          <div className="table-wrap">
            {customers.length===0
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

      {/* TAB 4 — Challan Templates */}
      {tab === 4 && (
        <div>
          <div className="card" style={{padding:'16px 20px',marginBottom:18,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <h3 style={{marginBottom:2}}>🖨️ Challan Templates</h3>
              <div style={{fontSize:'.78rem',color:'var(--muted)'}}>Choose a template style for your invoice printouts. Active template is used when you click 🖨️ Challan on any invoice.</div>
            </div>
            <div style={{flexShrink:0,marginLeft:16}}>
              <span style={{fontSize:'.72rem',color:'var(--muted)'}}>Active:</span>{' '}
              <span style={{fontWeight:700,color:activeTpl.accent,fontSize:'.82rem'}}>{activeTpl.name}</span>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:16}}>
            {CHALLAN_TEMPLATES.map(tpl => (
              <div key={tpl.id}
                className="challan-tpl-card"
                style={challanTemplate===tpl.id ? {borderColor:tpl.accent,boxShadow:`0 0 0 2px ${tpl.accent}35`} : {}}
                onClick={()=>setChallanTemplate(tpl.id)}
              >
                {/* Mini thumbnail */}
                <div className="challan-thumb" style={{background: tpl.id==='modern'?'#0f172a':'#f8fafc', borderBottom:'1px solid rgba(0,0,0,.07)'}}>
                  {/* Thumb header */}
                  <div style={{background:tpl.headerBg,padding:'8px 10px',borderRadius:'6px 6px 0 0'}}>
                    <div style={{color:tpl.headerText,fontSize:'8px',fontWeight:900,letterSpacing:'.3px'}}>TECH NANDU</div>
                    <div style={{color:tpl.id==='minimal'?tpl.accentColor:tpl.headerText,fontSize:'6px',fontWeight:700,opacity:.8,marginTop:1}}>TAX INVOICE</div>
                  </div>
                  {/* Thumb body */}
                  <div style={{padding:'8px 10px'}}>
                    <div style={{fontSize:'6px',color:tpl.id==='modern'?'#94a3b8':'#64748b',marginBottom:5}}>Bill To: Customer Name &nbsp;|&nbsp; Date: Apr 2026</div>
                    {/* Header row */}
                    <div style={{background:tpl.accentColor,height:'9px',borderRadius:2,marginBottom:4}} />
                    {/* Item rows */}
                    {[1,2].map(i=>(
                      <div key={i} style={{display:'flex',gap:3,marginBottom:3}}>
                        <div style={{flex:3,height:5,background:tpl.id==='modern'?'rgba(255,255,255,.08)':'#e2e8f0',borderRadius:2}} />
                        <div style={{flex:1,height:5,background:tpl.id==='modern'?'rgba(255,255,255,.08)':'#e2e8f0',borderRadius:2}} />
                        <div style={{flex:1,height:5,background:tpl.id==='modern'?'rgba(255,255,255,.08)':'#e2e8f0',borderRadius:2}} />
                      </div>
                    ))}
                    {/* Total */}
                    <div style={{borderTop:`1px solid ${tpl.accentColor}`,paddingTop:4,marginTop:4,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div style={{fontSize:'6px',color:tpl.id==='modern'?'#94a3b8':'#64748b'}}>Grand Total</div>
                      <div style={{fontSize:'7px',fontWeight:900,color:tpl.accentColor}}>₹12,390</div>
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <div style={{padding:'12px 14px'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
                    <div style={{fontWeight:700,fontSize:'.88rem'}}>{tpl.name}</div>
                    {challanTemplate===tpl.id && (
                      <span style={{background:`${tpl.accent}18`,color:tpl.accent,border:`1px solid ${tpl.accent}35`,padding:'2px 8px',borderRadius:10,fontSize:'.62rem',fontWeight:700}}>
                        ✓ Active
                      </span>
                    )}
                  </div>
                  <div style={{fontSize:'.75rem',color:'var(--muted)',marginBottom:10}}>{tpl.desc}</div>
                  <div style={{display:'flex',gap:8}}>
                    <button
                      className="btn-add"
                      style={{
                        flex:1,
                        background:challanTemplate===tpl.id?`${tpl.accent}18`:'rgba(255,255,255,.05)',
                        color:challanTemplate===tpl.id?tpl.accent:'var(--muted)',
                        border:`1px solid ${challanTemplate===tpl.id?tpl.accent:'rgba(255,255,255,.12)'}`,
                      }}
                      onClick={e=>{e.stopPropagation();setChallanTemplate(tpl.id);showToast(`${tpl.name} template selected!`);}}
                    >
                      {challanTemplate===tpl.id?'✓ Selected':'Use Template'}
                    </button>
                    <button
                      className="btn-edit"
                      onClick={e=>{
                        e.stopPropagation();
                        if(invoices.length>0){ setChallanTemplate(tpl.id); setPreview(invoices[0]); setPrintMode(true); }
                        else showToast('Create an invoice first to preview','error');
                      }}
                    >Preview</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="card" style={{padding:'14px 18px',marginTop:16,display:'flex',gap:12,alignItems:'center'}}>
            <span style={{fontSize:'1.3rem'}}>💡</span>
            <div>
              <div style={{fontWeight:700,fontSize:'.83rem',marginBottom:2}}>How to print a challan</div>
              <div style={{fontSize:'.76rem',color:'var(--muted)'}}>Select a template above, then go to the <strong>Invoices</strong> tab and click <strong>🖨️ Challan</strong> on any invoice row to open the print-ready view.</div>
            </div>
          </div>
        </div>
      )}

      {tab === 5 && (
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

      {/* PRINT / CUT CHALLAN FULL-SCREEN */}
      {printMode && preview && (
        <div className="challan-print-overlay" onClick={e=>e.target===e.currentTarget&&setPrintMode(false)}>
          <div className="challan-print-container">
            <div className="challan-controls no-print">
              <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
                <span style={{fontWeight:700,fontSize:'.85rem',color:'#e2e8f0'}}>🖨️ {preview.invoiceNo}</span>
                <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                  {CHALLAN_TEMPLATES.map(tpl=>(
                    <button key={tpl.id} onClick={()=>setChallanTemplate(tpl.id)}
                      style={{
                        padding:'4px 10px',borderRadius:7,fontSize:'.7rem',fontWeight:700,cursor:'pointer',
                        background:challanTemplate===tpl.id?tpl.accent:'transparent',
                        color:challanTemplate===tpl.id?'#fff':'rgba(255,255,255,.5)',
                        border:`1px solid ${challanTemplate===tpl.id?tpl.accent:'rgba(255,255,255,.15)'}`,
                        transition:'all .2s',
                      }}
                    >{tpl.name}</button>
                  ))}
                </div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>downloadChallanPDF(preview, activeTpl)}
                  style={{background:'#6C63FF',color:'#fff',border:'none',padding:'8px 18px',borderRadius:8,fontWeight:800,cursor:'pointer',fontSize:'.82rem'}}>
                  📥 Download PDF
                </button>
                <button onClick={()=>printChallan(preview, activeTpl)}
                  style={{background:'#43E97B',color:'#0f172a',border:'none',padding:'8px 18px',borderRadius:8,fontWeight:800,cursor:'pointer',fontSize:'.82rem'}}>
                  🖨️ Print
                </button>
                <button className="close-btn" onClick={()=>setPrintMode(false)}>✕</button>
              </div>
            </div>
            <ChallanPaper inv={preview} tpl={activeTpl} />
          </div>
        </div>
      )}

      {/* INVOICE PREVIEW MODAL */}
      {preview && !printMode && (
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
              <div style={{textAlign:'center',marginTop:14,display:'flex',gap:8,justifyContent:'center'}}>
                <button className="btn-add" onClick={()=>setPrintMode(true)}>🖨️ Cut Challan</button>
                <button className="btn-edit" onClick={()=>{ downloadChallanPDF(preview, activeTpl); setPreview(null); }}>📥 Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE INVOICE MODAL */}
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
                    {[5,18,40].map(r=><option key={r} value={r}>{r}%</option>)}
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
