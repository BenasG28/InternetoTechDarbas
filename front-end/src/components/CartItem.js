import React from 'react';

const CartItem = ({ name, price, description, image, stars, onsale, quantity }) => {
  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-md-4">
          <img src={image} className="img-fluid rounded-start" alt="Product" />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{name}</h5>
            <p className="card-text">Price: €{price}</p>
            <p className="card-text">Quantity: {quantity}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
