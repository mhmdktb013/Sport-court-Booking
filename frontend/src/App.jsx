import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import BookingLookupPage from './pages/BookingLookupPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import { useVenue } from './context/VenueContext';

function App() {
  const { venue, resolved } = useVenue();

  // Hold the shell until the tenant is known so no other venue's branding can flash
  if (!venue && !resolved) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#090e1a',
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          border: '3px solid rgba(255, 255, 255, 0.12)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'venueBootSpin 0.8s linear infinite',
        }} />
        <style>{`@keyframes venueBootSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/lookup" element={<BookingLookupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
