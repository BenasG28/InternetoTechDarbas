import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from './components/header'
import Navigation from './components/navigation';
import ProductSection from './components/product_section';
import Footer from './components/footer';
import './styles.css'
function HomePage() {
  const navigate = useNavigate();
  return (
   <div>
    <Navigation/>
    <Header/>
    <ProductSection/>
    <Footer/>
   </div>
  );
}

export default HomePage;
