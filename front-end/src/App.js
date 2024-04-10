import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ItemPage from './pages/ItemPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
<div>
          <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/itempage" element={<ItemPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/about" element={<AboutPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
          </Routes>
          </div>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;