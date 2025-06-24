import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../../Components/Navbar';
import '../../css/SystemAdministrator/ManageStores.css'
import { useNavigate } from 'react-router-dom';

function ManageStores() {
    const [allStores, setAllStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        name: '',
        email: '',
        address: '',
    });

    const navigate = useNavigate();

    function handleAddStore() {
        navigate('/admin/ManageStores/AddStore');
    }

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://reviews-app-backend-023o.onrender.com/api/stores', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAllStores(response.data);
                // console.log("Response data:", response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load stores', error);
                setLoading(false);
            }
        };

        fetchStores();

        // Listen for rating updates and refresh store list
        const handleRatingUpdated = () => {
            fetchStores();
        };
        window.addEventListener('ratingUpdated', handleRatingUpdated);

        return () => {
            window.removeEventListener('ratingUpdated', handleRatingUpdated);
        };
    }, []);


    if (loading) return <p>Loading stores...</p>;
    if (error) return <p>{error}</p>;

    // Apply filters on allStores
    const filteredStores = allStores.filter((store) => {
        return (
            store.name.toLowerCase().includes(filters.name.toLowerCase()) &&
            store.email.toLowerCase().includes(filters.email.toLowerCase()) &&
            store.address.toLowerCase().includes(filters.address.toLowerCase())
        );
    });

    return (
        <>
            <Navbar />
            <div className="manage-stores-container">
                <h1 className="manage-stores-title">Manage Stores</h1>
                <div className="manage-stores-filters">
                    <input 
                        type="text"
                        placeholder="Filter by Name"
                        value={filters.name}
                        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                        className="manage-stores-input"
                    />
                    <input
                        type="text"
                        placeholder="Filter by Email"
                        value={filters.email}
                        onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                        className="manage-stores-input"
                    />
                    <input
                        type="text"
                        placeholder="Filter by Address"
                        value={filters.address}
                        onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                        className="manage-stores-input"
                    />
                </div>
                <table className="manage-stores-table">
                    <thead>
                        <tr className="manage-stores-row">
                            <th className="manage-stores-header-cell">Name</th>
                            <th className="manage-stores-header-cell">Email</th>
                            <th className="manage-stores-header-cell">Address</th>
                            <th className="manage-stores-header-cell">Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStores.length === 0 ? (
                            <tr className="manage-stores-row">
                                <td className="manage-stores-cell" colSpan="4">Stores: 0</td>
                            </tr>
                        ) : (
                            filteredStores.map((store) => (
                                <tr key={store.id} className="manage-stores-row">
                                    <td className="manage-stores-cell">{store.name}</td>
                                    <td className="manage-stores-cell">{store.email}</td>
                                    <td className="manage-stores-cell">{store.address}</td>
                                    <td className="manage-stores-cell">{store.averageRating || '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="add-store-wrapper">
                <div className="add-store-container" onClick={handleAddStore}>
                    Add New Store
                </div>
            </div>
        </>
    );
}

export default ManageStores;
