import React, { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

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
      });
  };
  const getTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.totalQuantity, 0);
  };

  const incrementCartItemCount = () => {
    fetchCartItems();
    getTotalQuantity();

};

  return (
    <CartContext.Provider value={{ cartItems, getTotalQuantity, incrementCartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
