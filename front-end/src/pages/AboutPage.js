import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header'
import Navigation from '../components/Navigation';
import ProductSection from '../components/ProductSection';
import Footer from '../components/Footer';
import '../styles.css'
import AboutSection from '../components/AboutSection';
function AboutPage() {
  const navigate = useNavigate();
  return (
   <div>
    <Navigation/>
    <Header/>
    <AboutSection/>
    <Footer/>
   </div>
  );
}

export default AboutPage;
