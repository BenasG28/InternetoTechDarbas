// import React from 'react';
// import { useParams } from 'react-router-dom';

// const ItemSection = ({ imageSrc, productName, price, onSale, starReviews }) => {
  // return (
  //   <div>
  //     <section className="py-5">
  //       <div className="container px-4 px-lg-5 my-5">
  //         <div className="row gx-4 gx-lg-5 align-items-center">
  //           <div className="col-md-6"><img className="card-img-top mb-5 mb-md-0" src={imageSrc} alt="..." /></div>
  //           <div className="col-md-6">
  //             <div className="small mb-1">SKU: {productName}</div>
  //             <h1 className="display-5 fw-bolder">{productName}</h1>
  //             <div className="fs-5 mb-5">
  //               {onSale && <span className="text-decoration-line-through">{price}</span>}
  //               <span>{price}</span>
  //             </div>
  //             <p className="lead">Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium at dolorem quidem modi. Nam sequi consequatur obcaecati excepturi alias magni, accusamus eius blanditiis delectus ipsam minima ea iste laborum vero?</p>
  //             <div className="d-flex">
  //               <input className="form-control text-center me-3" id="inputQuantity" type="number" defaultValue="1" style={{ maxWidth: "3rem" }} />
  //               <button className="btn btn-outline-dark flex-shrink-0" type="button">
  //                 <i className="bi-cart-fill me-1"></i>
  //                 Add to cart
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </section>
  //   </div>
//   );
// }

// export default ItemSection;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ItemSection = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // Define the fetchProduct function to fetch a single product by id
  const fetchProduct = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      const productData = await response.json();
      setProduct(productData);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  useEffect(() => {
    // Call fetchProduct with the id parameter
    fetchProduct(id);
  }, [id]);



  // Check if product data is still loading
  if (!product) {
    return <div>The item you're trying to find don't exist</div>;
  }

  return (
    <div>
    <section className="py-5">
      <div className="container px-4 px-lg-5 my-5">
        <div className="row gx-4 gx-lg-5 align-items-center">
          <div className="col-md-6">
            <img className="card-img-top mb-5 mb-md-0" src={product.image} alt={product.name} />
          </div>
          <div className="col-md-6">
            {/* <div className="small mb-1">SKU: {product.id}</div> */}
            <h1 className="display-5 fw-bolder">{product.name}</h1>
            <div className="fs-5 mb-5">
              {product.onsale && <span className="text-decoration-line-through">{product.price}</span>}
              <span>{product.price}</span>
            </div>
            <p className="lead">{product.description}</p>
            <div className="d-flex">
              <input className="form-control text-center me-3" id="inputQuantity" type="number" defaultValue="1" style={{ maxWidth: "3rem" }} />
              <button className="btn btn-outline-dark flex-shrink-0" type="button">
                <i className="bi-cart-fill me-1"></i>
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  
  );
}

export default ItemSection;
