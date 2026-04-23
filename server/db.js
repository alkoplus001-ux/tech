// In-memory store — used when MongoDB is not connected
const { v4: uuid } = require('./utils/uuid');

const store = {
  products: [
    { _id:'p1', name:'Samsung TV 55"',      sku:'EL-001', category:'Electronics', stock:45,  price:42000, supplier:'Samsung India',  status:'In Stock',   createdAt: new Date('2026-01-10') },
    { _id:'p2', name:'Nike Running Shoes',  sku:'FW-234', category:'Footwear',    stock:8,   price:4500,  supplier:'Nike Dist.',      status:'Low Stock',  createdAt: new Date('2026-01-12') },
    { _id:'p3', name:'Basmati Rice 5kg',    sku:'GR-567', category:'Grocery',     stock:320, price:450,   supplier:'India Gate',      status:'In Stock',   createdAt: new Date('2026-01-15') },
    { _id:'p4', name:'HP Laptop Pavilion',  sku:'EL-089', category:'Electronics', stock:2,   price:55000, supplier:'HP India',        status:'Low Stock',  createdAt: new Date('2026-01-20') },
    { _id:'p5', name:'Cotton T-Shirt XL',   sku:'CL-112', category:'Clothing',    stock:156, price:799,   supplier:'Rupa Co.',        status:'In Stock',   createdAt: new Date('2026-02-01') },
    { _id:'p6', name:'Colgate Toothpaste',  sku:'HG-021', category:'FMCG',        stock:0,   price:120,   supplier:'Colgate India',   status:'Out of Stock',createdAt: new Date('2026-02-05') },
    { _id:'p7', name:'Wireless Headphones', sku:'EL-300', category:'Electronics', stock:32,  price:2499,  supplier:'boAt Lifestyle',  status:'In Stock',   createdAt: new Date('2026-02-10') },
    { _id:'p8', name:"Levi's Jeans 32W",   sku:'CL-205', category:'Clothing',    stock:18,  price:3499,  supplier:"Levi's India",    status:'In Stock',   createdAt: new Date('2026-02-15') },
  ],
  invoices: [
    { _id:'i1', invoiceNo:'TN-2026-0001', customer:'Sharma Traders',  phone:'9876543210', items:[{name:'Inventory Module',qty:1,price:12000},{name:'Setup',qty:1,price:2000}],    subtotal:14000, gstRate:18, gstAmt:2520,  total:16520, status:'Paid',    createdAt: new Date('2026-04-10') },
    { _id:'i2', invoiceNo:'TN-2026-0002', customer:'Patel Stores',    phone:'9123456780', items:[{name:'Billing Software',qty:1,price:7000}],                                     subtotal:7000,  gstRate:18, gstAmt:1260,  total:8260,  status:'Pending', createdAt: new Date('2026-04-15') },
    { _id:'i3', invoiceNo:'TN-2026-0003', customer:'Gupta Textiles',  phone:'9988776655', items:[{name:'HR Module',qty:1,price:15000},{name:'Training',qty:2,price:2500}],        subtotal:20000, gstRate:18, gstAmt:3600,  total:23600, status:'Paid',    createdAt: new Date('2026-04-18') },
    { _id:'i4', invoiceNo:'TN-2026-0004', customer:'Khan Pharma',     phone:'9012345678', items:[{name:'POS System',qty:1,price:5000}],                                           subtotal:5000,  gstRate:18, gstAmt:900,   total:5900,  status:'Overdue', createdAt: new Date('2026-04-05') },
    { _id:'i5', invoiceNo:'TN-2026-0005', customer:'Nair Exports',    phone:'9876501234', items:[{name:'CRM Module',qty:1,price:18000},{name:'Support',qty:1,price:3000}],        subtotal:21000, gstRate:18, gstAmt:3780,  total:24780, status:'Paid',    createdAt: new Date('2026-04-20') },
  ],
  employees: [
    { _id:'e1', empId:'TN-EMP-001', name:'Rahul Sharma', department:'Engineering', position:'Sr. Developer',  phone:'9876543210', email:'rahul@co.in',  salary:55000, status:'Active',   joiningDate: new Date('2023-01-15'), createdAt: new Date('2023-01-15') },
    { _id:'e2', empId:'TN-EMP-002', name:'Priya Patel',  department:'Marketing',   position:'Team Lead',       phone:'9123456780', email:'priya@co.in',  salary:42000, status:'Active',   joiningDate: new Date('2022-03-01'), createdAt: new Date('2022-03-01') },
    { _id:'e3', empId:'TN-EMP-003', name:'Amit Kumar',   department:'Sales',       position:'Sales Manager',   phone:'9988776655', email:'amit@co.in',   salary:60000, status:'On Leave', joiningDate: new Date('2021-06-10'), createdAt: new Date('2021-06-10') },
    { _id:'e4', empId:'TN-EMP-004', name:'Sunita Singh', department:'HR',          position:'HR Executive',    phone:'9012345678', email:'sunita@co.in', salary:35000, status:'Active',   joiningDate: new Date('2023-09-22'), createdAt: new Date('2023-09-22') },
    { _id:'e5', empId:'TN-EMP-005', name:'Vikram Nair',  department:'Finance',     position:'Accountant',      phone:'9876501234', email:'vikram@co.in', salary:40000, status:'Active',   joiningDate: new Date('2020-02-05'), createdAt: new Date('2020-02-05') },
    { _id:'e6', empId:'TN-EMP-006', name:'Deepa Mehta',  department:'Engineering', position:'UI Designer',     phone:'8877665544', email:'deepa@co.in',  salary:38000, status:'Active',   joiningDate: new Date('2023-04-12'), createdAt: new Date('2023-04-12') },
  ],
  contacts: [],
};

// Simulate MongoDB-like operations on in-memory arrays
const mem = {
  products: {
    find: (filter={}) => {
      let r = [...store.products];
      if (filter.name?.$regex) r = r.filter(p => p.name.toLowerCase().includes(filter.name.$regex.toLowerCase()));
      if (filter.category) r = r.filter(p => p.category === filter.category);
      return r.sort((a,b) => b.createdAt - a.createdAt);
    },
    create: (data) => {
      const doc = { ...data, _id: uuid(), createdAt: new Date() };
      store.products.unshift(doc); return doc;
    },
    update: (id, data) => {
      const i = store.products.findIndex(p => p._id === id);
      if (i < 0) return null;
      store.products[i] = { ...store.products[i], ...data };
      return store.products[i];
    },
    delete: (id) => { store.products = store.products.filter(p => p._id !== id); },
    count: () => store.products.length,
  },
  invoices: {
    find: () => [...store.invoices].sort((a,b) => b.createdAt - a.createdAt),
    create: (data) => { const doc = { ...data, _id: uuid(), createdAt: new Date() }; store.invoices.unshift(doc); return doc; },
    update: (id, data) => { const i = store.invoices.findIndex(x=>x._id===id); if(i<0) return null; store.invoices[i]={...store.invoices[i],...data}; return store.invoices[i]; },
    delete: (id) => { store.invoices = store.invoices.filter(x => x._id !== id); },
    count: () => store.invoices.length,
  },
  employees: {
    find: (filter={}) => {
      let r = [...store.employees];
      if (filter.name?.$regex) r = r.filter(e => e.name.toLowerCase().includes(filter.name.$regex.toLowerCase()));
      if (filter.department) r = r.filter(e => e.department === filter.department);
      return r.sort((a,b) => b.createdAt - a.createdAt);
    },
    create: (data) => { const doc = { ...data, _id: uuid(), createdAt: new Date() }; store.employees.unshift(doc); return doc; },
    update: (id, data) => { const i = store.employees.findIndex(e=>e._id===id); if(i<0) return null; store.employees[i]={...store.employees[i],...data}; return store.employees[i]; },
    delete: (id) => { store.employees = store.employees.filter(e => e._id !== id); },
    count: () => store.employees.length,
  },
  contacts: {
    find: () => [...store.contacts].sort((a,b) => b.createdAt - a.createdAt),
    create: (data) => { const doc = { ...data, _id: uuid(), createdAt: new Date() }; store.contacts.unshift(doc); return doc; },
    delete: (id) => { store.contacts = store.contacts.filter(c => c._id !== id); },
  },
};

module.exports = { mem, store };
