import { logout } from '../hooks/auth/userSlice';
import { AppDispatch } from '../store';
import { NavigateFunction } from 'react-router-dom';
import { logoutUser } from '../api/deleteService';

export const useLogout = async (dispatch: AppDispatch, navigate: NavigateFunction): Promise<void> => {
  try {
    await logoutUser();

    navigate('/signin');

    dispatch(logout());
  } catch (error) {
    console.error('Logout error:', error);
  }
};
