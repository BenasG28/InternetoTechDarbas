import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ItemPage from './components/item_page';
import HomePage from './homepage';

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
<div>
          <h1>GKL</h1>
          <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/itempage" element={<ItemPage/>}/>
          </Routes>
          </div>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
