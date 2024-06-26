import React from 'react';
import { BsStarFill } from 'react-icons/bs'; // Import Bootstrap icons



const ProductCard = ({ imageSrc, productName, price, onSale, starReviews, onClick, onAddToCart }) => {
  const handleAddToCartClick = (event) =>{
    event.stopPropagation(); 
    onAddToCart();
  };

  return (
    <div onClick={onClick}>
    <div className="card h-100">
      {onSale && <div className="badge bg-dark text-white position-absolute" style={{ top: '0.5rem', right: '0.5rem' }}>Sale</div>}
      <img className="card-img-top" src={imageSrc} alt="Product" />
      <div className="card-body p-4">
        <div className="text-center">
          <h5 className="fw-bolder">{productName}</h5>
          €{price}
          {starReviews && (
            <div className="d-flex justify-content-center small text-warning mb-2">
           {[...Array(parseInt(starReviews))].map((_, index) => (<BsStarFill key={index} />))}
            </div>
          )}
        </div>
      </div>
      <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
        <div className="text-center"><a className="btn btn-outline-dark mt-auto" onClick={handleAddToCartClick}>Add to cart</a></div>
      </div>
    </div>
    </div>
  );
};

export default ProductCard;
