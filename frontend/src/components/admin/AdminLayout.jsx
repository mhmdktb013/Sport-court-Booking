import React from 'react';
import { LayoutDashboard, Calendar, Trophy, BookOpen, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminLayout = ({ activeTab, setActiveTab, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'overview', label: 'Overview & Metrics', icon: <LayoutDashboard size={18} /> },
    { id: 'calendar', label: 'Admin Live Grid', icon: <Calendar size={18} /> },
    { id: 'courts', label: 'Manage Courts', icon: <Trophy size={18} /> },
    { id: 'bookings', label: 'All Bookings & Search', icon: <BookOpen size={18} /> },
    { id: 'settings', label: 'Venue Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div style={{ minHeight: '80vh', padding: '2rem 0' }}>
      <div className="container">
        {/* Admin Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--border-color)',
          gap: '1rem',
        }}>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-purple">Facility Admin Portal</span>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Logged in as <strong>{user?.name || 'Administrator'}</strong>
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
              Arena Operations & Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.5rem',
        }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  padding: '0.6rem 1.25rem',
                  fontSize: '0.875rem',
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Admin Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
