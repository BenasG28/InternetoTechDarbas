import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header'
import Navigation from '../components/Navigation';
import LoginSection from '../components/LoginSection';
import Footer from '../components/Footer';
import '../styles.css'
function LoginPage() {
  const navigate = useNavigate();
  return (
   <div>  
    <Navigation/>
    <Header/>
    <LoginSection/>
    <Footer/>
   </div>
  );
}

export default LoginPage;
