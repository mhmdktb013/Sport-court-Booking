import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useVenue } from '../../context/VenueContext';
import { Calendar, ShieldCheck, Zap, Award, ArrowRight } from 'lucide-react';

const Hero = () => {
  const { venue } = useVenue();
  const location = useLocation();

  const getVenueLink = (targetPath) => {
    const params = new URLSearchParams(location.search);
    const slug = params.get('venue') || params.get('v') || (venue?.slug && venue.slug !== 'chocair-arena' ? venue.slug : '');
    if (slug) {
      return `${targetPath}?venue=${slug}`;
    }
    return targetPath;
  };

  return (
    <section style={{
      position: 'relative',
      padding: '5rem 0 4rem 0',
      background: 'radial-gradient(circle at 50% 20%, rgba(16, 185, 129, 0.12) 0%, rgba(9, 13, 22, 1) 75%)',
      borderBottom: '1px solid var(--border-color)',
    }}>
      <div className="container">
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          {/* Top Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            fontSize: '0.8125rem',
            fontWeight: 700,
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            <Zap size={14} fill="currentColor" /> Real-Time Live Availability Engine
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.25rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
          }}>
            Book Your Court in Seconds. <br />
            <span style={{
              background: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Zero Hassle. Zero Double-Bookings.
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            maxWidth: '680px',
            marginInline: 'auto',
          }}>
            Experience world-class football pitches, panoramic padel courts, championship tennis, and hardwood basketball arenas. Choose your date, pick an open slot, and lock your match instantly.
          </p>

          {/* Action CTAs */}
          <div className="flex justify-center items-center gap-4" style={{ flexWrap: 'wrap' }}>
            <Link to={getVenueLink('/booking')} className="btn btn-primary btn-lg">
              <Calendar size={20} /> Find & Book Court Now
            </Link>
            <Link to={getVenueLink('/lookup')} className="btn btn-secondary btn-lg">
              Manage / Find Booking <ArrowRight size={18} />
            </Link>
          </div>

          {/* Trust Badges */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '3.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-color)',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
          }}>
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} color="var(--primary)" />
              <span>Instant Atomic Concurrency Lock</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={18} color="var(--primary)" />
              <span>Pro-Grade Tournament Surfaces</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={18} color="var(--primary)" />
              <span>Direct Mobile-Optimized Booking</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
