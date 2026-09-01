import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Search, Shield, Menu, X, Trophy, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useVenue } from '../../context/VenueContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const { venue } = useVenue();

  const isActive = (path) => location.pathname === path;

  const brandName = venue?.name || 'SPORTSZONE';
  const subtitle = venue?.city ? `${venue.city} Arena & Court Booking` : 'Premier Arena Booking';

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(9, 13, 22, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
    }}>
      <div className="container flex items-center justify-between" style={{ height: '70px' }}>
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
          {venue?.logoUrl ? (
            <img
              src={venue.logoUrl}
              alt={brandName}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                objectFit: 'cover',
                border: '1px solid var(--border-color)',
              }}
            />
          ) : (
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#042f2e',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            }}>
              <Trophy size={22} strokeWidth={2.5} />
            </div>
          )}
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              {brandName}
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '-2px' }}>
              {subtitle}
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="flex items-center gap-6" style={{ display: 'none' }}>
          <style>{`
            @media (min-width: 768px) {
              .desktop-nav { display: flex !important; }
              .mobile-toggle { display: none !important; }
            }
          `}</style>
        </nav>
        
        <div className="desktop-nav items-center gap-8" style={{ display: 'none' }}>
          <Link
            to="/"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'color 0.2s',
            }}
          >
            Home
          </Link>
          <Link
            to="/booking"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: isActive('/booking') ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'color 0.2s',
            }}
          >
            Book Court
          </Link>
          <Link
            to="/lookup"
            style={{
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: isActive('/lookup') ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'color 0.2s',
            }}
          >
            Find My Booking
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="badge badge-purple"
              style={{ padding: '0.4rem 0.75rem', textDecoration: 'none' }}
            >
              <Shield size={14} /> Admin Portal
            </Link>
          )}
        </div>

        {/* Desktop Right CTA */}
        <div className="desktop-nav items-center gap-3" style={{ display: 'none' }}>
          <Link to="/booking" className="btn btn-primary btn-sm">
            <Calendar size={16} /> Book Now
          </Link>

          {user ? (
            <button onClick={logout} className="btn btn-outline btn-sm">
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn-outline btn-sm">
              Admin Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle btn btn-secondary btn-sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
          style={{ padding: '0.5rem' }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-color)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.5rem 0',
              fontWeight: 600,
              color: isActive('/') ? 'var(--primary)' : 'var(--text-main)',
            }}
          >
            Home
          </Link>
          <Link
            to="/booking"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.5rem 0',
              fontWeight: 600,
              color: isActive('/booking') ? 'var(--primary)' : 'var(--text-main)',
            }}
          >
            Book Court
          </Link>
          <Link
            to="/lookup"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              padding: '0.5rem 0',
              fontWeight: 600,
              color: isActive('/lookup') ? 'var(--primary)' : 'var(--text-main)',
            }}
          >
            Find My Booking
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="badge badge-purple"
              style={{ width: 'fit-content', padding: '0.4rem 0.75rem' }}
            >
              <Shield size={14} /> Admin Portal
            </Link>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <Link
              to="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              <Calendar size={16} /> Book Now
            </Link>
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="btn btn-outline"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-outline"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
