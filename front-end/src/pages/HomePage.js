import React from 'react';
import { useNavigate } from "react-router-dom";
import ProductSection from '../components/ProductSection';
function HomePage() {
  const navigate = useNavigate();
  return (
   <div>
    <ProductSection/>
   </div>
  );
}

export default HomePage;
