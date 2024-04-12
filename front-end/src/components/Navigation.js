import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

function Navigation({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    fetchCartItemCount();
  }, []); // Fetch cart item count when component mounts

  const fetchCartItemCount = () => {
    fetch('/api/cart/items/count')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch cart item count');
        }
        return response.json();
      })
      .then(data => {
        setCartItemCount(data.count);
      })
      .catch(error => {
        console.error('Error fetching cart item count:', error);
      });
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/home');
  };

  const handleAboutClick = () => {
    navigate('/about');
  };
  const handleLogout = () => {
    fetch('/api/logout', {
      method: 'POST',
    })
    .then(response => {
      if (!response.ok) {
        // Logout failed, handle error
        return response.json().then(data => {
          console.error('Logout failed:', data.message);
          // You can show an error message to the user here
        });
      }
  
      // Logout successful
      console.log('Logout Successful');
      onLogout(); // Update the isLoggedIn state in App.js
      navigate('/home');
    })
    .catch(error => {
      console.error('Error logging out:', error.message);
      // Handle network or other errors here
    });
  };

  const handleProfileClick = () => {
    // Navigate to the profile page
    // navigate('/profile');
    navigate('/profile');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container px-4 px-lg-5">
        <a className="navbar-brand" href="#!" onClick={handleHomeClick}>GKL Shop</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
            <li className="nav-item"><a className="nav-link active" aria-current="page" href="#!" onClick={handleHomeClick}>Home</a></li>
            <li className="nav-item"><a className="nav-link" href="#!" onClick={handleAboutClick}>About</a></li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Shop</a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><span className="dropdown-item disabled">All Products (Not Available)</span></li>
                <li><span className="dropdown-item disabled">Popular Items (Not Available)</span></li>
                <li><span className="dropdown-item disabled">New Arrivals (Not Available)</span></li>
              </ul>
            </li>
          </ul>
            <button className="btn btn-outline-dark" type="submit">
              <i className="bi-cart-fill me-1"></i>
              Cart
              <span className="badge bg-dark text-white ms-1 rounded-pill">{cartItemCount}</span>
            </button>
            {isLoggedIn ? (
              <>
                <button className="btn btn-outline-dark mx-2" onClick={handleProfileClick}>
                  Profile
                </button>
                <button className="btn btn-outline-dark" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <button className="btn btn-outline-dark mx-2" onClick={handleLoginClick}>
                <i className="bi bi-person-fill me-1"></i>
                Login
              </button>
            )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
