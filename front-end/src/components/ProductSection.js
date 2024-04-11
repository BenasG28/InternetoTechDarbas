import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import ProductCard from './ProductCard';

const ProductSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = queryString.parse(location.search);
  const [products, setProducts] = useState([]);
  const [sortMethod, setSortMethod] = useState(queryParams.sort || 'none'); // Default sort method from URL query params

  useEffect(() => {
    fetchProducts();
  }, [sortMethod]); // Fetch products whenever sortMethod changes

  const fetchProducts = () => {
    fetch(`/api/products?sort=${sortMethod}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  };

  const handleSortChange = (event) => {
    const newSortMethod = event.target.value;
    setSortMethod(newSortMethod); // Update selected sort method

    // Update URL with new sort method
    const queryParams = queryString.stringify({ ...queryString.parse(location.search), sort: newSortMethod });
    navigate(`${location.pathname}?${queryParams}`);
  };

  return (
    <section className="py-5 position-relative">
      <div className="container px-4 px-lg-5 mt-5">
        <div className="position-absolute top-0 end-0 mb-3">
          <label htmlFor="sortMethod" className="form-label me-2">Sort by:</label>
          <select className="form-select" id="sortMethod" value={sortMethod} onChange={handleSortChange}>
            <option value="none">None</option>
            <option value="stars">Stars</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
            {/* Add more sorting options if needed */}
          </select>
        </div>
        <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
          {products.map((product, index) => (
            <div className="col mb-5" key={index}>
              <ProductCard
                onClick={() => navigate(`/itempage/${product.id}`)}
                imageSrc={product.image}
                productName={product.name}
                price={product.price}
                onSale={product.onsale}
                starReviews={product.stars}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
