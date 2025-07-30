import React from 'react';
import { useDeleteUser } from '../../../hooks/auth/useDeleteUser';
interface DeleteButtonProps {
  username: string;
  password: string;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ username, password }) => {
  const { deleteAccount, isLoading, error } = useDeleteUser();

  const handleDeleteClick = () => {
    deleteAccount(username, password);
  };

  return (
    <div>
      <button 
        onClick={handleDeleteClick} 
        className="danger-btn" 
        disabled={isLoading}
      >
        {isLoading ? 'Deleting...' : 'Delete Account'}
      </button>
      
      {error && (
        <p style={{ color: 'red', marginTop: '10px' }}>
          Error: {error.response?.data?.message || error.message}
        </p>
      )}
    </div>
  );
};

export default DeleteButton;
