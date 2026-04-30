import { Routes, Route } from 'react-router-dom';
import Home             from './pages/Home.jsx';
import InventoryDemo    from './pages/InventoryDemo.jsx';
import BillingDemo      from './pages/BillingDemo.jsx';
import HRDemo           from './pages/HRDemo.jsx';
import POSDemo          from './pages/POSDemo.jsx';
import GenericDemo      from './pages/GenericDemo.jsx';
import AdminPanel       from './pages/AdminPanel.jsx';
import AboutPage        from './pages/AboutPage.jsx';
import CareerPage       from './pages/CareerPage.jsx';
import SoftwaresPage    from './pages/SoftwaresPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/"                   element={<Home />} />
      <Route path="/about"              element={<AboutPage />} />
      <Route path="/softwares"          element={<SoftwaresPage />} />
      <Route path="/career"             element={<CareerPage />} />
      <Route path="/demo/inventory"     element={<InventoryDemo />} />
      <Route path="/demo/billing"       element={<BillingDemo />} />
      <Route path="/demo/hr"            element={<HRDemo />} />
      <Route path="/demo/pos"           element={<POSDemo />} />
      <Route path="/demo/:module"       element={<GenericDemo />} />
      <Route path="/admin"              element={<AdminPanel />} />
    </Routes>
  );
}
