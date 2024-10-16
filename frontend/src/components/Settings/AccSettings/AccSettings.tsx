import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { selectUser } from '../../Auth/userSlice';
import LogoutButton from '../../Buttons/LogOutBtn/LogOutBtn';
import DeleteButton from '../../Buttons/DeleteAccountBtn/DeleteAccountBtn';

const AccountSettings: React.FC = () => {
  const user = useSelector(selectUser);

  // State for toggling password change form visibility
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  
  // State for password form fields and feedback messages
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to handle password change request
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:5000/user/update/password`, 
        {
          username: user.username,
          password: currentPassword,
          newPassword
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSuccess('Password changed successfully');
        setError('');
        setCurrentPassword(''); // Clear the form
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordChange(false); // Hide the form
      } else {
        setError('Error changing password');
      }
    } catch (err) {
      setError('Invalid original password or request failed');
    }
  };

  return (
    <div className='setting-cont'>
      <h3>Account: {user.username}</h3>

      {/* Button to toggle the password change form */}
      <button onClick={() => setShowPasswordChange(!showPasswordChange)}>
        {showPasswordChange ? 'Cancel Password Change' : 'Change Password'}
      </button>

      {/* Conditionally render the password change form */}
      {showPasswordChange && (
        <div className='password-change-form'>
          <div>
            <label>Current Password</label>
            <input 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <label>New Password</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label>Confirm New Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <button onClick={handlePasswordChange}>Submit Password Change</button>
        </div>
      )}

      {/* Other settings buttons */}
      <div>
        <DeleteButton username={user.username?user.username:''}></DeleteButton>
      </div>
      <div>
        <LogoutButton></LogoutButton>
      </div>
    </div>
  );
};

export default AccountSettings;
