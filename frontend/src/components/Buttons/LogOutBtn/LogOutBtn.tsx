import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../Auth/userSlice'; // Import the logout action
import axios from 'axios';

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the backend API to handle logout and clear cookies
      await axios.post('http://localhost:5000/user/logout', {}, { withCredentials: true });

      // Dispatch the logout action to clear the Redux state
      dispatch(logout());

      // Redirect to the login page
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button onClick={handleLogout}>
      Log Out
    </button>
  );
};

export default LogoutButton;
