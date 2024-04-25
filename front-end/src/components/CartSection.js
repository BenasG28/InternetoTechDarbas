import React, { useState, useEffect, useContext } from 'react';
import CartItem from './CartItem'; // Import the CartItem component
import CartContext from './CartContext';
import { useNavigate } from 'react-router-dom';

const CartSection = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false); // State to control the display of the order form
  const [showConfirmation, setShowConfirmation] = useState(false); // State to control the display of the confirmation message
  const [showNeedItQuestion, setShowNeedItQuestion] = useState(false); // State to control the display of the "Do you really need it?" question
  const [orderInfo, setOrderInfo] = useState({
    name: '',
    address: '',
    email: '',
    // Add more fields as needed
  });
  const { incrementCartItemCount } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleMakeOrder = () => {
    setShowOrderForm(true); // Show the order form when "Place Order" is clicked
  };

  const handleCloseOrderForm = () => {
    setShowOrderForm(false); // Close the order form when closed
  };

  const handleNextStep = () => {
    setShowOrderForm(false); // Close the order form
    setShowNeedItQuestion(true); // Show the "Do you really need it?" question when "Next" is clicked
  };

  const handleConfirmOrder = () => {
    setShowNeedItQuestion(false); // Close the "Do you really need it?" question popup
    setShowConfirmation(true); // Show the confirmation message
    // Here you can handle the order confirmation logic
    // For example, send the order to the backend
  };

  const handleRejectOrder = () => {
    setShowNeedItQuestion(false); // Close the "Do you really need it?" question popup
    // You can handle rejection logic here if needed
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // Send a request to the backend to make the order
    fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...orderInfo,
        cartItems: cartItems.map(item => ({
          productId: item.id,
          quantity: item.totalQuantity
        }))
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to make order');
        }
        // Order successfully made, navigate to order confirmation page or display a success message
        navigate('/order-confirmation');
      })
      .catch(error => {
        console.error('Error making order:', error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderInfo({
      ...orderInfo,
      [name]: value,
    });
  };

  const fetchCartItems = () => {
    fetch('/api/cart/items')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch cart items');
        }
        return response.json();
      })
      .then(data => {
        setCartItems(data.cartItems);
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
        navigate('/login');
      });
  };

  const removeFromCart = (productId) => {
    fetch(`/api/cart/remove/${productId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to remove product from cart');
        }
        // Refresh cart items after removal
        fetchCartItems();
        incrementCartItemCount();
      })
      .catch(error => {
        console.error('Error removing product from cart:', error);
      });
  };

  return (
    <section className="py-5 position-relative">
      <div className="container px-4 px-lg-5 mt-5">
        <h2 className="mb-4">Your Cart</h2>
        <div className="row">
          {cartItems.map(item => (
            <div className="col-md-4" key={item.id}>
              <CartItem
                name={item.name}
                price={item.price}
                image={item.image}
                quantity={item.totalQuantity}
              />
              <button className="btn btn-danger mt-2" onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
        </div>
        {/* Modal for Order Form */}
        {showOrderForm && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', zIndex: 9999, top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Order Information</h5>
                  <button type="button" className="btn-close" onClick={handleCloseOrderForm}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleNextStep}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input type="text" id="name" name="name" value={orderInfo.name} onChange={handleInputChange} className="form-control" placeholder="Name" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">Address</label>
                      <input type="text" id="address" name="address" value={orderInfo.address} onChange={handleInputChange} className="form-control" placeholder="Address" required />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input type="email" id="email" name="email" value={orderInfo.email} onChange={handleInputChange} className="form-control" placeholder="Email" required />
                    </div>
                    {/* Add more fields for order information */}
                    <button type="submit" className="btn btn-primary">Next</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Modal for "Do you really need it?" question */}
        {showNeedItQuestion && (
  <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', zIndex: 9999, top: 0, left: 0, right: 0, bottom: 0 }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content" style={{ textAlign: 'center' }}> {/* Center the content */}
        <div className="modal-header">
          <h5 className="modal-title">Do you really need it?</h5>
          <button type="button" className="btn-close" onClick={() => setShowNeedItQuestion(false)}></button>
        </div>
        <div className="modal-body">
          <p>Do you?? Do you really really really really need it?</p>
          <button className="btn btn-primary me-3" onClick={handleConfirmOrder}>Yes</button>
          <button className="btn btn-danger" onClick={handleRejectOrder}>No</button>
        </div>
      </div>
    </div>
  </div>
)}
        {/* Confirmation message */}
        {showConfirmation && (
          <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)', position: 'fixed', zIndex: 9999, top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmation</h5>
                  <button type="button" className="btn-close" onClick={() => setShowConfirmation(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Your order has been confirmed. Thank you!</p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Button to show the order form */}
        {!showOrderForm && !showConfirmation && !showNeedItQuestion && (
          <button className="btn btn-primary mt-4" onClick={handleMakeOrder}>Place Order</button>
        )}
      </div>
    </section>
  );
};

export default CartSection;
