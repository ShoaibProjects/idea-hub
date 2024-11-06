import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handleLogout } from './LogOutUser';
import './logOut.scss';

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Call handleLogout with dispatch and navigate
  const onLogoutClick = () => handleLogout(dispatch, navigate);

  return (
    <button className="logout-btn" onClick={onLogoutClick}>
      Log Out
    </button>
  );
};

export default LogoutButton;
