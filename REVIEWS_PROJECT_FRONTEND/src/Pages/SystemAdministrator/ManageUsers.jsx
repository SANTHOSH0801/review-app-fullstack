import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../Components/Navbar';
import '../../css/SystemAdministrator/ManageUsers.css'
import { useNavigate } from 'react-router-dom';

function ManageUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fetch all users without filters
        const response = await axios.get('https://reviews-app-backend-023o.onrender.com/api/admin/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
        console.log("RESPONSE DATA: ", response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load users', error);
        setLoading(false);
      }
    };
    fetchUsers();

    // Listen for rating updates and refresh user list
    const handleRatingUpdated = () => {
      fetchUsers();
    };
    window.addEventListener('ratingUpdated', handleRatingUpdated);

    return () => {
      window.removeEventListener('ratingUpdated', handleRatingUpdated);
    };
  }, []);

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  // Filter users by all filters on frontend
  const filteredUsers = users.filter(user => {
    const nameMatch = user.name.toLowerCase().includes(filter.name.toLowerCase());
    const emailMatch = user.email.toLowerCase().includes(filter.email.toLowerCase());
    const addressMatch = user.address.toLowerCase().includes(filter.address.toLowerCase());
    const roleMatch = user.role.toLowerCase().includes(filter.role.toLowerCase());
    return nameMatch && emailMatch && addressMatch && roleMatch;
  });

  function handleNewUser(){
    navigate('/admin/ManageUsers/AddUser')
  }

  return (
    <>
      <Navbar />
      <div className="manage-users-container">
        <h1 className="manage-users-title">Manage Users</h1>
        <div className="manage-users-filters">
          <input
            type="text"
            name="name"
            placeholder="Filter by Name"
            value={filter.name}
            onChange={handleFilterChange}
            className="manage-users-input"
          />
          <input
            type="text"
            name="email"
            placeholder="Filter by Email"
            value={filter.email}
            onChange={handleFilterChange}
            className="manage-users-input"
          />
          <input
            type="text"
            name="address"
            placeholder="Filter by Address"
            value={filter.address}
            onChange={handleFilterChange}
            className="manage-users-input"
          />
          <input
            type="text"
            name="role"
            placeholder="Filter by Role"
            value={filter.role}
            onChange={handleFilterChange}
            className="manage-users-input"
          />
        </div>

        <table className="manage-users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5">No users found</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.address}</td>
                  <td>{user.role || 'N/A'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="add-users-wrapper">
        <div className="add-users-container" onClick={handleNewUser}>
          Add New User
        </div>
      </div>
    </>
  );

}

export default ManageUsers;
