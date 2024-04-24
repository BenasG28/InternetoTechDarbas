import React from 'react';
import { useNavigate } from "react-router-dom";
import LoginSection from '../components/LoginSection';
function LoginPage({onLogin}) {
  const navigate = useNavigate();
  return (
   <div>  
    <LoginSection onLogin={onLogin}/>
   </div>
  );
}

export default LoginPage;
