import React, { useState, useEffect } from 'react';
import { adminService, bookingService } from '../../services/api';
import { Search, Phone, Calendar, Filter, XCircle, CheckCircle, RefreshCw } from 'lucide-react';

const AdminBookingsManager = () => {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await adminService.getBookings({
        search: searchTerm,
        sport: selectedSport,
        status: selectedStatus,
        date: selectedDate,
      });
      if (res.data.success) {
        setBookings(res.data.bookings);
        setTotal(res.data.total);
      }
    } catch (err) {
      console.error('Failed to fetch admin bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedSport, selectedStatus, selectedDate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await adminService.updateBookingStatus(id, newStatus);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleCancelBooking = async (id) => {
    const reason = prompt('Please enter cancellation reason:', 'Customer requested cancellation');
    if (reason === null) return;

    try {
      await bookingService.cancelBooking(id, reason);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return 'badge-green';
      case 'completed': return 'badge-blue';
      case 'cancelled': return 'badge-red';
      case 'no-show': return 'badge-orange';
      default: return 'badge-gray';
    }
  };

  return (
    <div>
      {/* Search & Filter Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ flex: '1 1 240px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by customer name, phone, booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-control"
              style={{ width: '100%', paddingLeft: '2.5rem' }}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Sport Filter */}
          <select
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
            className="input-control"
            style={{ width: 'auto' }}
          >
            <option value="all">All Sports</option>
            <option value="football">Football</option>
            <option value="padel">Padel</option>
            <option value="tennis">Tennis</option>
            <option value="basketball">Basketball</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-control"
            style={{ width: 'auto' }}
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No-Show</option>
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input-control"
            style={{ width: 'auto', colorScheme: 'dark' }}
          />

          <button type="submit" className="btn btn-primary btn-sm">
            <Search size={16} /> Search
          </button>

          {(searchTerm || selectedDate || selectedSport !== 'all' || selectedStatus !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedSport('all');
                setSelectedStatus('all');
                setSelectedDate('');
              }}
              className="btn btn-secondary btn-sm"
            >
              Reset
            </button>
          )}
        </form>
      </div>

      {/* Bookings Table */}
      <div className="card" style={{ padding: '1rem', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
            Bookings Record ({total})
          </h3>
          <button onClick={fetchBookings} className="btn btn-secondary btn-sm">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading booking records...
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            No bookings found matching criteria.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', background: '#090e1a' }}>
                <th style={{ padding: '0.75rem' }}>Booking Code</th>
                <th style={{ padding: '0.75rem' }}>Customer Details</th>
                <th style={{ padding: '0.75rem' }}>Court & Sport</th>
                <th style={{ padding: '0.75rem' }}>Match Schedule</th>
                <th style={{ padding: '0.75rem' }}>Price</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)' }}>
                    #{b.bookingId}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{b.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.customerPhone}</div>
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ color: '#fff' }}>{b.courtName}</div>
                    <span className="badge badge-gray" style={{ fontSize: '0.65rem' }}>{b.sportType}</span>
                  </td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                    <div>{b.date}</div>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{b.startTime} - {b.endTime}</div>
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                    ${b.price}
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`badge ${getStatusBadge(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      {b.status === 'confirmed' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(b._id, 'completed')}
                            className="btn btn-secondary btn-sm"
                            title="Mark as Completed"
                          >
                            <CheckCircle size={14} color="#34d399" />
                          </button>
                          <button
                            onClick={() => handleCancelBooking(b._id)}
                            className="btn btn-secondary btn-sm"
                            title="Cancel Booking"
                          >
                            <XCircle size={14} color="#f87171" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminBookingsManager;
