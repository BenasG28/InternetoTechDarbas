import React from 'react';
import { useNavigate } from "react-router-dom";
import '../styles.css'
import AboutSection from '../components/AboutSection';
function AboutPage() {
  const navigate = useNavigate();
  return (
   <div>
    <AboutSection/>
   </div>
  );
}

export default AboutPage;
