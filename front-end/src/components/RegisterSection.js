import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function RegisterSection() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cardNumber, setCardNumber] = useState("");


  const handleRegister = async () => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          cardNumber
        }),
      });
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      console.log('Registration successful');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
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
              value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <div className="mb-3">
              <label htmlFor="cardNumber" className="form-label">Card Number</label>
              <input type="text" className="form-control" id="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)}/>
            </div>
            <button className="btn btn-primary me-2" onClick={handleRegister}>Register</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegisterSection;
