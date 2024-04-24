import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ItemPage from './pages/ItemPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import RegisterPage from './pages/RegisterPage';
import Navigation from './components/Navigation';
import Header from './components/Header';
import Footer from './components/Footer';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import { CartProvider } from './components/CartContext';
import { useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if(isLoggedIn){
      validateToken();
    }
    
  }, [isLoggedIn]);

  const validateToken = () => {
    if(!isLoggedIn){
      return;
    }

    try {
      fetch('api/validate-token')
        .then(response => {
          if (response.ok) {
            handleLogin();
          } else {
            handleLogout();
          }
        })
        .catch(error => {
          console.error('Error validating token:', error);
          handleLogout();
        });
    } catch (error) {
      console.error('Error validating token:', error);
      handleLogout();
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    validateToken();
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <React.StrictMode>
      <BrowserRouter>
        <CartProvider>
        <Navigation isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Header />
        <Routes>
          <Route path="/" element={<Navigate replace to="/home" />}/>
          <Route path="/home" element={<HomePage />} />
          <Route path="/itempage/:id" element={<ItemPage/>}/>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/cart" element={<CartPage/>}/>
        </Routes>
        <Footer />
        </CartProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
  }
export default App;
