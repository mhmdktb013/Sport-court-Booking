import React, { useState, useEffect } from 'react';
import { courtService, adminService } from '../../services/api';
import { useVenue } from '../../context/VenueContext';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import AdminCourtModal from './AdminCourtModal';

const AdminCourtsManager = () => {
  const { venue } = useVenue();
  const { user } = useAuth();
  const currencySymbol = venue?.currencySymbol || '$';

  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);

  const activeVenueId = user?.venueId || venue?.venueId;

  const fetchCourts = async () => {
    setLoading(true);
    try {
      const res = await courtService.getCourts('all', activeVenueId);
      if (res.data.success) {
        setCourts(res.data.courts);
      }
    } catch (err) {
      console.error('Failed to load courts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourts();
  }, [activeVenueId]);

  const handleAddNew = () => {
    setEditingCourt(null);
    setIsModalOpen(true);
  };

  const handleEdit = (court) => {
    setEditingCourt(court);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this court?')) return;
    try {
      await adminService.deleteCourt(id);
      fetchCourts();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const getSportBadge = (sport) => {
    switch (sport) {
      case 'football': return 'badge-green';
      case 'padel': return 'badge-blue';
      case 'tennis': return 'badge-orange';
      case 'basketball': return 'badge-purple';
      default: return 'badge-gray';
    }
  };

  return (
    <div>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
      }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
            Sports Facility Courts ({courts.length})
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Configure court names, prices, operating hours, and active status.
          </p>
        </div>

        <button onClick={handleAddNew} className="btn btn-primary">
          <Plus size={16} /> Add New Court
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading court list...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm-grid-cols-2 lg-grid-cols-3 gap-6">
          {courts.map((court) => (
            <div key={court._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', height: '180px', background: '#1c2438' }}>
                <img
                  src={court.images?.[0] || 'https://images.unsplash.com/photo-1529900245534-47fbfb57835a?auto=format&fit=crop&w=800&q=80'}
                  alt={court.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '0.4rem' }}>
                  <span className={`badge ${getSportBadge(court.sportType)}`}>
                    {court.sportType}
                  </span>
                  <span className={`badge ${court.isActive ? 'badge-green' : 'badge-red'}`}>
                    {court.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: 'rgba(9, 13, 22, 0.9)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                }}>
                  {currencySymbol}{court.pricePerHour}/hr
                </div>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
                  {court.name}
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.75rem', flex: 1 }}>
                  {court.description || court.surface}
                </p>

                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>
                  Hours: <strong>{court.openingTime} - {court.closingTime}</strong> • {court.environment}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                  <button
                    onClick={() => handleEdit(court)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Edit2 size={14} /> Edit Court
                  </button>
                  <button
                    onClick={() => handleDelete(court._id)}
                    className="btn btn-danger btn-sm"
                    style={{ padding: '0.4rem 0.65rem' }}
                    title="Delete Court"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Court Modal */}
      <AdminCourtModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        court={editingCourt}
        onSaved={fetchCourts}
      />
    </div>
  );
};

export default AdminCourtsManager;
