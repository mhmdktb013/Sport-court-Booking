import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/admin/AdminLayout';
import AdminOverview from '../components/admin/AdminOverview';
import AdminGridSchedule from '../components/admin/AdminGridSchedule';
import AdminCourtsManager from '../components/admin/AdminCourtsManager';
import AdminBookingsManager from '../components/admin/AdminBookingsManager';
import AdminVenueSettings from '../components/admin/AdminVenueSettings';

const AdminDashboardPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div style={{ padding: '5rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Verifying authorization...
      </div>
    );
  }

  // Redirect to login if not logged in or not admin
  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'overview' && <AdminOverview onNavigateTab={setActiveTab} />}
      {activeTab === 'calendar' && <AdminGridSchedule />}
      {activeTab === 'courts' && <AdminCourtsManager />}
      {activeTab === 'bookings' && <AdminBookingsManager />}
      {activeTab === 'settings' && <AdminVenueSettings />}
    </AdminLayout>
  );
};

export default AdminDashboardPage;
