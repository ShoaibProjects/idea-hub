import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { selectUser } from '../../Auth/userSlice';
import LogoutButton from '../../Buttons/LogOutBtn/LogOutBtn';
import DeleteButton from '../../Buttons/DeleteAccountBtn/DeleteAccountBtn';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import '../Settings.scss';
import { useNavigate } from 'react-router';
import { handleLogout } from '../../Buttons/LogOutBtn/LogOutUser';

const AccountSettings: React.FC = () => {
  const user = useSelector(selectUser);

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showAccDel, setShowAccDel] = useState(false);

  const [password, setPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }
    if (newPassword == '' || currentPassword == '' || confirmPassword == '') {
      setError('Please fill all entries');
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
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowPasswordChange(false);
      } else {
        setError('Error changing password');
      }
    } catch (error) {
      setError('Invalid original password or request failed');
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
    
        switch (status) {
          case 401:
            console.error('Unauthorized. Redirecting to login.');
            navigate('/signin');
            break;
    
          case 440:
            console.log('Session expired. Redirecting to login.');
            alert("Session expired. Please log in again then try.");
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
  };

  return (
    <div className="account-settings">
      <h3>Account: {user.username}</h3>

      <div className="settings-buttons">
        {!showPasswordChange && (<button
          className="primary-btn"
          onClick={() => { setShowPasswordChange(!showPasswordChange), setShowAccDel(false) }}
        >Change Password</button>)}

        {showPasswordChange && (
          <div className="form-container">
            <div className="form-group">
              <label htmlFor='cur-pw'>Current Password</label>
              <div className='password-input'>
                <input
                  id='cur-pw'
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <MdVisibility /> : <MdVisibilityOff />} {/* Use Material Design Icons */}
                </span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor='new-pw'>New Password</label>
              <div className='password-input'>
                <input
                  id='new-pw'
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <MdVisibility /> : <MdVisibilityOff />} {/* Use Material Design Icons */}
                </span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor='con-pw'>Confirm New Password</label>
              <div className='password-input'>
                <input
                  id='con-pw'
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <MdVisibility /> : <MdVisibilityOff />} {/* Use Material Design Icons */}
                </span>
              </div>
            </div>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <div className='pwc-btn-group'>
              <button className="primary-btn" onClick={handlePasswordChange}>
                Submit
              </button>
              <button className='primary-btn' onClick={() => setShowPasswordChange(!showPasswordChange)}>Cancel</button>
            </div>
          </div>
        )}

        <div className='log-out'>
          <LogoutButton />
        </div>

        {!showAccDel && (<button
          className="danger-btn"
          onClick={() => { setShowAccDel(!showAccDel), setShowPasswordChange(false) }}
        >
          Delete Account
        </button>)}

        {showAccDel && (
          <div className="form-container">
            <div className="form-group">
              <label htmlFor='pw'>Enter Password</label>
              <div className='password-input'>
                <input
                  id='pw'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <MdVisibility /> : <MdVisibilityOff />} {/* Use Material Design Icons */}
                </span>
              </div>
            </div>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <div className='pwc-btn-group'>
              <div className='del-btn'>
                <DeleteButton username={user.username ? user.username : ''} password={password} />
              </div>
              <button className='primary-btn' onClick={() => { setShowAccDel(!showAccDel) }}>Cancel</button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default AccountSettings;
