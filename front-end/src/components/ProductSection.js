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
  const [cartItemCount, setCartItemCount] = useState(0);

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

  const handleAddToCart = (productId) =>{
    fetch('/api/cart/add',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: productId,
        quantity: 1,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add product to cart');
        }
      })
      .catch(error => {
        console.error('Error adding product to cart:', error);
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
            <option value="starsLowToHigh">Rating: Low to High</option>
            <option value="starsHighToLow">Rating: High to Low</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
            <option value="nameAToZ">Name: A-Z</option>
            <option value="nameZToA">Name: Z-A</option>
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
                onAddToCart={() => handleAddToCart(product.id)} // Pass handleAddToCart function as a prop
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
