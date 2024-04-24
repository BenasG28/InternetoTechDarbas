import React from "react";
import { useNavigate } from "react-router-dom";
import CartSection from '../components/CartSection';

const CartPage = () => {
  const navigate = useNavigate();
  return (
   <div>
    <CartSection/>
   </div>
  );
};

export default CartPage;
