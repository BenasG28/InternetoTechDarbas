import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navigation() {
  const navigate = useNavigate();

  const handleLoginClick =() =>{
    navigate('/login');
  };
  const handleHomeClick =() =>{
    navigate('/home')
  };
  const handleAboutClick =()=>{
    navigate('/about')
  };
  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container px-4 px-lg-5">
        <a className="navbar-brand" href="#!">GKL Shop</a>
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
              <li><hr className="dropdown-divider" /></li>
                <li><span className="dropdown-item disabled">Popular Items (Not Available)</span></li>
                <li><span className="dropdown-item disabled">New Arrivals (Not Available)</span></li>
              </ul>
            </li>
          </ul>
          <form className="d-flex">
            <button className="btn btn-outline-dark me-2" onClick={handleLoginClick}>
              <i className="bi bi-person-fill me-1"></i>
              Login
            </button>
            <button className="btn btn-outline-dark" type="submit">
              <i className="bi-cart-fill me-1"></i>
              Cart
              <span className="badge bg-dark text-white ms-1 rounded-pill">0</span>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
