import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../Auth/userSlice';

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
        await axios.delete(`http://localhost:5000/user/delete/${username}`, {
          data: { username, password }, // Send password in the request body
          withCredentials: true,
        });

        alert('User deleted successfully');

        await axios.post('http://localhost:5000/user/logout', {}, { withCredentials: true });

        // Dispatch the logout action to clear the Redux state
        dispatch(logout());

        navigate('/'); // Redirect after deletion
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('There was an error deleting the user. Please check your password.');
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
