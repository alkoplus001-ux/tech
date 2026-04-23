import { useState } from 'react';
import { useParams } from 'react-router-dom';
import DemoLayout from '../components/DemoLayout.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import './Demo.css';

// ── Dashboard config per module ───────────────────────────────────────────────
const CONFIGS = {
  payroll: {
    title:'Payroll Management', icon:'💰', color:'#10b981', variant:'emerald',
    menu:[{icon:'💰',label:'Dashboard'},{icon:'👥',label:'Employees'},{icon:'📄',label:'Run Payroll'},{icon:'🏦',label:'Bank Transfer'},{icon:'📊',label:'Reports'}],
    stats:[
      {label:'Total Payroll',val:'₹18.4L',chg:'April 2026',color:'#10b981',up:true},
      {label:'Employees',val:'124',chg:'All paid',color:'#6C63FF',up:true},
      {label:'TDS Deducted',val:'₹2.1L',chg:'Filed',color:'#f59e0b',up:true},
      {label:'PF Total',val:'₹1.6L',chg:'Employer+EE',color:'#FF6584',up:true},
    ],
    tableHead:['Emp ID','Name','Basic','HRA','Deductions','Net Pay','Status'],
    rows:[
      ['TN-001','Rahul Sharma','₹45,000','₹18,000','₹8,400','₹54,600','Paid'],
      ['TN-002','Priya Patel','₹38,000','₹15,200','₹7,100','₹46,100','Paid'],
      ['TN-003','Amit Kumar','₹55,000','₹22,000','₹10,200','₹66,800','Paid'],
      ['TN-004','Sunita Singh','₹28,000','₹11,200','₹5,200','₹34,000','Processing'],
      ['TN-005','Vikram Nair','₹40,000','₹16,000','₹7,500','₹48,500','Paid'],
    ],
    statusCol:6, addLabel:'Run Payroll',
  },
  crm: {
    title:'CRM — Sales & Leads', icon:'🤝', color:'#8B5CF6', variant:'violet',
    menu:[{icon:'🤝',label:'Dashboard'},{icon:'🎯',label:'Leads'},{icon:'👥',label:'Customers'},{icon:'💼',label:'Deals'},{icon:'📞',label:'Follow-ups'}],
    stats:[
      {label:'Total Leads',val:'248',chg:'↑ 34 this week',color:'#8B5CF6',up:true},
      {label:'Converted',val:'82',chg:'33% conversion',color:'#43E97B',up:true},
      {label:'Pipeline',val:'₹42L',chg:'Active deals',color:'#f59e0b',up:true},
      {label:'Follow-ups',val:'14',chg:'Today',color:'#FF6584',up:true},
    ],
    kanban: true,
    kanbanCols:[
      {title:'🔵 New',       color:'#6C63FF', items:['Sharma Enterprises — ₹1.2L','Tech Solutions Ltd — ₹80K','Global Traders — ₹2.5L']},
      {title:'🟡 Contacted', color:'#f59e0b', items:['Patel Industries — ₹3L','Kumar & Sons — ₹60K','Mehta Corp — ₹1.8L']},
      {title:'🟠 Proposal',  color:'#FF6584', items:['Singh Textiles — ₹4.5L','Agarwal Group — ₹2L']},
      {title:'🟢 Won',       color:'#43E97B', items:['Gupta Pharma — ₹6L','Nair Exports — ₹3.2L']},
    ],
    addLabel:'+ New Lead',
  },
  hospital: {
    title:'Hospital Management', icon:'🏥', color:'#ef4444', variant:'medical',
    menu:[{icon:'🏥',label:'Dashboard'},{icon:'👤',label:'Patients'},{icon:'📅',label:'Appointments'},{icon:'💊',label:'Prescriptions'},{icon:'🛏️',label:'IPD/OPD'}],
    stats:[
      {label:"Today's Patients",val:'68',chg:'8 IPD, 60 OPD',color:'#ef4444',up:true},
      {label:'Appointments',val:'24',chg:'6 pending',color:'#f59e0b',up:true},
      {label:'Available Beds',val:'12',chg:'of 50 total',color:'#43E97B',up:true},
      {label:'Revenue',val:'₹34.5K',chg:'Today',color:'#6C63FF',up:true},
    ],
    tableHead:['Token','Patient','Age/Sex','Doctor','Complaint','Time','Status'],
    rows:[
      ['#001','Ramesh Kumar','45M','Dr. Sharma','Fever, Cold','9:00 AM','Done'],
      ['#002','Sunita Devi','32F','Dr. Patel','BP Check','9:30 AM','Done'],
      ['#003','Arjun Singh','8M','Dr. Gupta','Cough','10:00 AM','Waiting'],
      ['#004','Meera Joshi','55F','Dr. Sharma','Diabetes','10:30 AM','Waiting'],
      ['#005','Vikram Nair','38M','Dr. Patel','Back Pain','11:00 AM','Scheduled'],
    ],
    statusCol:6, addLabel:'+ New Patient',
  },
  school: {
    title:'School Management', icon:'🎓', color:'#06b6d4', variant:'edu',
    menu:[{icon:'🎓',label:'Dashboard'},{icon:'👨‍🎓',label:'Students'},{icon:'📅',label:'Attendance'},{icon:'💰',label:'Fees'},{icon:'📝',label:'Exams'}],
    stats:[
      {label:'Total Students',val:'1,248',chg:'Classes I–XII',color:'#06b6d4',up:true},
      {label:'Attendance',val:'95.2%',chg:'Today',color:'#43E97B',up:true},
      {label:'Fee Collected',val:'₹24.8L',chg:'This month',color:'#6C63FF',up:true},
      {label:'Pending Fees',val:'₹2.4L',chg:'32 students',color:'#FF6584',up:false},
    ],
    tableHead:['Roll No','Name','Class','Parent','Annual Fees','Status'],
    rows:[
      ['001','Aarav Sharma','X-A','Rajesh Sharma','₹12,000','Paid'],
      ['002','Ishita Patel','X-A','Dinesh Patel','₹12,000','Paid'],
      ['003','Rohan Kumar','X-B','Anil Kumar','₹12,000','Partial'],
      ['004','Neha Singh','IX-A','Suresh Singh','₹10,000','Paid'],
      ['005','Aryan Gupta','IX-B','Manoj Gupta','₹10,000','Unpaid'],
    ],
    statusCol:5, addLabel:'+ Add Student',
  },
  restaurant: {
    title:'Restaurant Management', icon:'🍽️', color:'#fb923c', variant:'cozy',
    menu:[{icon:'🍽️',label:'Dashboard'},{icon:'🪑',label:'Tables'},{icon:'📋',label:'Menu'},{icon:'🛵',label:'Delivery'},{icon:'👨‍🍳',label:'Kitchen'}],
    stats:[
      {label:"Today's Orders",val:'142',chg:'↑ 22% growth',color:'#fb923c',up:true},
      {label:'Dine-In',val:'68',chg:'18 tables active',color:'#43E97B',up:true},
      {label:'Delivery',val:'54',chg:'12 on the way',color:'#6C63FF',up:true},
      {label:'Revenue',val:'₹28.4K',chg:'Today',color:'#FF6584',up:true},
    ],
    tableHead:['Table/Order','Type','Item','Qty','Amount','Status'],
    rows:[
      ['T-1','Dine-In','Paneer Butter Masala + Naan','2','₹560','Ready'],
      ['T-3','Dine-In','Dal Makhani + Tandoori','1','₹380','Cooking'],
      ['D-54','Delivery','Veg Biryani (Full)','1','₹320','Out for delivery'],
      ['T-6','Dine-In','Chicken Tikka + Rice','3','₹1,050','Cooking'],
      ['D-55','Delivery','Pizza Margherita','2','₹498','Preparing'],
    ],
    statusCol:5, addLabel:'+ New Order',
  },
  realestate: {
    title:'Real Estate Management', icon:'🏗️', color:'#3B82F6', variant:'corporate',
    menu:[{icon:'🏗️',label:'Dashboard'},{icon:'🏠',label:'Properties'},{icon:'👥',label:'Buyers'},{icon:'💰',label:'Payments'},{icon:'🧑',label:'Agents'}],
    stats:[
      {label:'Properties',val:'342',chg:'28 sold this month',color:'#3B82F6',up:true},
      {label:'Sales Value',val:'₹12.4Cr',chg:'April 2026',color:'#43E97B',up:true},
      {label:'Active Buyers',val:'186',chg:'62 site visits',color:'#f59e0b',up:true},
      {label:'Commission',val:'₹24.8L',chg:'2% avg',color:'#FF6584',up:true},
    ],
    tableHead:['Property','Type','Area','Price','Agent','Status'],
    rows:[
      ['Sector 21, Noida — 3BHK','Flat','1450 sqft','₹85 Lakh','Ravi Kumar','Available'],
      ['MG Road, Pune — Shop','Commercial','650 sqft','₹1.2 Cr','Priya Mehta','Negotiating'],
      ['Whitefield, Bangalore 2BHK','Flat','980 sqft','₹62 Lakh','Amit Joshi','Sold'],
      ['Bandra, Mumbai — Villa','Bungalow','3200 sqft','₹4.5 Cr','Sunita Rao','Available'],
      ['Connaught Place, Delhi','Commercial','1200 sqft','₹3.2 Cr','Raj Singh','Available'],
    ],
    statusCol:5, addLabel:'+ Add Property',
  },
  pharmacy: {
    title:'Pharmacy Management', icon:'💊', color:'#a855f7', variant:'pharma',
    menu:[{icon:'💊',label:'Dashboard'},{icon:'💉',label:'Medicines'},{icon:'📋',label:'Sales'},{icon:'📜',label:'Prescriptions'},{icon:'⚠️',label:'Expiry Alert'}],
    stats:[
      {label:"Today's Sales",val:'₹18.2K',chg:'248 items sold',color:'#a855f7',up:true},
      {label:'Medicines',val:'3,456',chg:'124 categories',color:'#6C63FF',up:true},
      {label:'Expiring Soon',val:'23',chg:'Within 30 days',color:'#f59e0b',up:false},
      {label:'Low Stock',val:'15',chg:'Need reorder',color:'#FF6584',up:false},
    ],
    tableHead:['Medicine','Manufacturer','Stock','MRP','Expiry','Status'],
    rows:[
      ['Paracetamol 500mg','Cipla','2,400 tabs','₹2.50','Dec 2026','Good'],
      ['Amoxicillin 250mg','Sun Pharma','45 strips','₹85.00','Jun 2026','Low Stock'],
      ["Metformin 500mg","Dr. Reddy's",'850 tabs','₹4.20','May 2026','Expiring Soon'],
      ['Cetirizine 10mg','Mankind','320 tabs','₹3.80','Mar 2027','Good'],
      ['Pantoprazole 40mg','Cipla','0 tabs','₹12.00','Aug 2026','Out of Stock'],
    ],
    statusCol:5, addLabel:'+ Add Medicine',
  },
  analytics: {
    title:'Analytics Dashboard', icon:'📊', color:'#ec4899', variant:'gradient',
    menu:[{icon:'📊',label:'Overview'},{icon:'📈',label:'Sales'},{icon:'👥',label:'Customers'},{icon:'💰',label:'Revenue'},{icon:'📋',label:'Reports'}],
    stats:[
      {label:'Monthly Revenue',val:'₹84.2L',chg:'↑ 23% vs last month',color:'#ec4899',up:true},
      {label:'New Customers',val:'342',chg:'↑ 18% growth',color:'#43E97B',up:true},
      {label:'Avg Order Value',val:'₹2,847',chg:'↑ 8% increase',color:'#f59e0b',up:true},
      {label:'Retention',val:'87.4%',chg:'↑ 4% this quarter',color:'#6C63FF',up:true},
    ],
    chart:true, addLabel:'Export Report',
  },
};

// ── Per-tab content for each module (index 0 = null = dashboard) ──────────────
const TAB_DATA = {
  payroll: [
    null,
    {
      type:'table', title:'Employee Directory', icon:'👥',
      head:['Emp ID','Name','Department','Designation','Join Date','Salary','Status'],
      rows:[
        ['TN-001','Rahul Sharma','Engineering','Senior Dev','Jan 2022','₹45,000','Active'],
        ['TN-002','Priya Patel','HR','HR Manager','Mar 2021','₹38,000','Active'],
        ['TN-003','Amit Kumar','Finance','CFO','Jul 2019','₹55,000','Active'],
        ['TN-004','Sunita Singh','Marketing','Executive','Aug 2023','₹28,000','On Leave'],
        ['TN-005','Vikram Nair','Engineering','DevOps','May 2022','₹40,000','Active'],
        ['TN-006','Deepa Rao','Sales','Manager','Oct 2020','₹36,000','Active'],
        ['TN-007','Rajan Mehta','Operations','Coordinator','Feb 2023','₹32,000','Active'],
      ],
      statusCol:6, addLabel:'+ Add Employee',
    },
    {
      type:'action', title:'Run Payroll — April 2026', icon:'📄',
      summary:[
        {label:'Total Employees',val:'124',color:'#10b981'},
        {label:'Gross Payroll',val:'₹18.4L',color:'#6C63FF'},
        {label:'Total Deductions',val:'₹3.7L',color:'#FF6584'},
        {label:'Net Payout',val:'₹14.7L',color:'#f59e0b'},
      ],
      recentRuns:[
        ['March 2026','124','₹18.1L','₹14.5L','Completed','22 Mar 2026'],
        ['Feb 2026','122','₹17.8L','₹14.2L','Completed','20 Feb 2026'],
        ['Jan 2026','120','₹17.2L','₹13.8L','Completed','21 Jan 2026'],
        ['Dec 2025','118','₹16.8L','₹13.4L','Completed','22 Dec 2025'],
      ],
    },
    {
      type:'table', title:'Bank Transfers — April 2026', icon:'🏦',
      head:['Emp ID','Name','Bank','Account No','IFSC','Amount','Status'],
      rows:[
        ['TN-001','Rahul Sharma','HDFC Bank','XXXX1234','HDFC0001234','₹54,600','Transferred'],
        ['TN-002','Priya Patel','SBI','XXXX5678','SBIN0001234','₹46,100','Transferred'],
        ['TN-003','Amit Kumar','ICICI','XXXX9012','ICIC0001234','₹66,800','Transferred'],
        ['TN-004','Sunita Singh','Axis Bank','XXXX3456','UTIB0001234','₹34,000','Pending'],
        ['TN-005','Vikram Nair','Kotak Bank','XXXX7890','KKBK0001234','₹48,500','Transferred'],
        ['TN-006','Deepa Rao','SBI','XXXX2345','SBIN0005678','₹43,600','Transferred'],
      ],
      statusCol:6, addLabel:'Add Account',
    },
    {
      type:'report', title:'Payroll Reports', icon:'📊',
      chartData:[{label:'Jan',val:172},{label:'Feb',val:178},{label:'Mar',val:181},{label:'Apr',val:184}],
      chartColor:'#10b981',
      head:['Month','Employees','Gross Payroll','TDS','PF','Net Payout'],
      rows:[
        ['Apr 2026','124','₹18.4L','₹2.1L','₹1.6L','₹14.7L'],
        ['Mar 2026','124','₹18.1L','₹2.0L','₹1.5L','₹14.5L'],
        ['Feb 2026','122','₹17.8L','₹1.9L','₹1.5L','₹14.2L'],
        ['Jan 2026','120','₹17.2L','₹1.8L','₹1.4L','₹13.8L'],
      ],
    },
  ],
  crm: [
    null,
    {
      type:'table', title:'All Leads', icon:'🎯',
      head:['Lead ID','Company','Contact','Source','Value','Stage'],
      rows:[
        ['LD-001','Sharma Enterprises','Rohit Sharma','Website','₹1.2L','New'],
        ['LD-002','Tech Solutions Ltd','Neha Gupta','Referral','₹80K','Contacted'],
        ['LD-003','Global Traders','Vijay Patel','LinkedIn','₹2.5L','New'],
        ['LD-004','Patel Industries','Anita Patel','Cold Call','₹3L','Proposal'],
        ['LD-005','Mehta Corp','Suresh Mehta','Website','₹1.8L','Contacted'],
        ['LD-006','Singh Textiles','Rani Singh','Trade Show','₹4.5L','Proposal'],
        ['LD-007','Agarwal Group','Mohan Agarwal','Referral','₹2L','Negotiating'],
      ],
      statusCol:5, addLabel:'+ New Lead',
    },
    {
      type:'table', title:'Customers', icon:'👥',
      head:['Cust ID','Company','Contact','Phone','Total Deals','Revenue','Status'],
      rows:[
        ['CU-001','Gupta Pharma','Ramesh Gupta','9811234567','3 deals','₹6L','Active'],
        ['CU-002','Nair Exports','Sunil Nair','9922345678','2 deals','₹3.2L','Active'],
        ['CU-003','Reddy Builders','Chandra Reddy','9833456789','1 deal','₹12L','Active'],
        ['CU-004','Bose Electronics','Subir Bose','9744567890','4 deals','₹8.5L','VIP'],
        ['CU-005','Jain Textiles','Sanjay Jain','9655678901','2 deals','₹4.2L','Inactive'],
      ],
      statusCol:6, addLabel:'+ Add Customer',
    },
    {
      type:'table', title:'Active Deals', icon:'💼',
      head:['Deal ID','Company','Stage','Value','Owner','Close Date','Status'],
      rows:[
        ['DL-001','Sharma Enterprises','Proposal','₹1.2L','Ravi Kumar','30 Apr 2026','Hot'],
        ['DL-002','Patel Industries','Negotiating','₹3L','Priya Mehta','15 May 2026','Hot'],
        ['DL-003','Singh Textiles','Proposal','₹4.5L','Amit Joshi','01 May 2026','Warm'],
        ['DL-004','Agarwal Group','Contacted','₹2L','Ravi Kumar','20 May 2026','Warm'],
        ['DL-005','Kumar & Sons','New','₹60K','Sunita Rao','10 Jun 2026','Cold'],
      ],
      statusCol:6, addLabel:'+ New Deal',
    },
    {
      type:'table', title:'Follow-ups Scheduled', icon:'📞',
      head:['#','Company','Contact','Type','Date','Time','Notes'],
      rows:[
        ['1','Sharma Enterprises','Rohit Sharma','Call','22 Apr 2026','10:00 AM','Discuss pricing'],
        ['2','Patel Industries','Anita Patel','Meeting','23 Apr 2026','3:00 PM','Contract review'],
        ['3','Mehta Corp','Suresh Mehta','Email','24 Apr 2026','11:00 AM','Proposal followup'],
        ['4','Global Traders','Vijay Patel','Call','25 Apr 2026','2:30 PM','Demo scheduled'],
        ['5','Tech Solutions','Neha Gupta','Demo','28 Apr 2026','4:00 PM','Product demo'],
      ],
      statusCol:-1, addLabel:'+ Schedule',
    },
  ],
  hospital: [
    null,
    {
      type:'table', title:'Patient Registry', icon:'👤',
      head:['Patient ID','Name','Age','Gender','Blood Grp','Phone','Reg Date'],
      rows:[
        ['P-001','Ramesh Kumar','45','M','B+','9811234567','12 Jan 2026'],
        ['P-002','Sunita Devi','32','F','A+','9822345678','15 Jan 2026'],
        ['P-003','Arjun Singh','8','M','O+','9833456789','20 Feb 2026'],
        ['P-004','Meera Joshi','55','F','AB+','9844567890','05 Mar 2026'],
        ['P-005','Vikram Nair','38','M','B-','9855678901','18 Mar 2026'],
        ['P-006','Kavita Sharma','28','F','O+','9866789012','02 Apr 2026'],
        ['P-007','Raju Verma','62','M','A-','9877890123','10 Apr 2026'],
      ],
      statusCol:-1, addLabel:'+ Register Patient',
    },
    {
      type:'table', title:'Appointments — Today', icon:'📅',
      head:['Token','Patient','Doctor','Department','Time','Type','Status'],
      rows:[
        ['#001','Ramesh Kumar','Dr. Sharma','General','9:00 AM','OPD','Done'],
        ['#002','Sunita Devi','Dr. Patel','Cardiology','9:30 AM','OPD','Done'],
        ['#003','Arjun Singh','Dr. Gupta','Pediatrics','10:00 AM','OPD','Waiting'],
        ['#004','Meera Joshi','Dr. Sharma','General','10:30 AM','OPD','Waiting'],
        ['#005','Vikram Nair','Dr. Reddy','Orthopedics','11:00 AM','OPD','Scheduled'],
        ['#006','Kavita Sharma','Dr. Patel','Gynecology','11:30 AM','OPD','Scheduled'],
        ['#007','Raju Verma','Dr. Gupta','General','2:00 PM','Follow-up','Scheduled'],
      ],
      statusCol:6, addLabel:'+ New Appointment',
    },
    {
      type:'table', title:'Prescriptions', icon:'💊',
      head:['Rx ID','Patient','Doctor','Medicine','Dosage','Days','Date'],
      rows:[
        ['RX-001','Ramesh Kumar','Dr. Sharma','Paracetamol 500mg','1-0-1','5 days','22 Apr 2026'],
        ['RX-002','Sunita Devi','Dr. Patel','Amlodipine 5mg','0-0-1','30 days','22 Apr 2026'],
        ['RX-003','Arjun Singh','Dr. Gupta','Amoxicillin 250mg','1-1-1','7 days','22 Apr 2026'],
        ['RX-004','Meera Joshi','Dr. Sharma','Metformin 500mg','1-0-1','30 days','21 Apr 2026'],
        ['RX-005','Vikram Nair','Dr. Reddy','Diclofenac 50mg','0-1-1','5 days','21 Apr 2026'],
      ],
      statusCol:-1, addLabel:'+ New Prescription',
    },
    {
      type:'table', title:'IPD / OPD — Bed Status', icon:'🛏️',
      head:['Bed No','Ward','Patient','Doctor','Admitted','Days','Status'],
      rows:[
        ['B-101','General','Rajan Verma','Dr. Sharma','18 Apr 2026','4','Occupied'],
        ['B-102','General','—','—','—','—','Available'],
        ['B-103','ICU','Priya Mehta','Dr. Patel','20 Apr 2026','2','Occupied'],
        ['B-201','Surgical','Suresh Yadav','Dr. Reddy','19 Apr 2026','3','Occupied'],
        ['B-202','Surgical','—','—','—','—','Available'],
        ['B-301','Maternity','Sunita Devi','Dr. Gupta','21 Apr 2026','1','Occupied'],
      ],
      statusCol:6, addLabel:'+ Admit Patient',
    },
  ],
  school: [
    null,
    {
      type:'table', title:'Student Directory', icon:'👨‍🎓',
      head:['Roll No','Name','Class','Section','Parent Name','Phone','Status'],
      rows:[
        ['001','Aarav Sharma','X','A','Rajesh Sharma','9811234567','Active'],
        ['002','Ishita Patel','X','A','Dinesh Patel','9822345678','Active'],
        ['003','Rohan Kumar','X','B','Anil Kumar','9833456789','Active'],
        ['004','Neha Singh','IX','A','Suresh Singh','9844567890','Active'],
        ['005','Aryan Gupta','IX','B','Manoj Gupta','9855678901','Active'],
        ['006','Sia Verma','VIII','A','Ramesh Verma','9866789012','Active'],
        ['007','Dev Joshi','VIII','B','Sunil Joshi','9877890123','Inactive'],
      ],
      statusCol:6, addLabel:'+ Add Student',
    },
    {
      type:'table', title:'Attendance — Today', icon:'📅',
      head:['Class','Section','Total','Present','Absent','Percentage','Status'],
      rows:[
        ['Class X','A','42','40','2','95.2%','Good'],
        ['Class X','B','40','38','2','95.0%','Good'],
        ['Class IX','A','45','43','2','95.6%','Good'],
        ['Class IX','B','44','40','4','90.9%','Average'],
        ['Class VIII','A','46','46','0','100%','Excellent'],
        ['Class VIII','B','43','39','4','90.7%','Average'],
        ['Class VII','A','48','44','4','91.7%','Average'],
      ],
      statusCol:6, addLabel:'Mark Attendance',
    },
    {
      type:'table', title:'Fee Collection', icon:'💰',
      head:['Roll No','Student','Class','Annual Fee','Paid','Balance','Status'],
      rows:[
        ['001','Aarav Sharma','X-A','₹12,000','₹12,000','₹0','Paid'],
        ['002','Ishita Patel','X-A','₹12,000','₹12,000','₹0','Paid'],
        ['003','Rohan Kumar','X-B','₹12,000','₹6,000','₹6,000','Partial'],
        ['004','Neha Singh','IX-A','₹10,000','₹10,000','₹0','Paid'],
        ['005','Aryan Gupta','IX-B','₹10,000','₹0','₹10,000','Unpaid'],
        ['006','Sia Verma','VIII-A','₹8,000','₹8,000','₹0','Paid'],
        ['007','Dev Joshi','VIII-B','₹8,000','₹4,000','₹4,000','Partial'],
      ],
      statusCol:6, addLabel:'+ Record Payment',
    },
    {
      type:'table', title:'Exam Schedule & Results', icon:'📝',
      head:['Exam','Class','Subject','Date','Max Marks','Avg Score','Status'],
      rows:[
        ['Unit Test 1','X','Mathematics','10 Apr 2026','100','78.5','Completed'],
        ['Unit Test 1','X','Science','12 Apr 2026','100','82.3','Completed'],
        ['Unit Test 1','IX','Mathematics','11 Apr 2026','100','74.2','Completed'],
        ['Mid Term','X','All Subjects','15 May 2026','500','—','Upcoming'],
        ['Mid Term','IX','All Subjects','16 May 2026','500','—','Upcoming'],
        ['Annual Exam','X','All Subjects','15 Mar 2027','600','—','Scheduled'],
      ],
      statusCol:6, addLabel:'+ Schedule Exam',
    },
  ],
  restaurant: [
    null,
    {type:'tables-grid', title:'Table Status', icon:'🪑'},
    {
      type:'table', title:'Menu Items', icon:'📋',
      head:['Item','Category','Price','Prep Time','Available','Status'],
      rows:[
        ['Paneer Butter Masala','Main Course','₹280','20 min','Yes','Available'],
        ['Dal Makhani','Main Course','₹220','25 min','Yes','Available'],
        ['Veg Biryani (Full)','Rice','₹320','30 min','Yes','Available'],
        ['Chicken Tikka','Starter','₹380','15 min','Yes','Available'],
        ['Naan (2 pcs)','Bread','₹60','10 min','Yes','Available'],
        ['Masala Chai','Beverages','₹40','5 min','Yes','Available'],
        ['Gulab Jamun','Dessert','₹80','—','No','Out of Stock'],
        ['Pizza Margherita','Special','₹249','25 min','Yes','Available'],
      ],
      statusCol:5, addLabel:'+ Add Item',
    },
    {
      type:'table', title:'Delivery Orders', icon:'🛵',
      head:['Order#','Customer','Items','Amount','Distance','ETA','Status'],
      rows:[
        ['D-54','Rahul Gupta','Veg Biryani x1','₹320','3.2 km','32 min','Out for delivery'],
        ['D-55','Priya Sharma','Pizza x2','₹498','4.8 km','45 min','Preparing'],
        ['D-56','Amit Kumar','Dal+Naan x1','₹280','2.1 km','20 min','Ready'],
        ['D-57','Neha Patel','Chicken Tikka+Rice','₹460','6.5 km','58 min','Accepted'],
        ['D-58','Vijay Singh','Paneer Masala x1','₹340','1.8 km','15 min','Delivered'],
      ],
      statusCol:6, addLabel:'+ New Order',
    },
    {
      type:'table', title:'Kitchen Queue', icon:'👨‍🍳',
      head:['Order#','Table/Type','Items','Qty','Priority','Wait Time','Status'],
      rows:[
        ['#142','T-3 Dine-In','Dal Makhani + Tandoori','2','High','15 min','Cooking'],
        ['#143','D-55 Delivery','Pizza Margherita','2','Normal','25 min','Preparing'],
        ['#144','T-6 Dine-In','Chicken Tikka + Rice','3','High','10 min','Cooking'],
        ['#145','T-1 Dine-In','Paneer Butter Masala','2','Normal','5 min','Ready'],
        ['#146','D-56 Delivery','Dal + Naan','1','Normal','18 min','Preparing'],
      ],
      statusCol:6, addLabel:'New KOT',
    },
  ],
  realestate: [
    null,
    {
      type:'table', title:'Property Listings', icon:'🏠',
      head:['Prop ID','Property','Type','Area','Price','Agent','Status'],
      rows:[
        ['PR-001','Sector 21, Noida — 3BHK','Flat','1450 sqft','₹85 Lakh','Ravi Kumar','Available'],
        ['PR-002','MG Road, Pune — Shop','Commercial','650 sqft','₹1.2 Cr','Priya Mehta','Negotiating'],
        ['PR-003','Whitefield, Bangalore 2BHK','Flat','980 sqft','₹62 Lakh','Amit Joshi','Sold'],
        ['PR-004','Bandra, Mumbai — Villa','Bungalow','3200 sqft','₹4.5 Cr','Sunita Rao','Available'],
        ['PR-005','Connaught Place, Delhi','Commercial','1200 sqft','₹3.2 Cr','Raj Singh','Available'],
        ['PR-006','Gurgaon Sector 49 2BHK','Flat','850 sqft','₹55 Lakh','Ravi Kumar','Available'],
        ['PR-007','HSR Layout, Bangalore Villa','Villa','2800 sqft','₹2.8 Cr','Priya Mehta','Sold'],
      ],
      statusCol:6, addLabel:'+ Add Property',
    },
    {
      type:'table', title:'Buyer Inquiries', icon:'👥',
      head:['Buyer','Phone','Budget','Preferred Type','Location','Site Visited','Status'],
      rows:[
        ['Rohit Sharma','9811234567','₹80–90L','3BHK Flat','Noida','Yes','Hot'],
        ['Neha Gupta','9822345678','₹50–60L','2BHK Flat','Bangalore','Yes','Warm'],
        ['Vijay Patel','9833456789','₹2–3 Cr','Villa','Mumbai','No','Cold'],
        ['Anita Mehta','9844567890','₹1–1.5 Cr','Commercial','Delhi','Yes','Hot'],
        ['Suresh Nair','9855678901','₹40–50L','1BHK Flat','Pune','No','Cold'],
        ['Priya Jain','9866789012','₹3–4 Cr','Bungalow','Gurgaon','Yes','Warm'],
      ],
      statusCol:6, addLabel:'+ Add Buyer',
    },
    {
      type:'table', title:'Payment Schedule', icon:'💰',
      head:['Prop ID','Property','Buyer','Total Value','Paid','Balance','Status'],
      rows:[
        ['PR-001','Sector 21 Noida','Rohit Sharma','₹85 Lakh','₹25 Lakh','₹60 Lakh','In Progress'],
        ['PR-002','MG Road Pune','Vijay Kumar','₹1.2 Cr','₹1.2 Cr','₹0','Completed'],
        ['PR-003','Whitefield Bangalore','Anita Mehta','₹62 Lakh','₹62 Lakh','₹0','Completed'],
        ['PR-004','Bandra Mumbai','Priya Sharma','₹4.5 Cr','₹1.5 Cr','₹3 Cr','In Progress'],
        ['PR-005','CP Delhi','Suresh Rao','₹3.2 Cr','₹80 Lakh','₹2.4 Cr','Overdue'],
      ],
      statusCol:6, addLabel:'+ Add Payment',
    },
    {
      type:'table', title:'Agent Performance', icon:'🧑',
      head:['Agent','Listed','Sold','Revenue','Commission','Target','Status'],
      rows:[
        ['Ravi Kumar','48','12','₹4.2 Cr','₹8.4L','₹10L','On Track'],
        ['Priya Mehta','36','9','₹6.8 Cr','₹13.6L','₹12L','Exceeded'],
        ['Amit Joshi','52','8','₹3.5 Cr','₹7L','₹10L','Below'],
        ['Sunita Rao','28','6','₹9.2 Cr','₹18.4L','₹15L','Exceeded'],
        ['Raj Singh','44','11','₹8.1 Cr','₹16.2L','₹15L','Exceeded'],
      ],
      statusCol:6, addLabel:'+ Add Agent',
    },
  ],
  pharmacy: [
    null,
    {
      type:'table', title:'Medicine Inventory', icon:'💉',
      head:['Medicine','Manufacturer','Category','Stock','MRP','Expiry','Status'],
      rows:[
        ['Paracetamol 500mg','Cipla','Analgesic','2,400 tabs','₹2.50','Dec 2026','Good'],
        ['Amoxicillin 250mg','Sun Pharma','Antibiotic','45 strips','₹85.00','Jun 2026','Low Stock'],
        ["Metformin 500mg","Dr. Reddy's",'Diabetes','850 tabs','₹4.20','May 2026','Expiring Soon'],
        ['Cetirizine 10mg','Mankind','Antiallergic','320 tabs','₹3.80','Mar 2027','Good'],
        ['Pantoprazole 40mg','Cipla','Gastro','0 tabs','₹12.00','Aug 2026','Out of Stock'],
        ['Atorvastatin 10mg','Sun Pharma','Cardiac','1,200 tabs','₹8.50','Sep 2026','Good'],
        ['Azithromycin 500mg','Alkem','Antibiotic','80 strips','₹65.00','Jul 2026','Low Stock'],
      ],
      statusCol:6, addLabel:'+ Add Medicine',
    },
    {
      type:'table', title:"Today's Sales", icon:'📋',
      head:['Bill#','Customer','Medicine','Qty','Amount','Payment','Time'],
      rows:[
        ['RX-142','Ramesh Kumar','Paracetamol 500mg','10 tabs','₹25','Cash','9:15 AM'],
        ['RX-143','Priya Sharma','Amoxicillin 250mg','5 strips','₹425','UPI','9:45 AM'],
        ['RX-144','Amit Gupta','Metformin 500mg','30 tabs','₹126','Card','10:20 AM'],
        ['RX-145','Sunita Devi','Cetirizine 10mg','10 tabs','₹38','Cash','11:00 AM'],
        ['RX-146','Vikram Nair','Atorvastatin 10mg','30 tabs','₹255','UPI','11:35 AM'],
        ['RX-147','Kavita Patel','Azithromycin 500mg','3 strips','₹195','Cash','12:10 PM'],
      ],
      statusCol:-1, addLabel:'+ New Sale',
    },
    {
      type:'table', title:'Prescription Records', icon:'📜',
      head:['Rx#','Patient','Doctor','Hospital','Medicines','Date','Status'],
      rows:[
        ['RX-001','Ramesh Kumar','Dr. Sharma','City Hospital','Paracetamol, Cetirizine','22 Apr 2026','Dispensed'],
        ['RX-002','Priya Sharma','Dr. Patel','Apollo Clinic','Amoxicillin, Pantoprazole','22 Apr 2026','Dispensed'],
        ['RX-003','Amit Gupta','Dr. Reddy','Fortis','Metformin, Atorvastatin','21 Apr 2026','Dispensed'],
        ['RX-004','Neha Singh','Dr. Kumar','Max Hospital','Cetirizine','21 Apr 2026','Pending'],
        ['RX-005','Vijay Mehta','Dr. Sharma','City Hospital','Azithromycin','20 Apr 2026','Dispensed'],
      ],
      statusCol:6, addLabel:'+ Add Prescription',
    },
    {
      type:'table', title:'Expiry Alerts ⚠️', icon:'⚠️',
      head:['Medicine','Manufacturer','Stock','Batch No','MFG Date','Expiry','Days Left'],
      rows:[
        ["Metformin 500mg","Dr. Reddy's",'850 tabs','B-2024-03','Mar 2024','May 2026','38 days'],
        ['Amoxicillin 250mg','Sun Pharma','45 strips','B-2024-06','Jun 2024','Jun 2026','69 days'],
        ['Ranitidine 150mg','Cipla','120 tabs','B-2023-12','Dec 2023','Jun 2026','69 days'],
        ['Domperidone 10mg','Sun Pharma','200 tabs','B-2024-01','Jan 2024','Jul 2026','100 days'],
        ['Paracetamol IV','Baxter','40 vials','B-2024-02','Feb 2024','Jul 2026','100 days'],
      ],
      statusCol:-1, addLabel:'Return to Vendor',
    },
  ],
  analytics: [
    null,
    {
      type:'report', title:'Sales Analytics', icon:'📈',
      chartData:[{label:'Jan',val:62},{label:'Feb',val:68},{label:'Mar',val:71},{label:'Apr',val:84}],
      chartColor:'#ec4899',
      head:['Month','Orders','Revenue','Avg Order Value','Growth','Target'],
      rows:[
        ['Apr 2026','2,945','₹84.2L','₹2,861','↑ 23%','Achieved'],
        ['Mar 2026','2,680','₹68.5L','₹2,556','↑ 15%','Achieved'],
        ['Feb 2026','2,140','₹61.2L','₹2,860','↑ 8%','Achieved'],
        ['Jan 2026','1,980','₹58.1L','₹2,934','↑ 5%','Achieved'],
      ],
    },
    {
      type:'table', title:'Customer Analytics', icon:'👥',
      head:['Segment','Customers','Avg LTV','Orders/Mo','Retention','Revenue','Status'],
      rows:[
        ['Premium','342','₹42,000','8.2','94%','₹14.4L','Growing'],
        ['Regular','1,284','₹12,500','3.1','87%','₹16L','Stable'],
        ['New','856','₹4,200','1.2','62%','₹3.6L','Growing'],
        ['At Risk','234','₹8,900','0.3','31%','₹2.1L','Declining'],
        ['Churned','412','₹6,200','0','0%','₹0','Churned'],
      ],
      statusCol:6, addLabel:'Export Report',
    },
    {
      type:'report', title:'Revenue Breakdown', icon:'💰',
      chartData:[{label:'Q1 25',val:52},{label:'Q2 25',val:61},{label:'Q3 25',val:72},{label:'Q4 25',val:80},{label:'Q1 26',val:92}],
      chartColor:'#10b981',
      head:['Category','Revenue','Units','Margin','Growth','Contribution'],
      rows:[
        ['Software Licenses','₹38.2L','1,240','72%','↑ 28%','45%'],
        ['Implementation','₹22.4L','86','58%','↑ 18%','27%'],
        ['Support Plans','₹14.8L','342','82%','↑ 12%','18%'],
        ['Training','₹8.8L','124','65%','↑ 8%','10%'],
      ],
    },
    {
      type:'table', title:'Custom Reports', icon:'📋',
      head:['Report Name','Type','Created By','Frequency','Last Run','Format'],
      rows:[
        ['Monthly Revenue Summary','Revenue','Admin','Monthly','22 Apr 2026','PDF'],
        ['Lead Conversion Report','Sales','Sales Mgr','Weekly','20 Apr 2026','Excel'],
        ['Customer Churn Analysis','Customers','Analyst','Monthly','01 Apr 2026','PDF'],
        ['Inventory Turnover','Inventory','Ops Mgr','Quarterly','01 Jan 2026','Excel'],
        ['Employee Performance','HR','HR Mgr','Monthly','01 Apr 2026','PDF'],
      ],
      statusCol:-1, addLabel:'+ Create Report',
    },
  ],
};

// ── Status badge map ───────────────────────────────────────────────────────────
const STATUS_MAP = {
  Paid:'badge-green', Done:'badge-green', Good:'badge-green', Available:'badge-green',
  Won:'badge-green', Active:'badge-green', Completed:'badge-green', Transferred:'badge-green',
  Achieved:'badge-green', Exceeded:'badge-green', Dispensed:'badge-green', Excellent:'badge-green',
  Processing:'badge-yellow', Waiting:'badge-yellow', Partial:'badge-yellow',
  Negotiating:'badge-yellow', 'Low Stock':'badge-yellow', Scheduled:'badge-yellow',
  'Expiring Soon':'badge-yellow', Cooking:'badge-yellow', 'On Leave':'badge-yellow',
  'On Track':'badge-yellow', 'In Progress':'badge-yellow', Reserved:'badge-yellow',
  Occupied:'badge-yellow', Warm:'badge-yellow', Average:'badge-yellow', Pending:'badge-yellow',
  Hot:'badge-yellow', VIP:'badge-yellow',
  Unpaid:'badge-red', 'Out of Stock':'badge-red', Overdue:'badge-red',
  Below:'badge-red', Declining:'badge-red', Churned:'badge-red', Inactive:'badge-red', Critical:'badge-red',
  'Out for delivery':'badge-blue', Preparing:'badge-blue', Ready:'badge-blue', Sold:'badge-blue',
  New:'badge-blue', Contacted:'badge-blue', Growing:'badge-blue', Stable:'badge-blue',
  Upcoming:'badge-blue', Accepted:'badge-blue', Cold:'badge-blue',
};

// Restaurant tables grid data
const REST_TABLES = [
  {no:'T-1', cap:4,  status:'Occupied',  order:'#142', amount:'₹840'},
  {no:'T-2', cap:2,  status:'Available', order:'—',    amount:'—'},
  {no:'T-3', cap:4,  status:'Occupied',  order:'#141', amount:'₹380'},
  {no:'T-4', cap:6,  status:'Reserved',  order:'1 PM', amount:'—'},
  {no:'T-5', cap:2,  status:'Available', order:'—',    amount:'—'},
  {no:'T-6', cap:4,  status:'Occupied',  order:'#140', amount:'₹1,050'},
  {no:'T-7', cap:8,  status:'Available', order:'—',    amount:'—'},
  {no:'T-8', cap:4,  status:'Occupied',  order:'#139', amount:'₹560'},
  {no:'T-9', cap:6,  status:'Reserved',  order:'2 PM', amount:'—'},
  {no:'T-10',cap:2,  status:'Available', order:'—',    amount:'—'},
  {no:'T-11',cap:4,  status:'Occupied',  order:'#138', amount:'₹720'},
  {no:'T-12',cap:10, status:'Available', order:'—',    amount:'—'},
];

const CHART_DATA = [{month:'Jan',val:62},{month:'Feb',val:68},{month:'Mar',val:71},{month:'Apr',val:84}];

export default function GenericDemo() {
  const { module } = useParams();
  const cfg     = CONFIGS[module];
  const tabData = TAB_DATA[module] || [];
  const { theme } = useTheme();
  const isDark  = theme === 'dark';
  const tMuted  = isDark ? 'rgba(255,255,255,.6)'  : '#475569';
  const tBorder = isDark ? 'rgba(255,255,255,.2)'  : '#e2e8f0';
  const tBg     = isDark ? 'rgba(255,255,255,.03)' : '#f8fafc';

  const [tab,     setTab]     = useState(0);
  const [rows,    setRows]    = useState(cfg?.rows || []);
  const [tabRows, setTabRows] = useState({});
  const [toast,   setToast]   = useState(null);
  const [modal,   setModal]   = useState(false);
  const [newRow,  setNewRow]  = useState({});

  const showToast = (msg, type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  if (!cfg) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',flexDirection:'column',gap:16}}>
      <div style={{fontSize:'3rem'}}>🚧</div>
      <div style={{color:'var(--muted)'}}>Module not found. Go back and choose a valid demo.</div>
    </div>
  );

  const curTab  = tab > 0 ? tabData[tab] : null;
  const getCurRows = () => tabRows[tab] !== undefined ? tabRows[tab] : (curTab?.rows || []);

  const handleDeleteRow = (i) => {
    if (tab === 0) { setRows(prev => prev.filter((_,idx)=>idx!==i)); }
    else { setTabRows(prev => ({...prev, [tab]: getCurRows().filter((_,idx)=>idx!==i)})); }
    showToast('Record deleted');
  };

  const handleAdd = () => {
    const head = tab === 0 ? cfg.tableHead : curTab?.head;
    if (!head) return;
    if (!newRow.col0) return showToast('First field required!','error');
    const arr = head.map((_,i) => newRow[`col${i}`]||'—');
    if (tab === 0) { setRows(prev => [arr, ...prev]); }
    else { setTabRows(prev => ({...prev, [tab]: [arr, ...getCurRows()]})); }
    setNewRow({});
    setModal(false);
    showToast('Record added!');
  };

  const modalHead = tab === 0 ? cfg.tableHead : curTab?.head;

  // ── Sub-renderers ────────────────────────────────────────────────────────────

  const renderTable = (head, dataRows, statusCol, addLabel) => (
    <div className="card">
      <div className="card-header">
        <h3>{curTab?.icon || cfg.icon} {curTab?.title || cfg.title}</h3>
        {addLabel && <button className="btn-add" onClick={()=>setModal(true)}>{addLabel}</button>}
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr>{head.map(h=><th key={h}>{h}</th>)}<th>Action</th></tr></thead>
          <tbody>
            {dataRows.length===0 ? (
              <tr><td colSpan={head.length+1} className="empty-row">No records yet.</td></tr>
            ) : dataRows.map((row,i)=>(
              <tr key={i}>
                {row.map((cell,j)=>(
                  <td key={j} style={j===0?{fontWeight:700,color:cfg.color}:{}}>
                    {j===statusCol
                      ? <span className={`badge ${STATUS_MAP[cell]||'badge-blue'}`}>{cell}</span>
                      : cell}
                  </td>
                ))}
                <td><button className="btn-del" onClick={()=>handleDeleteRow(i)}>🗑</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTabContent = () => {
    // ── Dashboard (tab 0) ──────────────────────────────────────────────────────
    if (tab === 0) {
      return (
        <>
          {cfg.kanban && (
            <div className="card" style={{padding:'16px 18px'}}>
              <div className="card-header" style={{padding:'0 0 14px',border:'none'}}>
                <h3>🎯 Lead Pipeline</h3>
                <button className="btn-add" onClick={()=>showToast('Lead added to pipeline!')}>+ New Lead</button>
              </div>
              <div className="kanban">
                {cfg.kanbanCols.map((col,i)=>(
                  <div key={i} className="kanban-col" style={{background:`${col.color}12`,border:`1px solid ${col.color}30`}}>
                    <div className="kanban-col-title" style={{color:col.color}}>{col.title} ({col.items.length})</div>
                    {col.items.map((item,j)=>(
                      <div key={j} className="kanban-item">{item}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
          {cfg.chart && (
            <div className="card" style={{padding:'18px 20px',marginBottom:16}}>
              <h3 style={{fontSize:'.88rem',marginBottom:14}}>📈 Monthly Revenue 2026 (₹ Lakhs)</h3>
              <div className="bar-chart" style={{height:120}}>
                {CHART_DATA.map(d=>(
                  <div key={d.month} className="bar-col">
                    <div style={{color:'#ec4899',fontSize:'.75rem',fontWeight:700,marginBottom:4}}>₹{d.val}L</div>
                    <div className="bar-fill" style={{height:`${(d.val/84)*100}px`,background:'linear-gradient(to top,#ec4899,#8B5CF6)'}} />
                    <div className="bar-label">{d.month}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {cfg.tableHead && renderTable(cfg.tableHead, rows, cfg.statusCol, cfg.addLabel)}
        </>
      );
    }

    if (!curTab) return null;

    // ── Restaurant tables grid ─────────────────────────────────────────────────
    if (curTab.type === 'tables-grid') {
      const occupied  = REST_TABLES.filter(t=>t.status==='Occupied').length;
      const available = REST_TABLES.filter(t=>t.status==='Available').length;
      const reserved  = REST_TABLES.filter(t=>t.status==='Reserved').length;
      return (
        <div className="card" style={{padding:'18px 20px'}}>
          <div className="card-header" style={{marginBottom:16}}>
            <h3>🪑 Table Status</h3>
            <div style={{display:'flex',gap:14,fontSize:'.8rem'}}>
              <span style={{color:'#43E97B'}}>● Occupied: {occupied}</span>
              <span style={{color:tMuted}}>● Available: {available}</span>
              <span style={{color:'#f59e0b'}}>● Reserved: {reserved}</span>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:12}}>
            {REST_TABLES.map((t,i)=>(
              <div key={i} onClick={()=>showToast(`Table ${t.no}: ${t.status}${t.amount!=='—'?' — '+t.amount:''}`)}
                style={{padding:'14px 12px',borderRadius:12,border:'2px solid',cursor:'pointer',
                  borderColor:t.status==='Occupied'?'#43E97B':t.status==='Reserved'?'#f59e0b':tBorder,
                  background:t.status==='Occupied'?'rgba(67,233,123,.08)':t.status==='Reserved'?'rgba(245,158,11,.08)':tBg,
                }}>
                <div style={{fontSize:'1.6rem',textAlign:'center',marginBottom:6}}>🪑</div>
                <div style={{textAlign:'center',fontWeight:800,fontSize:'1.05rem'}}>{t.no}</div>
                <div style={{textAlign:'center',fontSize:'.7rem',color:'var(--muted)',margin:'3px 0'}}>Cap: {t.cap} pax</div>
                <div style={{textAlign:'center',marginTop:8}}>
                  <span className={`badge ${t.status==='Occupied'?'badge-green':t.status==='Reserved'?'badge-yellow':'badge-blue'}`}>{t.status}</span>
                </div>
                {t.amount!=='—' && <div style={{textAlign:'center',color:'#43E97B',fontWeight:700,fontSize:'.82rem',marginTop:6}}>{t.amount}</div>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ── Payroll Run action panel ───────────────────────────────────────────────
    if (curTab.type === 'action') {
      return (
        <>
          <div className="stats-grid" style={{marginBottom:16}}>
            {curTab.summary.map((s,i)=>(
              <div key={i} className="stat-card">
                <div className="s-label">{s.label}</div>
                <div className="s-val" style={{color:s.color}}>{s.val}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{padding:'20px',marginBottom:16}}>
            <h3 style={{fontSize:'.9rem',marginBottom:16}}>⚙️ Run Payroll</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Month</label>
                <select className="form-control">
                  <option>April</option><option>March</option><option>February</option><option>January</option>
                </select>
              </div>
              <div className="form-group">
                <label>Year</label>
                <select className="form-control"><option>2026</option><option>2025</option></select>
              </div>
              <div className="form-group">
                <label>Payroll Type</label>
                <select className="form-control">
                  <option>Regular</option><option>Advance</option><option>Supplemental</option>
                </select>
              </div>
            </div>
            <div style={{display:'flex',gap:12,marginTop:16,flexWrap:'wrap'}}>
              <button className="btn-add" onClick={()=>showToast('Payroll initiated for 124 employees! Processing...')}>▶ Run Payroll</button>
              <button style={{padding:'8px 18px',borderRadius:8,border:`1px solid ${tBorder}`,background:'transparent',color:tMuted,cursor:'pointer',fontSize:'.85rem'}}
                onClick={()=>showToast('Payroll preview generated!')}>👁 Preview</button>
              <button style={{padding:'8px 18px',borderRadius:8,border:`1px solid ${tBorder}`,background:'transparent',color:tMuted,cursor:'pointer',fontSize:'.85rem'}}
                onClick={()=>showToast('Payslips sent to all employees via email!')}>📧 Send Payslips</button>
            </div>
          </div>
          {curTab.recentRuns && (
            <div className="card">
              <div className="card-header"><h3>📋 Recent Payroll Runs</h3></div>
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Month</th><th>Employees</th><th>Gross</th><th>Net</th><th>Status</th><th>Run Date</th></tr></thead>
                  <tbody>
                    {curTab.recentRuns.map((row,i)=>(
                      <tr key={i}>
                        {row.map((cell,j)=>(
                          <td key={j} style={j===0?{fontWeight:700,color:cfg.color}:{}}>
                            {j===4 ? <span className="badge badge-green">{cell}</span> : cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      );
    }

    // ── Report (chart + table) ─────────────────────────────────────────────────
    if (curTab.type === 'report') {
      const maxV = Math.max(...curTab.chartData.map(d=>d.val));
      return (
        <>
          <div className="card" style={{padding:'18px 20px',marginBottom:16}}>
            <div className="card-header" style={{padding:'0 0 14px',border:'none'}}>
              <h3>{curTab.icon} {curTab.title}</h3>
              <button className="btn-add" onClick={()=>showToast('Report exported!')}>📄 Export</button>
            </div>
            <div className="bar-chart" style={{height:130}}>
              {curTab.chartData.map(d=>(
                <div key={d.label} className="bar-col">
                  <div style={{color:curTab.chartColor,fontSize:'.75rem',fontWeight:700,marginBottom:4}}>{d.val}</div>
                  <div className="bar-fill" style={{height:`${(d.val/maxV)*110}px`,background:`linear-gradient(to top,${curTab.chartColor},${curTab.chartColor}88)`}} />
                  <div className="bar-label">{d.label}</div>
                </div>
              ))}
            </div>
          </div>
          {curTab.head && (
            <div className="card">
              <div className="card-header"><h3>{curTab.icon} {curTab.title} — Summary</h3></div>
              <div className="table-wrap">
                <table>
                  <thead><tr>{curTab.head.map(h=><th key={h}>{h}</th>)}</tr></thead>
                  <tbody>
                    {curTab.rows.map((row,i)=>(
                      <tr key={i}>
                        {row.map((cell,j)=>(
                          <td key={j} style={j===0?{fontWeight:700,color:cfg.color}:{}}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      );
    }

    // ── Default: standard table ────────────────────────────────────────────────
    return renderTable(curTab.head, getCurRows(), curTab.statusCol ?? -1, curTab.addLabel);
  };

  return (
    <DemoLayout title={cfg.title} icon={cfg.icon} color={cfg.color} variant={cfg.variant || 'default'}
      menuItems={cfg.menu} activeItem={tab} onMenuClick={setTab}>

      <div className="stats-grid">
        {cfg.stats.map((s,i)=>(
          <div key={i} className="stat-card">
            <div className="s-label">{s.label}</div>
            <div className="s-val" style={{color:s.color}}>{s.val}</div>
            <div className={`s-chg ${s.up?'up':'down'}`}>{s.up?'▲':'▼'} {s.chg}</div>
          </div>
        ))}
      </div>

      {renderTabContent()}

      {modal && modalHead && (
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setModal(false)}>
          <div className="modal">
            <div className="modal-head">
              <h3>{cfg.icon} Add New Record</h3>
              <button className="close-btn" onClick={()=>setModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                {modalHead.map((h,i)=>(
                  <div key={i} className="form-group">
                    <label>{h}</label>
                    <input className="form-control" placeholder={`Enter ${h}...`}
                      value={newRow[`col${i}`]||''}
                      onChange={e=>setNewRow(p=>({...p,[`col${i}`]:e.target.value}))} />
                  </div>
                ))}
              </div>
              <div className="form-footer">
                <button className="btn-cancel" onClick={()=>setModal(false)}>Cancel</button>
                <button className="btn-add" onClick={handleAdd}>Save Record</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.type==='success'?'✅':'❌'} {toast.msg}</div>}
    </DemoLayout>
  );
}
