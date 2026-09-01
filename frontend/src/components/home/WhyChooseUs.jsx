import React from 'react';
import { ShieldCheck, Zap, SunMedium, Smartphone } from 'lucide-react';

const features = [
  {
    icon: <Zap size={24} color="#10b981" />,
    title: 'Instant Online Slot Reservation',
    description: 'Browse real-time open slots and lock your game immediately with instant booking confirmation.',
  },
  {
    icon: <ShieldCheck size={24} color="#10b981" />,
    title: 'Zero Double-Booking Guarantee',
    description: 'State-of-the-art atomic booking concurrency engine ensures your slot is secured exclusively for you.',
  },
  {
    icon: <SunMedium size={24} color="#10b981" />,
    title: 'Championship Courts & Lighting',
    description: 'FIFA Pro AstroTurf, WPT Panoramic Glass, and anti-glare LED illumination for day and night games.',
  },
  {
    icon: <Smartphone size={24} color="#10b981" />,
    title: 'Frictionless Mobile Experience',
    description: 'Book on the go from any mobile device in under 30 seconds with instant phone verification.',
  },
];

const WhyChooseUs = () => {
  return (
    <section style={{ padding: '4.5rem 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            The SportsZone Advantage
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.25rem', color: '#fff' }}>
            Why Players & Clubs Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm-grid-cols-2 lg-grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
