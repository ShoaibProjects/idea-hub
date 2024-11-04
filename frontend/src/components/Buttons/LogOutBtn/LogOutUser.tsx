import axios from 'axios';
import { logout } from '../../Auth/userSlice';
import { AppDispatch } from '../../../store';  // Update with your store file path
import { NavigateFunction } from 'react-router-dom';

export const handleLogout = async (dispatch: AppDispatch, navigate: NavigateFunction): Promise<void> => {
  try {
    // Call the backend API to handle logout and clear cookies
    await axios.post('http://localhost:5000/user/logout', {}, { withCredentials: true });



    // Redirect to the login page
    navigate('/signin');

    // Dispatch the logout action to clear the Redux state
    dispatch(logout());
  } catch (error) {
    console.error('Logout error:', error);
  }
};
