import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../Components/Navbar';
import '../../css/SystemAdministrator/AdminDashboard.css'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        // Use consolidated admin dashboard stats endpoint
        const response = await axios.get('https://reviews-app-backend-023o.onrender.com/api/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats({
          totalUsers: response.data.totalUsers,
          totalStores: response.data.totalStores,
          totalRatings: response.data.totalRatings,
        });
        setLoading(false);
      } catch (error) {
        setError('Failed to load statistics', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading statistics...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="admin-dashboard-container">
        <h1>System Administrator Dashboard</h1>
        <p>Total number of users: {stats.totalUsers}</p>
        <p>Total number of stores: {stats.totalStores}</p>
        <p>Total number of submitted ratings: {stats.totalRatings}</p>
      </div>

    </>
  );
}

export default AdminDashboard;
