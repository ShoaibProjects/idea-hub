import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store'; 
import { logout } from './userSlice'; 
import { useLogout } from '../../utils/useLogout';
import { deleteUserAccount, logoutUser } from '../../api/deleteService';

interface ErrorState {
  message: string;
  response?: {
    status: number;
    data: any;
  };
}

interface UseDeleteUserReturn {
  deleteAccount: (username: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: ErrorState | null;
}

export const useDeleteUser = (): UseDeleteUserReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const deleteAccount = async (username: string, password: string): Promise<void> => {
    const isConfirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!isConfirmed) {
      return;
    }

    if (!password) {
      alert('Please enter your password.');
      setError({ message: 'Password is required.' });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await deleteUserAccount({username, password});

      alert('User deleted successfully');

      await logoutUser();

      dispatch(logout());

      navigate('/');

    } catch (err: any) { 
      console.error('Error deleting user:', err);
      alert('There was an error deleting the user. Please check your password or try again later.');
      setError(err); 

      if (err.response) {
        const status = err.response.status;
        switch (status) {
          case 401: 
            console.error('Unauthorized. Redirecting to login.');
            navigate('/signin');
            break;
          case 403: 
            console.error('Access forbidden. Invalid token.');
            alert("Invalid token. Please log in again.");
            await useLogout(dispatch, navigate);
            break;
          case 440: 
            console.log('Session expired. Redirecting to login.');
            alert("Session expired. Please log in again.");
            await useLogout(dispatch, navigate);
            break;
          case 500: 
            console.error('Server error. Please try again later.');
            break;
          default:
            console.error(`Unhandled error with status ${status}`);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteAccount, isLoading, error };
};