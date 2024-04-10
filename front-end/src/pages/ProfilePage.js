import React from 'react';
import { useNavigate } from "react-router-dom";
import '../styles.css'
import UserProfileSection from '../components/UserProfileSection';
function ProfilePage() {
  return (
   <div>  
    <UserProfileSection/>
   </div>
  );
}

export default ProfilePage;
