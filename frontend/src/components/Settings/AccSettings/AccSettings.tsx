import React from 'react';
import { Link, useParams } from 'react-router-dom';
import '../Settings.scss';
import { useSelector } from 'react-redux';
import { selectUser } from '../../Auth/userSlice';
import LogoutButton from '../../Buttons/LogOutBtn/LogOutBtn';
import DeleteButton from '../../Buttons/DeleteAccountBtn/DeleteAccountBtn';

// Define the interface for your component props
interface SettingsProps {
    onClose: () => void;
}

// Functional component with props typed
const AccountSettings: React.FC = () => {
  // Component logic can go here
  const user = useSelector(selectUser);
  return (
    <div className='setting-cont'>
      <div>Account : {user.username}</div>
      <div><DeleteButton username={user.username?user.username:''}></DeleteButton></div>
      <div><LogoutButton></LogoutButton></div>
    </div>
  );
};

export default AccountSettings;
