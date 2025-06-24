import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../../css/NormalUser/StoreFullPage.css';
import Navbar from '../../Components/Navbar';
import image1 from '../../assets/Images/image (1).jpg'


function StoreFullPage() {
    const { id } = useParams();
    const [store, setStore] = useState(null);
    const [userRating, setUserRating] = useState(null);
    const [newRating, setNewRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitMessage, setSubmitMessage] = useState('');

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const token = localStorage.getItem('token');
                const [storeRes, userRatingRes] = await Promise.all([
                    axios.get(`https://reviews-app-backend-023o.onrender.com/api/stores/${id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`https://reviews-app-backend-023o.onrender.com/api/stores/${id}/user-rating`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                setStore(storeRes.data);
                setUserRating(userRatingRes.data.rating);
                setNewRating(userRatingRes.data.rating || 0);
                setLoading(false);
            } catch {
                setError('Failed to load store data');
                setLoading(false);
            }
        };

        fetchStoreData();
    }, [id]);

    const handleRatingChange = (e) => {
        setNewRating(parseInt(e.target.value, 10));
        setSubmitMessage('');
    };

    const handleSubmitRating = async () => {
        if (newRating < 1 || newRating > 5) {
            setSubmitMessage('Rating must be between 1 and 5');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `https://reviews-app-backend-023o.onrender.com/api/stores/${id}/rate`,
                { rating: newRating },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUserRating(newRating);
            setSubmitMessage('Rating submitted successfully');
            // Dispatch custom event to notify rating update
            window.dispatchEvent(new CustomEvent('ratingUpdated', { detail: { storeId: id, rating: newRating } }));
        } catch {
            setSubmitMessage('Failed to submit rating');
        }
    };

    if (loading) return <p>Loading store details...</p>;
    if (error) return <p>{error}</p>;
    if (!store) return <p>Store not found</p>;

    return (
        <>
            <Navbar />
            <div className="store-fullpage-container2">
                <div className="store-image-container2">
                    <img
                        src= {image1}
                        alt="Store"
                        className="store-image2"
                    />
                </div>
                <h1>{store.name}</h1>
                <p><strong>Address:</strong> {store.address}</p>
                <p><strong>Overall Rating:</strong> {store.averageRating || 'No ratings yet'}</p>
                <p><strong>Your Rating:</strong> {userRating || 'Not rated yet'}</p>

                <div className="rating-section">
                    <label htmlFor="rating">Submit or modify your rating (1-5): </label>
                    <select id="rating" value={newRating} onChange={handleRatingChange}>
                        <option value={0}>Select rating</option>
                        {[1, 2, 3, 4, 5].map((val) => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                    <button onClick={handleSubmitRating}>Submit Rating</button>
                </div>
                {submitMessage && <p className="submit-message">{submitMessage}</p>}
            </div>
        </>
    );
}

export default StoreFullPage;
