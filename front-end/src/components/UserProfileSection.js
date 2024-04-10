import React, { useState, useEffect } from 'react';

const UserProfileSection = () => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    cardNumber: ""
  });

  useEffect(() => {
    fetch("/api/profile", {
      method: "GET",
    })
    .then((res) => {
      console.log("Response status:", res.status);
      return res.json();
    })
    .then((data) => {
      console.log("Fetched user data:", data);
      setUserData(data);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      // Handle error
    });
  }, []);

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
                disabled // Disable editing of username
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
