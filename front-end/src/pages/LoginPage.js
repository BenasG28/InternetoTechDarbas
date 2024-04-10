import React from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header'
import Navigation from '../components/Navigation';
import LoginSection from '../components/LoginSection';
import Footer from '../components/Footer';
import '../styles.css'
function LoginPage({onLogin}) {
  const navigate = useNavigate();
  return (
   <div>  
    <LoginSection onLogin={onLogin}/>
   </div>
  );
}

export default LoginPage;
