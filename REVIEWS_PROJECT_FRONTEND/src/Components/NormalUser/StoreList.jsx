import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './StoreList.css';
import image1 from '../../assets/Images/image (1).jpg';
import image2 from '../../assets/Images/image (2).jpg';
import image3 from '../../assets/Images/image (3).jpg';
import image4 from '../../assets/Images/image (4).jpg';
import image5 from '../../assets/Images/image (5).jpg';
import image6 from '../../assets/Images/image (6).jpg';
import image7 from '../../assets/Images/image (7).jpg';
import image8 from '../../assets/Images/image (8).jpg';

function StoreList() {
  const images = [image1, image2, image3, image4, image5, image6, image7, image8];
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://reviews-app-backend-023o.onrender.com/api/stores', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStores(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load stores', error);
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/ListStorePage/${id}`);
  };

  const filteredStores = stores.filter((store) => {
    const name = store.name?.toLowerCase() || '';
    const address = store.address?.toLowerCase() || '';
    return (
      name.includes(searchName.toLowerCase()) &&
      address.includes(searchAddress.toLowerCase())
    );
  });


  if (loading) return <p>Loading stores...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="store-search-container">
        <input
          type="text"
          placeholder="Search by store name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="store-search-input"
        />
        <input
          type="text"
          placeholder="Search by address"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          className="store-search-input"
        />
      </div>

      <div className="store-list-container">
        {filteredStores.map((store, index) => (
          <div
            key={store.id}
            className="store-card"
            onClick={() => handleCardClick(store.id)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleCardClick(store.id);
            }}
          >
            <img
              src={images[index % images.length]}
              alt={store.name}
              className="store-image"
            />

            <div className="card-info">
              <h4>{store.name}</h4>
              <p>{store.address || 'Unknown Location'}</p>
              <p>⭐ {store.averageRating || '3.5'}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default StoreList;
