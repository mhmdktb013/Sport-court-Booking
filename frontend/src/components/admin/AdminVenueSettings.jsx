import React, { useState, useEffect } from 'react';
import { useVenue } from '../../context/VenueContext';
import { Save, AlertCircle, CheckCircle, Upload } from 'lucide-react';

const AdminVenueSettings = () => {
  const { venue, loading, updateVenue } = useVenue();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    subdomain: '',
    customDomain: '',
    websiteUrl: '',
    logoUrl: '',
    primaryColor: '#10b981',
    secondaryColor: '#042f2e',
    accentColor: '#3b82f6',
    address: '',
    city: '',
    phone: '',
    whatsappNumber: '',
    instagramHandle: '',
    openingHour: '08:00',
    closingHour: '23:00',
    defaultSlotDuration: 60,
    currency: 'USD',
    currencySymbol: '$',
    exchangeRateToUSD: 1,
    sendWhatsAppNotifications: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);

  useEffect(() => {
    if (venue) {
      setFormData({
        name: venue.name || '',
        slug: venue.slug || '',
        subdomain: venue.subdomain || '',
        customDomain: venue.customDomain || '',
        websiteUrl: venue.websiteUrl || '',
        logoUrl: venue.logoUrl || '',
        primaryColor: venue.primaryColor || '#10b981',
        secondaryColor: venue.secondaryColor || '#042f2e',
        accentColor: venue.accentColor || '#3b82f6',
        address: venue.address || '',
        city: venue.city || '',
        phone: venue.phone || '',
        whatsappNumber: venue.whatsappNumber || '',
        instagramHandle: venue.instagramHandle || '',
        openingHour: venue.openingHour || '08:00',
        closingHour: venue.closingHour || '23:00',
        defaultSlotDuration: venue.defaultSlotDuration || 60,
        currency: venue.currency || 'USD',
        currencySymbol: venue.currencySymbol || '$',
        exchangeRateToUSD: venue.exchangeRateToUSD || 1,
        sendWhatsAppNotifications: venue.sendWhatsAppNotifications || false,
      });
    }
  }, [venue]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleColorChange = (colorField, value) => {
    setFormData((prev) => ({
      ...prev,
      [colorField]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      await updateVenue(formData);
      setMessageType('success');
      setMessage('Venue settings updated successfully!');
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--border-color)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto',
        }}>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
          Venue Settings & Branding
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Customize your venue name, branding, colors, and operational settings.
        </p>
      </div>

      {/* Alert Messages */}
      {message && (
        <div style={{
          background: messageType === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${messageType === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          color: messageType === 'success' ? '#34d399' : '#f87171',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          {messageType === 'success' ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          {message}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          marginBottom: '1.75rem',
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
            Basic Information
          </h3>

          {/* Venue Name */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
              Venue Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Chocair Arena"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: '#090e1a',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.95rem',
              }}
            />
          </div>

          {/* City */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g., Beirut"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: '#090e1a',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.95rem',
              }}
            />
          </div>

          {/* Address */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g., Beirut Complex, Hamra Street"
              rows={2}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: '#090e1a',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
              }}
            />
          </div>
        </div>

        {/* White-Label Domains & Subdomains */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          marginBottom: '1.75rem',
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
            White-Label & Domain Mapping
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Configure your dedicated URL, custom branding subdomain, or connected custom domain.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
                Tenant Slug (URL Path)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="e.g., chocair-arena"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#090e1a',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.95rem',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                Accessible via <code>?venue={formData.slug || 'slug'}</code>
              </span>
            </div>

            <div>
              <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
                Dedicated Subdomain
              </label>
              <input
                type="text"
                name="subdomain"
                value={formData.subdomain}
                onChange={handleChange}
                placeholder="e.g., chocair"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#090e1a',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.95rem',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                e.g. <code>{formData.subdomain || 'venue'}.sportszone.app</code>
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
                Custom Domain (CNAME / SSL)
              </label>
              <input
                type="text"
                name="customDomain"
                value={formData.customDomain}
                onChange={handleChange}
                placeholder="e.g., booking.chocairarena.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#090e1a',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.95rem',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
                Point your domain's CNAME record to our edge cluster.
              </span>
            </div>

            <div>
              <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
                Official Website URL
              </label>
              <input
                type="url"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://chocairarena.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#090e1a',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.95rem',
                }}
              />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          marginBottom: '1.75rem',
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
            Branding & Colors
          </h3>

          {/* Logo URL */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
              Logo URL
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="url"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  background: '#090e1a',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.95rem',
                }}
              />
              <button
                type="button"
                style={{
                  padding: '0.75rem 1.25rem',
                  background: 'var(--primary)',
                  color: '#042f2e',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                }}
              >
                <Upload size={16} /> Upload
              </button>
            </div>
          </div>

          {/* Color Pickers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            {/* Primary Color */}
            <div>
              <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
                Primary Color
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  style={{
                    width: '50px',
                    height: '50px',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                  }}
                />
                <input
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    background: '#090e1a',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>
            </div>

            {/* Secondary Color */}
            <div>
              <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
                Secondary Color
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={formData.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  style={{
                    width: '50px',
                    height: '50px',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                  }}
                />
                <input
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    background: '#090e1a',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
                Accent Color
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  style={{
                    width: '50px',
                    height: '50px',
                    border: '2px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                  }}
                />
                <input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) => handleColorChange('accentColor', e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    background: '#090e1a',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    color: '#fff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Operations */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          marginBottom: '1.75rem',
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
            Operational Settings
          </h3>

          {/* Operating Hours */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
                Opening Hour
              </label>
              <input
                type="time"
                name="openingHour"
                value={formData.openingHour}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#090e1a',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.95rem',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
                Closing Hour
              </label>
              <input
                type="time"
                name="closingHour"
                value={formData.closingHour}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#090e1a',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.95rem',
                }}
              />
            </div>
          </div>

          {/* Default Slot Duration */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
              Default Slot Duration (minutes)
            </label>
            <select
              name="defaultSlotDuration"
              value={formData.defaultSlotDuration}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: '#090e1a',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.95rem',
              }}
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes (Football)</option>
              <option value={90}>90 minutes (Padel)</option>
              <option value={120}>120 minutes</option>
            </select>
          </div>
        </div>

        {/* Contact & Currency */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          marginBottom: '1.75rem',
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
            Contact & Currency
          </h3>

          {/* Phone Numbers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+961 1 234 567"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#090e1a',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.95rem',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
                WhatsApp Number
              </label>
              <input
                type="tel"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                placeholder="+961 71 234 567"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#090e1a',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.95rem',
                }}
              />
            </div>
          </div>

          {/* Currency */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#090e1a',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.95rem',
                }}
              >
                <option value="USD">USD ($)</option>
                <option value="LBP">LBP (ل.ل)</option>
                <option value="EUR">EUR (€)</option>
                <option value="AED">AED (د.إ)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: '#fff', fontWeight: 600, marginBottom: '0.5rem' }}>
                Currency Symbol
              </label>
              <input
                type="text"
                name="currencySymbol"
                value={formData.currencySymbol}
                onChange={handleChange}
                maxLength={3}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#090e1a',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.95rem',
                }}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '0.85rem 2rem',
              background: submitting ? '#64748b' : 'var(--primary)',
              color: submitting ? '#e2e8f0' : '#042f2e',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 700,
              cursor: submitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              transition: 'all 0.2s ease',
            }}
          >
            <Save size={18} />
            {submitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminVenueSettings;
