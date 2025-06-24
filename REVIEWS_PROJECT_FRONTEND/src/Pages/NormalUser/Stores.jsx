import React from 'react';
import Navbar from '../../Components/Navbar.jsx'
import StoreList from '../../Components/NormalUser/StoreList.jsx';

function Stores() {
  return (
    <>
      <Navbar />
      <div className="results-section-wrapper">
          <StoreList />
        </div>
    </>
  );
}

export default Stores;
