import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../../utils/useLogout';
import './logOut.scss';

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogoutClick = () => useLogout(dispatch, navigate);

  return (
    <button className="logout-btn" onClick={onLogoutClick}>
      Log Out
    </button>
  );
};

export default LogoutButton;
