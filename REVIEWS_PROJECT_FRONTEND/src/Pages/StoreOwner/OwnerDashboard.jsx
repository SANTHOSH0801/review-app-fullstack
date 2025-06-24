import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../Components/Navbar.jsx';
import '../../css/StoreOwner/OwnerDashboard.css'
import image1 from '../../assets/Images/image (2).jpg'

function OwnerDashboard() {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [storeName, setStoreName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStoreAndRatings = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch store details by owner
        const storeResponse = await axios.get('https://reviews-app-backend-023o.onrender.com/api/stores/owner', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStoreName(storeResponse.data.name);

        // Fetch ratings for the store
        const ratingsResponse = await axios.get('https://reviews-app-backend-023o.onrender.com/api/ratings/store', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRatings(ratingsResponse.data.userRatings);
        setAverageRating(ratingsResponse.data.averageRating);

        setLoading(false);
      } catch {
        setError('Failed to load store or ratings');
        setLoading(false);
      }
    };

    fetchStoreAndRatings();
  }, []);

  if (loading) return <p>Loading store and ratings...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1 className="store-name">{storeName}</h1> {/* Store name first */}
        <div className="store-header">
          <img
            src={image1}
            alt="Store"
            className="store-photo"
          />
        </div>
        <div className="dashboard-top-bar">
          <span className="average-rating">
            Average Rating:{' '}
            {averageRating === null || averageRating === undefined
              ? 'N/A'
              : typeof averageRating === 'string'
                ? averageRating
                : averageRating.toFixed(2)}
          </span>
        </div>

        <h2>Users who submitted ratings:</h2>
        {ratings.length === 0 ? (
          <p>No ratings submitted yet.</p>
        ) : (
          <table className="ratings-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((rating) => (
                <tr key={rating.userId}>
                  <td>{rating.name || 'N/A'}</td>
                  <td>{rating.email || 'N/A'}</td>
                  <td>{rating.address || 'N/A'}</td>
                  <td>{rating.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


    </>
  );
}

export default OwnerDashboard;
