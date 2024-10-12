import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../Auth/userSlice';
import { Link, useParams } from 'react-router-dom';
import LogoutButton from '../../Buttons/LogOutBtn/LogOutBtn';

interface AccountModalProps {
  onClose: () => void; // Prop to close modal
}

const AccountModal: React.FC<AccountModalProps> = ({ onClose }) => {
  // Get the user data from Redux store
  const user = useSelector(selectUser);

  return (
    <div className="modal">
      <div className="modal-content">
        {/* Close button */}
        <button onClick={onClose}>Close</button>

        {/* Display user info or a placeholder */}
        {user.username ? (
          <div>
            <h2>{user.username}</h2>
            <p>Account: {user.username}</p>
            <Link to={`/signin`}>Switch Account</Link>
            <LogoutButton></LogoutButton>
          </div>
        ) : (
          <div>
            <p>You are not Logged in</p>
            <Link to={`/signin`}>Please Login First</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountModal;
