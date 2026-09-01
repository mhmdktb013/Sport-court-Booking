import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { useVenue } from '../../context/VenueContext';
import { DollarSign, Calendar, Trophy, Users, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const AdminOverview = ({ onNavigateTab }) => {
  const { venue } = useVenue();
  const currencySymbol = venue?.currencySymbol || '$';
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await adminService.getMetrics();
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Error fetching admin metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)', padding: '2rem 0' }}>Loading dashboard metrics...</div>;
  }

  const { metrics, recentBookings } = data || {
    metrics: { totalCourts: 0, activeCourts: 0, totalBookings: 0, todayBookingsCount: 0, todayRevenue: 0, totalRevenue: 0 },
    recentBookings: [],
  };

  const statCards = [
    {
      label: "Today's Revenue",
      value: `${currencySymbol}${metrics.todayRevenue}`,
      icon: <DollarSign size={22} color="#10b981" />,
      sub: `${metrics.todayBookingsCount} matches today`,
    },
    {
      label: "Total Gross Revenue",
      value: `${currencySymbol}${metrics.totalRevenue}`,
      icon: <DollarSign size={22} color="#3b82f6" />,
      sub: 'All-time confirmed matches',
    },
    {
      label: "Total Bookings",
      value: metrics.totalBookings,
      icon: <Calendar size={22} color="#f97316" />,
      sub: 'System-wide reservations',
    },
    {
      label: "Active Sports Courts",
      value: `${metrics.activeCourts} / ${metrics.totalCourts}`,
      icon: <Trophy size={22} color="#a855f7" />,
      sub: 'Available for live booking',
    },
  ];

  return (
    <div>
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm-grid-cols-2 lg-grid-cols-4 gap-6" style={{ marginBottom: '2.5rem' }}>
        {statCards.map((stat, idx) => (
          <div key={idx} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {stat.label}
              </span>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', marginBottom: '0.25rem' }}>
              {stat.value}
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              {stat.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Bookings */}
      <div className="grid grid-cols-1 lg-grid-cols-3 gap-6">
        {/* Recent Bookings List */}
        <div className="card" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
              Recent Match Reservations
            </h3>
            <button
              onClick={() => onNavigateTab('bookings')}
              className="btn btn-outline btn-sm"
            >
              View All Bookings <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>ID</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Court</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Date & Time</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Price</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--primary)' }}>
                      #{b.bookingId}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{b.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{b.customerPhone}</div>
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>
                      {b.courtName}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>
                      {b.date} • {b.startTime}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#fff' }}>
                      {currencySymbol}{b.price}
                    </td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span className={`badge ${b.status === 'confirmed' ? 'badge-green' : b.status === 'cancelled' ? 'badge-red' : 'badge-blue'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Operations Panel */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
            Quick Facility Actions
          </h3>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Directly manipulate live court state, manage maintenance locks, or inspect the day schedule.
          </p>

          <button
            onClick={() => onNavigateTab('calendar')}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            <Calendar size={16} /> Open Interactive Day Grid
          </button>

          <button
            onClick={() => onNavigateTab('courts')}
            className="btn btn-secondary"
            style={{ width: '100%' }}
          >
            <Trophy size={16} /> Add / Edit Sports Courts
          </button>

          <button
            onClick={() => onNavigateTab('bookings')}
            className="btn btn-outline"
            style={{ width: '100%' }}
          >
            <Users size={16} /> Search Booking by Phone
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
