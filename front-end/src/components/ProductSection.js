// export default ProductSection;
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
//import { useHistory } from 'react-router-dom'; 
import { useNavigate } from 'react-router-dom';
const ProductSection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products"); 
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      
      // Sort products by stars in descending order (from best rated to lowest rated)
      const sortedProducts = data.sort((a, b) => b.stars - a.stars);
      
      setProducts(sortedProducts); // Update state with sorted products
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5 mt-5">
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

