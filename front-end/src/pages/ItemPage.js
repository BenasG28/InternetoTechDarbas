import React from "react";
import { useNavigate } from "react-router-dom";
import ItemSection from '../components/ItemSection';
import '../styles.css'

const ItemPage = () => {
  const navigate = useNavigate();
  return (
   <div>
    <ItemSection/>
   </div>
  );
};

export default ItemPage;
