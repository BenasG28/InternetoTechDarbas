import React from 'react';
import { useNavigate } from 'react-router-dom';


function RegisterSection() {
  const navigate = useNavigate();

  const handleRegister = () => {
    // Handle registration logic here
    console.log('Register button clicked');
    // After registration, navigate back to the login page
    navigate('/login');
  };

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5 mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form-control" id="username" />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" />
            </div>
            <div className="mb-3">
              <label htmlFor="cardNumber" className="form-label">Card Number</label>
              <input type="text" className="form-control" id="cardNumber" />
            </div>
            <button className="btn btn-primary me-2" onClick={handleRegister}>Register</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegisterSection;
