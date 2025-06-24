import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/NormalUser/UpdatePassword.css'
import Navbar from '../../Components/Navbar';

function UpdataPasswordStoreOwner() {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const storedEmail = localStorage.getItem('email');
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match.');
            return;
        }

        // Validate password length, uppercase letter, and special character
        if (newPassword.length < 8 || newPassword.length > 16) {
            setError('New password must be between 8 and 16 characters long.');
            return;
        }
        if (!/[A-Z]/.test(newPassword)) {
            setError('New password must include at least one uppercase letter.');
            return;
        }
        if (!/[^A-Za-z0-9]/.test(newPassword)) {
            setError('New password must include at least one special character.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                'https://reviews-app-backend-023o.onrender.com/api/auth/update-password',
                {
                    email,
                    oldPassword,
                    newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessage(response.data.message || 'Password updated successfully.');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Failed to update password.');
            }
        }
    };

    return (
        <>
            <Navbar />
            <div className="update-password-container" style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h2>Update Password</h2>
                <form onSubmit={handleSubmit}>
                    
                    <div style={{ marginBottom: '12px' }}>
                        <label htmlFor="oldPassword">Current Password:</label><br />
                        <input
                            type="password"
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <label htmlFor="newPassword">New Password:</label><br />
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        />
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                        <label htmlFor="confirmPassword">Confirm New Password:</label><br />
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                        />
                    </div>
                    <button type="submit" className="update-password-btn">
                        Update Password
                    </button>
                </form>
                {message && <p style={{ color: 'green', marginTop: '12px' }}>{message}</p>}
                {error && <p style={{ color: 'red', marginTop: '12px' }}>{error}</p>}
            </div>
        </>
    );
}

export default UpdataPasswordStoreOwner;
