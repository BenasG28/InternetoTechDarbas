import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function LoginSection({onLogin}) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(data => {
          console.error('Login failed:', data.message);
        });
      }
  
      console.log('Login Successful');
      onLogin();
      navigate('/home');
    })
    .catch(error => {
      console.error('Error logging in:', error.message);
    });
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
