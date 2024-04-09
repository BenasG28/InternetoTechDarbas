import React from 'react';
import { useNavigate } from 'react-router-dom';

function LoginSection() {
    const navigate = useNavigate();

  const handleLogin = () => {
    // Handle login logic here
    console.log('Login button clicked');
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
              <input type="text" className="form-control" id="username" />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" />
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
