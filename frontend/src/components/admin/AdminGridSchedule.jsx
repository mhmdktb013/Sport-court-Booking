import React, { useState, useEffect } from 'react';
import { adminService, bookingService } from '../../services/api';
import { useVenue } from '../../context/VenueContext';
import { Calendar, Lock, AlertCircle, Plus, User, Phone, CheckCircle, XCircle } from 'lucide-react';
import Modal from '../common/Modal';

const AdminGridSchedule = () => {
  const { venue } = useVenue();
  const currencySymbol = venue?.currencySymbol || '$';
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedSport, setSelectedSport] = useState('all');
  const [gridData, setGridData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states for inspecting slot / blocking / booking
  const [selectedSlotModal, setSelectedSlotModal] = useState(null); // { type: 'booked'|'available'|'blocked', court, slot }
  const [blockReason, setBlockReason] = useState('Facility Maintenance');
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const res = await adminService.getCalendar(selectedDate, selectedSport);
      if (res.data.success) {
        setGridData(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin calendar:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [selectedDate, selectedSport]);

  const handleSlotClick = (court, slot) => {
    setSelectedSlotModal({
      court,
      slot,
      date: selectedDate,
    });
  };

  const handleCloseModal = () => {
    setSelectedSlotModal(null);
    setWalkinName('');
    setWalkinPhone('');
  };

  // Admin: Block slot
  const handleBlockSlot = async () => {
    if (!selectedSlotModal) return;
    setActionLoading(true);
    try {
      await adminService.blockSlot({
        courtId: selectedSlotModal.court._id,
        date: selectedDate,
        startTime: selectedSlotModal.slot.startTime,
        reason: blockReason,
      });
      handleCloseModal();
      fetchCalendar();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to block slot');
    } finally {
      setActionLoading(false);
    }
  };

  // Admin: Unblock slot
  const handleUnblockSlot = async () => {
    if (!selectedSlotModal) return;
    setActionLoading(true);
    try {
      await adminService.unblockSlot({
        courtId: selectedSlotModal.court._id,
        date: selectedDate,
        startTime: selectedSlotModal.slot.startTime,
      });
      handleCloseModal();
      fetchCalendar();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to unblock slot');
    } finally {
      setActionLoading(false);
    }
  };

  // Admin: Create manual walk-in booking
  const handleCreateManualBooking = async (e) => {
    e.preventDefault();
    if (!walkinName.trim() || !walkinPhone.trim()) {
      alert('Please provide name and phone');
      return;
    }

    setActionLoading(true);
    try {
      await bookingService.createBooking({
        courtId: selectedSlotModal.court._id,
        date: selectedDate,
        startTime: selectedSlotModal.slot.startTime,
        customerName: `[Walk-In] ${walkinName}`,
        customerPhone: walkinPhone,
      });
      handleCloseModal();
      fetchCalendar();
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    } finally {
      setActionLoading(false);
    }
  };

  // Admin: Cancel booking
  const handleCancelBooking = async () => {
    if (!selectedSlotModal?.slot?.bookingDbId) return;
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    setActionLoading(true);
    try {
      await bookingService.cancelBooking(selectedSlotModal.slot.bookingDbId, 'Cancelled by Admin');
      handleCloseModal();
      fetchCalendar();
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      {/* Controls Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg-card)',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        marginBottom: '1.5rem',
        gap: '1rem',
      }}>
        <div className="flex items-center gap-3">
          <Calendar size={20} color="var(--primary)" />
          <span style={{ fontWeight: 700, color: '#fff' }}>Select Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
            className="input-control"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', colorScheme: 'dark' }}
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'football', 'padel', 'tennis', 'basketball'].map((sp) => (
            <button
              key={sp}
              onClick={() => setSelectedSport(sp)}
              className={`btn btn-sm ${selectedSport === sp ? 'btn-primary' : 'btn-secondary'}`}
              style={{ textTransform: 'capitalize' }}
            >
              {sp}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading schedule grid...
        </div>
      ) : !gridData?.matrix?.length ? (
        <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          No courts configured for this filter.
        </div>
      ) : (
        <div className="grid-container">
          <table className="matrix-table">
            <thead>
              <tr>
                <th>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    Time Slot
                  </div>
                </th>
                {gridData.matrix.map((c) => (
                  <th key={c.court._id}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#fff' }}>
                      {c.court.name}
                    </div>
                    <span className="badge badge-gray" style={{ fontSize: '0.65rem', marginTop: '3px' }}>
                      {c.court.sportType} • {currencySymbol}{c.court.pricePerHour}/h
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gridData.timeHeaders.map((header) => (
                <tr key={header.startTime}>
                  <td className="time-column">
                    {header.startTime} - {header.endTime}
                  </td>

                  {gridData.matrix.map((c) => {
                    const slot = c.slots.find((s) => s.startTime === header.startTime);
                    if (!slot) return <td key={c.court._id}>-</td>;

                    if (slot.status === 'booked') {
                      return (
                        <td key={c.court._id}>
                          <button
                            onClick={() => handleSlotClick(c.court, slot)}
                            className="slot-badge"
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              color: '#fca5a5',
                              cursor: 'pointer',
                              textAlign: 'center',
                            }}
                          >
                            <span style={{ fontWeight: 700 }}>BOOKED</span>
                            <span style={{ fontSize: '0.7rem', color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                              {slot.customerName || `#${slot.bookingId}`}
                            </span>
                          </button>
                        </td>
                      );
                    }

                    if (slot.status === 'blocked') {
                      return (
                        <td key={c.court._id}>
                          <button
                            onClick={() => handleSlotClick(c.court, slot)}
                            className="slot-badge slot-blocked"
                            style={{ cursor: 'pointer' }}
                          >
                            <span>BLOCKED</span>
                            <span style={{ fontSize: '0.7rem' }}>{slot.reason || 'Maintenance'}</span>
                          </button>
                        </td>
                      );
                    }

                    return (
                      <td key={c.court._id}>
                        <button
                          onClick={() => handleSlotClick(c.court, slot)}
                          className="slot-badge slot-available"
                        >
                          <span>AVAILABLE</span>
                          <span className="slot-price">+ Click to Manage</span>
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Admin Slot Action Modal */}
      {selectedSlotModal && (
        <Modal
          isOpen={!!selectedSlotModal}
          onClose={handleCloseModal}
          title={
            selectedSlotModal.slot.status === 'booked'
              ? 'Booking Details'
              : selectedSlotModal.slot.status === 'blocked'
              ? 'Blocked Slot Operations'
              : 'Manage Open Slot'
          }
        >
          <div style={{
            background: '#090e1a',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.25rem',
            fontSize: '0.875rem',
          }}>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: '1rem', marginBottom: '0.25rem' }}>
              {selectedSlotModal.court.name}
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              Date: <strong>{selectedSlotModal.date}</strong> | Time: <strong>{selectedSlotModal.slot.startTime} - {selectedSlotModal.slot.endTime}</strong>
            </div>
          </div>

          {/* If Booked: show full customer info & cancel option */}
          {selectedSlotModal.slot.status === 'booked' && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Booking ID:</span>
                  <strong style={{ color: 'var(--primary)' }}>#{selectedSlotModal.slot.bookingId}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Customer Name:</span>
                  <strong style={{ color: '#fff' }}>{selectedSlotModal.slot.customerName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Phone Number:</span>
                  <strong style={{ color: '#fff' }}>{selectedSlotModal.slot.customerPhone}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Price:</span>
                  <strong style={{ color: 'var(--primary)' }}>${selectedSlotModal.slot.price}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={handleCancelBooking}
                  disabled={actionLoading}
                  className="btn btn-danger"
                  style={{ flex: 1 }}
                >
                  <XCircle size={16} /> Cancel This Booking
                </button>
                <button onClick={handleCloseModal} className="btn btn-secondary" style={{ flex: 1 }}>
                  Close
                </button>
              </div>
            </div>
          )}

          {/* If Blocked: option to unblock */}
          {selectedSlotModal.slot.status === 'blocked' && (
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Reason: <strong>{selectedSlotModal.slot.reason}</strong>
              </p>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={handleUnblockSlot}
                  disabled={actionLoading}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <CheckCircle size={16} /> Unblock & Make Available
                </button>
                <button onClick={handleCloseModal} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* If Available: Option 1: Walk-In Booking, Option 2: Block Slot */}
          {selectedSlotModal.slot.status === 'available' && (
            <div>
              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>
                1. Create Manual Walk-In Booking
              </h4>
              <form onSubmit={handleCreateManualBooking} style={{ marginBottom: '1.5rem' }}>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                    required
                    className="input-control"
                  />
                </div>
                <div className="input-group">
                  <input
                    type="tel"
                    placeholder="Customer Phone"
                    value={walkinPhone}
                    onChange={(e) => setWalkinPhone(e.target.value)}
                    required
                    className="input-control"
                  />
                </div>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                >
                  <Plus size={16} /> Confirm Walk-In Reservation (${selectedSlotModal.slot.price})
                </button>
              </form>

              <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                2. Or Block Slot for Maintenance / Tournament
              </h4>
              <div className="input-group">
                <input
                  type="text"
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="Reason for block"
                  className="input-control"
                />
              </div>
              <button
                type="button"
                onClick={handleBlockSlot}
                disabled={actionLoading}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%', borderColor: 'var(--border-light)' }}
              >
                <Lock size={15} /> Lock This Slot (Block)
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default AdminGridSchedule;
