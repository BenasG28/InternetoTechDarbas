import React from 'react';
import ProductCard from './product_card';

const ProductSection = () => {
  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5 mt-5">
        <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
        <div className="col mb-5">
            <ProductCard
              imageSrc="https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
              productName="Fancy Product"
              price="$40.00 - $80.00"
              onSale={false}
              starReviews={null}
            />
          </div>
          <div className="col mb-5">
            <ProductCard
              imageSrc="https://dummyimage.com/450x300/dee2e6/6c757d.jpg"
              productName="Special Item"
              price="$18.00"
              onSale={true}
              starReviews={5}
            />
          </div>
            
          
          {/* Add more ProductCard components for each product */}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
