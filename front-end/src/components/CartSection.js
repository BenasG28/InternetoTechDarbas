import React, { useState, useEffect, useContext } from 'react';
import CartItem from './CartItem'; // Import the CartItem component
import CartContext from './CartContext';
import { useNavigate } from 'react-router-dom';
const CartSection = () => {
  const [cartItems, setCartItems] = useState([]);
  const {incrementCartItemCount} = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

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
      </div>
    </section>
  );
};

export default CartSection;
