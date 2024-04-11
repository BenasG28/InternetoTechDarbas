import React from 'react';

function Header() {
  return (
    <header className="bg-dark py-1">
      <div className="container px-4 px-lg-5 my-2">
        <div className="text-center text-white">
          <h1 className="display-4 fw-bolder">The GKL Shop</h1>
          <p className="lead fw-normal text-white-50 mb-0">So many games it puts italian restaurants meniu's to shame</p>
        </div>
      </div>
    </header>
  );
}

export default Header;