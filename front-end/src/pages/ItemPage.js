import React from "react";
import { useNavigate } from "react-router-dom";
import ItemSection from '../components/ItemSection';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import ProductSection from '../components/ProductSection';
import '../styles.css'

const ItemPage = () => {
  const navigate = useNavigate();
  return (
   <div>
    <Navigation/>
    <ItemSection/>
   </div>
  );
};

export default ItemPage;
