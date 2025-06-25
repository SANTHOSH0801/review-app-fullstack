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

  // Sorting state
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

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

  // Filter users by all filters on frontend
  const filteredUsers = users.filter(user => {
    const nameMatch = user.name.toLowerCase().includes(filter.name.toLowerCase());
    const emailMatch = user.email.toLowerCase().includes(filter.email.toLowerCase());
    const addressMatch = user.address.toLowerCase().includes(filter.address.toLowerCase());
    const roleMatch = user.role.toLowerCase().includes(filter.role.toLowerCase());
    return nameMatch && emailMatch && addressMatch && roleMatch;
  });

  // Sorting function
  const sortedUsers = React.useMemo(() => {
    if (!sortField) return filteredUsers;
    const sorted = [...filteredUsers].sort((a, b) => {
      let aField = a[sortField];
      let bField = b[sortField];
      if (aField === null || aField === undefined) aField = '';
      if (bField === null || bField === undefined) bField = '';
      if (typeof aField === 'string') aField = aField.toLowerCase();
      if (typeof bField === 'string') bField = bField.toLowerCase();

      if (aField < bField) return sortOrder === 'asc' ? -1 : 1;
      if (aField > bField) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredUsers, sortField, sortOrder]);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>{error}</p>;

  // Handle sorting toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? ' ▲' : ' ▼';
  };

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
        <h3 className='description-text'>Click on the headings to get sorted</h3>
        <table className="manage-users-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} style={{cursor: 'pointer'}}>Name{renderSortIndicator('name')}</th>
              <th onClick={() => handleSort('email')} style={{cursor: 'pointer'}}>Email{renderSortIndicator('email')}</th>
              <th onClick={() => handleSort('address')} style={{cursor: 'pointer'}}>Address{renderSortIndicator('address')}</th>
              <th onClick={() => handleSort('role')} style={{cursor: 'pointer'}}>Role{renderSortIndicator('role')}</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.length === 0 ? (
              <tr>
                <td colSpan="5">No users found</td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
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
