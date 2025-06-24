
import React, { useState } from 'react'
import axios from 'axios';
import './AddStore.css'
import Navbar from '../Navbar.jsx';

function AddUser() {
    const [User, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        address: '',
        role: 'Normal User',
        password: '',
    });

    const handleInputChange = (e) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value,
        });
        setError('');
        setSuccess('');
    };

    const validateInputs = () => {
        if (newUser.name.length < 8 || newUser.name.length > 60) {
            setError('Name must be between 8 and 60 characters');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(newUser.email)) {
            setError('Invalid email address');
            return false;
        }
        if (newUser.address.length > 400) {
            setError('Address must be at most 400 characters');
            return false;
        }
        const password = newUser.password;
        if (password.length < 8 || password.length > 16) {
            setError('Password must be between 8 and 16 characters');
            return false;
        }
        if (!/[A-Z]/.test(password)) {
            setError('Password must contain at least one uppercase letter');
            return false;
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            setError('Password must contain at least one special character');
            return false;
        }
        return true;
    };

    const handleAddStore = async () => {
        if (!validateInputs()) return;
        console.log("new user:",newUser);

        try {
            const token = localStorage.getItem('token');
            await axios.post('https://reviews-app-backend-023o.onrender.com/api/users', newUser, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // Refresh store list
            try {
                const response = await axios.get('https://reviews-app-backend-023o.onrender.com/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (getError) {
                console.error('Get users error:', getError.response ? getError.response.data : getError.message);
            }
            setNewUser({ name: '', email: '', address: '', role: 'Normal User', password: '' });
            setSuccess('user added successfully');
            setError('');
        } catch (error) {
            console.error('Add user error response:', error.response ? error.response.data : error.message);
            if (error.response && error.response.data) {
                if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
                    setError(error.response.data.errors.map(e => e.msg).join(', '));
                } else if (error.response.data.message) {
                    setError(`Failed to add user: ${error.response.data.message}`);
                } else {
                    setError('Failed to add user');
                }
            } else {
                setError('Failed to add user');
            }
            setSuccess('');
        }
    };



    return (
        <>
            <Navbar />
            <h1 className='description'>Enter the User details</h1>
            <div className="manage-stores-container2">
                <label className="manage-stores-label">
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={newUser.name}
                        onChange={handleInputChange}
                        className="manage-stores-input"
                    />
                    {error && error.includes('Name') && (
                        <p className="error-message">{error}</p>
                    )}
                </label>
                <label className="manage-stores-label">
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        className="manage-stores-input"
                    />
                    {error && error.includes('email') && (
                        <p className="error-message">{error}</p>
                    )}
                </label>
                <label className="manage-stores-label">
                    Address:
                    <input
                        type="text"
                        name="address"
                        value={newUser.address}
                        onChange={handleInputChange}
                        className="manage-stores-input"
                    />
                    {error && error.includes('Address') && (
                        <p className="error-message">{error}</p>
                    )}
                </label>
                <label className="manage-stores-label">
                    Password:
                    <input
                        type="text"
                        name="password"
                        value={newUser.password}
                        onChange={handleInputChange}
                        className="manage-stores-input"
                    />
                    {error && error.includes('Password') && (
                        <p className="error-message">{error}</p>
                    )}
                </label>
                <div>
                    <label htmlFor="role">Role</label>
                    <select
                        name="role"
                        value={newUser.role}
                        onChange={handleInputChange}
                        className="manage-stores-input"
                        required
                    >
                        <option value="Normal User">Normal User</option>
                        <option value="System Administrator">System Administrator</option>
                    </select>
                </div>
                <button onClick={handleAddStore} className="manage-stores-button">Add User</button>
                {success && <p className="success-message">{success}</p>}
                {error && !['Name', 'email', 'Address', 'Password'].some(field => error.includes(field)) && (
                    <p className="error-message">{error}</p>
                )}
            </div>
        </>
    )
}

export default AddUser
