// ProductCard.js
import React from 'react';
import { BsStarFill } from 'react-icons/bs'; // Import Bootstrap icons

const ProductCard = ({ imageSrc, productName, price, onSale, starReviews }) => {
  return (
    <div className="card h-100">
      {onSale && <div className="badge bg-dark text-white position-absolute" style={{ top: '0.5rem', right: '0.5rem' }}>Sale</div>}
      <img className="card-img-top" src={imageSrc} alt="Product" />
      <div className="card-body p-4">
        <div className="text-center">
          <h5 className="fw-bolder">{productName}</h5>
          {price}
          {/* Render star reviews if available */}
          {starReviews && (
            <div className="d-flex justify-content-center small text-warning mb-2">
              {[...Array(starReviews)].map((_, index) => (
                <BsStarFill key={index} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
        <div className="text-center"><a className="btn btn-outline-dark mt-auto" href="#">Add to cart</a></div>
      </div>
    </div>
  );
};

export default ProductCard;
