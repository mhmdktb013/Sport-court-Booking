import React from 'react';
import { Trophy, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVenue } from '../../context/VenueContext';

const Footer = () => {
  const { venue } = useVenue();

  const brandName = venue?.name || 'SPORTSZONE';
  const address = venue?.address ? `${venue.address}${venue.city ? `, ${venue.city}` : ''}` : 'SportsZone Complex, Arena Boulevard';
  const phone = venue?.phone || venue?.whatsappNumber || '+1 (555) 890-COURT';
  const hours = venue?.openingHour && venue?.closingHour
    ? `Open Daily: ${venue.openingHour} – ${venue.closingHour}`
    : 'Open Daily: 08:00 AM – 12:00 Midnight';

  return (
    <footer style={{
      background: '#070a12',
      borderTop: '1px solid var(--border-color)',
      padding: '4rem 0 2rem 0',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div className="grid grid-cols-1 sm-grid-cols-2 lg-grid-cols-4 gap-8" style={{ marginBottom: '3rem' }}>
          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-3" style={{ marginBottom: '1rem' }}>
              {venue?.logoUrl ? (
                <img
                  src={venue.logoUrl}
                  alt={brandName}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#042f2e',
                }}>
                  <Trophy size={20} strokeWidth={2.5} />
                </div>
              )}
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                {brandName}
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              The modern standard in sports venue management and instant court bookings. Football, Padel, Tennis, and Basketball under one roof.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Links
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <Link to="/" style={{ transition: 'color 0.2s' }}>Home</Link>
              <Link to="/booking" style={{ transition: 'color 0.2s' }}>Check Live Availability</Link>
              <Link to="/lookup" style={{ transition: 'color 0.2s' }}>Look Up My Booking</Link>
              <Link to="/login" style={{ transition: 'color 0.2s' }}>Staff & Admin Access</Link>
            </div>
          </div>

          {/* Col 3: Sports Offered */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Sports Facilities
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <span>⚽ 7v7 & 5v5 FIFA AstroTurf Pitches</span>
              <span>🎾 World Padel Tour Panoramic Courts</span>
              <span>🎾 Clay & Acrylic Hard Tennis Courts</span>
              <span>🏀 FIBA Regulation Hardwood Arena</span>
            </div>
          </div>

          {/* Col 4: Facility Info */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#fff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Facility Details
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <div className="flex items-center gap-2">
                <MapPin size={16} color="var(--primary)" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} color="var(--primary)" />
                <span>{hours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} color="var(--primary)" />
                <span>{phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border-color)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8125rem',
          color: 'var(--text-dim)',
          gap: '1rem',
        }}>
          <div>© {new Date().getFullYear()} {brandName}. All rights reserved.</div>
          <div>Instant Availability • Zero Double Booking • Real-Time Engine</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
