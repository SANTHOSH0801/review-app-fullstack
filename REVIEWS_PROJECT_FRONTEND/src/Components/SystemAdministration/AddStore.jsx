/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import './AddStore.css';
import Navbar from '../Navbar.jsx';

function AddStore() {
    const [stores, setStores] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newStore, setNewStore] = useState({
        ownerName: '',
        storeName: '',
        email: '',
        address: '',
        password: '',
    });

    const handleInputChange = (e) => {
        setNewStore({
            ...newStore,
            [e.target.name]: e.target.value,
        });
        setError('');
        setSuccess('');
    };

    const validateInputs = () => {
        if (newStore.ownerName.length < 6 || newStore.ownerName.length > 60) {
            setError('Owner name must be between 3 and 60 characters');
            return false;
        }
        if (newStore.storeName.length < 20 || newStore.storeName.length > 60) {
            setError('Store name must be between 3 and 60 characters');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(newStore.email)) {
            setError('Invalid email address');
            return false;
        }
        if (newStore.address.length > 400) {
            setError('Address must be at most 400 characters');
            return false;
        }
        if (newStore.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleAddStore = async () => {
        if (!validateInputs()) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post('https://reviews-app-backend-023o.onrender.com/api/stores', newStore, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const response = await axios.get('https://reviews-app-backend-023o.onrender.com/api/stores', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setStores(response.data);
            setNewStore({ ownerName: '', storeName: '', email: '', address: '', password: '' });
            setSuccess('Store added successfully');
            setError('');
        } catch (error) {
            console.log('Add store error response:', error.response);
            if (error.response && error.response.data) {
                if (typeof error.response.data === 'string') {
                    setError(error.response.data);
                } else if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
                    setError(error.response.data.errors.map(e => e.msg).join(', '));
                } else if (error.response.data.message) {
                    setError(error.response.data.message);
                } else {
                    setError('Failed to add store');
                }
            } else {
                setError('Failed to add store');
            }
            setSuccess('');
        }
    };

    return (
        <>
            <Navbar />
            <h1 className='description'>Enter the store details</h1>
            <h3 className="warning">Enter the Owner details first in the Manage Users section</h3>
            <div className="manage-stores-container2">
                <label className="manage-stores-label">
                    Owner Name:
                    <input
                        type="text"
                        name="ownerName"
                        value={newStore.ownerName}
                        onChange={handleInputChange}
                        className="manage-stores-input"
                    />
                </label>

                <label className="manage-stores-label">
                    Store Name:
                    <input
                        type="text"
                        name="storeName"
                        value={newStore.storeName}
                        onChange={handleInputChange}
                        className="manage-stores-input"
                    />
                </label>

                <label className="manage-stores-label">
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={newStore.email}
                        onChange={handleInputChange}
                        className="manage-stores-input"
                    />
                </label>

                <label className="manage-stores-label">
                    Address:
                    <input
                        type="text"
                        name="address"
                        value={newStore.address}
                        onChange={handleInputChange}
                        className="manage-stores-input"
                    />
                </label>

                <label className="manage-stores-label">
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={newStore.password}
                        onChange={handleInputChange}
                        className="manage-stores-input"
                    />
                </label>

                {error && (
                    <p className="error-message" style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '20px',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '10px',
                        borderRadius: '4px',
                        zIndex: 1000
                    }}>
                        {error}
                    </p>
                )}

                <button onClick={handleAddStore} className="manage-stores-button">Add Store</button>
                {success && <p className="success-message">{success}</p>}
            </div>
        </>
    );
}

export default AddStore;
