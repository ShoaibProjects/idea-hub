import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../Auth/userSlice';
import { handleLogout } from '../LogOutBtn/LogOutUser';

interface DeleteButtonProps {
  username: string; // Pass the user ID to delete
  password: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ username, password }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (!password) {
      alert('Please enter your password.');
      return;
    }

    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Send a DELETE request with the user ID and password in the body
        await axios.delete(`https://idea-hub-api.vercel.app/user/delete/${username}`, {
          data: { username, password }, // Send password in the request body
          withCredentials: true,
        });

        alert('User deleted successfully');

        await axios.post('https://idea-hub-api.vercel.app/user/logout', {}, { withCredentials: true });

        // Dispatch the logout action to clear the Redux state
        dispatch(logout());

        navigate('/'); // Redirect after deletion
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('There was an error deleting the user. Please check your password.');
        if (axios.isAxiosError(error) && error.response) {
          const status = error.response.status;
      
          switch (status) {
            case 401:
              console.error('Unauthorized. Redirecting to login.');
              navigate('/signin');
              break;
      
            case 440:
              console.log('Session expired. Redirecting to login.');
              alert("Session expired. Please log in again.");
              await handleLogout(dispatch, navigate);
              break;
      
            case 403:
              console.error('Access forbidden. Invalid token.');
              alert("Invalid token. Please log in again.");
              await handleLogout(dispatch, navigate);
              break;
      
            case 500:
              console.error('Server error. Please try again later.');
              alert("A server error occurred. Please try again later.");
              break;
      
            default:
              console.error(`Unhandled error with status ${status}`);
          }
        } 
      }
    }
  };

  return (
    <div>
      <button onClick={handleDelete} className="danger-btn">
        Delete
      </button>
    </div>
  );
};

export default DeleteButton;
