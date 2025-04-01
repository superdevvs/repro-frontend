
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Shoots from '@/pages/Shoots';
import BookShoot from '@/pages/BookShoot';
import ShootCalendar from '@/pages/ShootCalendar';
import Clients from '@/pages/Clients';
import Photographers from '@/pages/Photographers';
import Invoices from '@/pages/Invoices';
import Reports from '@/pages/Reports';
import Messages from '@/pages/Messages';
import Media from '@/pages/Media';
import Accounts from '@/pages/Accounts';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Availability from '@/pages/Availability';
import ServiceManagement from '@/pages/ServiceManagement';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/shoots" element={<Shoots />} />
      <Route path="/book-shoot" element={<BookShoot />} />
      <Route path="/calendar" element={<ShootCalendar />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/photographers" element={<Photographers />} />
      <Route path="/services" element={<ServiceManagement />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/media" element={<Media />} />
      <Route path="/accounts" element={<Accounts />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/availability" element={<Availability />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
