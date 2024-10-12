import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface DeleteButtonProps {
  username: string; // Pass the user ID to delete
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ username }) => {
  const [password, setPassword] = useState(''); // To store the user's password
  const navigate = useNavigate();

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
        });
        
        alert('User deleted successfully');
        navigate('/'); // Redirect after deletion
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('There was an error deleting the user. Please check your password.');
      }
    }
  };

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
      />
      <button onClick={handleDelete} className="delete-btn">
        Delete Account
      </button>
    </div>
  );
};

export default DeleteButton;
