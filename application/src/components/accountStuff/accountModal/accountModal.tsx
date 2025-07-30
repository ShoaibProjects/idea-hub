import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../hooks/auth/userSlice';
import { Link } from 'react-router-dom';
import LogoutButton from '../../Buttons/LogOutBtn/LogOutBtn';
import './AccountModal.scss'; 

interface AccountModalProps {
  onClose: () => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ onClose }) => {
  const user = useSelector(selectUser);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose(); 
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        {user.username ? (
          <div className="user-info">
            <h2>{user.username}</h2>
            <p>Account: {user.username}</p>
            <div className='ac-btns'>
            <Link to={`/signin`} className="switch-link">Switch Account</Link>
            <LogoutButton />
            </div>
          </div>
        ) : (
          <div className="user-info">
            <p>You are not Logged in</p>
            <Link to={`/signin`} className="login-link" onClick={onClose}>Please Login First</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountModal;
