import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { adminService } from '../../services/api';

const AdminCourtModal = ({ isOpen, onClose, court, onSaved }) => {
  const [formData, setFormData] = useState({
    name: '',
    sportType: 'football',
    description: '',
    surface: 'Standard Turf',
    environment: 'outdoor',
    pricePerHour: 50,
    openingTime: '08:00',
    closingTime: '23:00',
    slotDurationMinutes: 60,
    images: '',
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (court) {
      setFormData({
        name: court.name || '',
        sportType: court.sportType || 'football',
        description: court.description || '',
        surface: court.surface || 'Standard Turf',
        environment: court.environment || 'outdoor',
        pricePerHour: court.pricePerHour || 50,
        openingTime: court.openingTime || '08:00',
        closingTime: court.closingTime || '23:00',
        slotDurationMinutes: court.slotDurationMinutes || 60,
        images: court.images ? court.images.join(', ') : '',
        isActive: court.isActive !== undefined ? court.isActive : true,
      });
    } else {
      setFormData({
        name: '',
        sportType: 'football',
        description: '',
        surface: 'FIFA AstroTurf',
        environment: 'outdoor',
        pricePerHour: 50,
        openingTime: '08:00',
        closingTime: '23:00',
        slotDurationMinutes: 60,
        images: '',
        isActive: true,
      });
    }
  }, [court, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        pricePerHour: Number(formData.pricePerHour),
        slotDurationMinutes: Number(formData.slotDurationMinutes),
        images: formData.images
          ? formData.images.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (court) {
        await adminService.updateCourt(court._id, payload);
      } else {
        await adminService.createCourt(payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save court');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={court ? 'Edit Sports Court' : 'Add New Sports Court'}
      subtitle="Configure court specifications, timing, and hourly rate"
      maxWidth="600px"
    >
      {errorMsg && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#f87171',
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1rem',
          fontSize: '0.875rem',
        }}>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm-grid-cols-2 gap-4">
          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label className="input-label">Court Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Football Pitch 1 (Pro 7v7)"
              required
              className="input-control"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Sport Category *</label>
            <select
              name="sportType"
              value={formData.sportType}
              onChange={handleChange}
              className="input-control"
            >
              <option value="football">Football</option>
              <option value="padel">Padel</option>
              <option value="tennis">Tennis</option>
              <option value="basketball">Basketball</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Hourly Price ($ USD) *</label>
            <input
              type="number"
              name="pricePerHour"
              value={formData.pricePerHour}
              onChange={handleChange}
              min="0"
              required
              className="input-control"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Surface Material</label>
            <input
              type="text"
              name="surface"
              value={formData.surface}
              onChange={handleChange}
              placeholder="e.g. FIFA Quality Pro AstroTurf"
              className="input-control"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Environment</label>
            <select
              name="environment"
              value={formData.environment}
              onChange={handleChange}
              className="input-control"
            >
              <option value="outdoor">Outdoor</option>
              <option value="indoor">Indoor</option>
              <option value="covered">Covered</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Opening Time (HH:mm)</label>
            <input
              type="text"
              name="openingTime"
              value={formData.openingTime}
              onChange={handleChange}
              placeholder="08:00"
              className="input-control"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Closing Time (HH:mm)</label>
            <input
              type="text"
              name="closingTime"
              value={formData.closingTime}
              onChange={handleChange}
              placeholder="23:00"
              className="input-control"
            />
          </div>

          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label className="input-label">Image URLs (comma separated)</label>
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-1..."
              className="input-control"
            />
          </div>

          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label className="input-label">Court Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="input-control"
              placeholder="Features, amenities, lights, player dugouts..."
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', gridColumn: 'span 2', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              id="isActiveCheck"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
            />
            <label htmlFor="isActiveCheck" style={{ fontSize: '0.875rem', color: '#fff', cursor: 'pointer' }}>
              Active (Visible for public booking)
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="btn btn-primary" style={{ flex: 2 }}>
            {submitting ? 'Saving...' : court ? 'Update Court' : 'Create Court'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminCourtModal;
