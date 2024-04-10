import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function LoginSection() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        // Login successful, redirect to another page
        console.log('Login Successful');
        navigate('/home');
      } else {
        // Login failed, handle error
        const data = await response.json();
        console.error('Login failed:', data.message);
        // You can show an error message to the user here
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
      // Handle network or other errors here
    }
  };
  const handleRegister = () => {
    navigate('/register')
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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="mb-3">If you are not registered, <span className="text-primary" onClick={handleRegister} style={{ cursor: 'pointer' }}>click here</span> to register.</p>

            <button className="btn btn-primary" onClick={handleLogin}>Login</button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginSection;
