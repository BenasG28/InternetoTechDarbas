import React from 'react';
import { useNavigate } from "react-router-dom";
import RegisterSection from '../components/RegisterSection';
function RegisterPage() {
  const navigate = useNavigate();
  return (
   <div>  
    <RegisterSection/>
   </div>
  );
}

export default RegisterPage;
