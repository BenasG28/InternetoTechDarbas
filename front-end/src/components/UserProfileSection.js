import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfileSection = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    cardNumber: ""
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = () => {
    fetch('/api/profile', {
      method: 'GET',
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Failed to fetch user profile');
        }
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error('Failed to fetch user profile:', error);
        navigate('/login');
      });
  };

  const handleUpdate = () => {
    fetch("/api/update-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    })
    .then(response => {
      if (response.ok) {
        // Handle successful update
        console.log("Profile updated successfully");
      } else {
        // Handle error response
        console.error("Failed to update profile");
      }
    })
    .catch(error => {
      console.error("Error updating profile:", error);
    });
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5 mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={userData.username}
                disabled 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={userData.password}
                disabled
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cardNumber" className="form-label">Card Number</label>
              <input
                type="text"
                className="form-control"
                id="cardNumber"
                name="cardNumber"
                value={userData.cardNumber}
                onChange={handleChange}
              />
            </div>
            <button className="btn btn-primary me-2" onClick={handleUpdate}>Update</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfileSection;
