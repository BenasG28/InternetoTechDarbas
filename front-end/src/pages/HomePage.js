import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header'
import Navigation from '../components/Navigation';
import ProductSection from '../components/ProductSection';
import Footer from '../components/Footer';
import '../styles.css'
function HomePage() {
  const navigate = useNavigate();
  return (
   <div>
    <ProductSection/>
   </div>
  );
}

export default HomePage;
