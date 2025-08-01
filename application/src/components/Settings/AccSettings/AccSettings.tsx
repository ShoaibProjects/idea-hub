import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../hooks/auth/userSlice';
import { useAccountSettings } from '../../../hooks/useAccountSettings';
import LogoutButton from '../../Buttons/LogOutBtn/LogOutBtn';
import DeleteButton from '../../Buttons/DeleteAccountBtn/DeleteAccountBtn';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import '../Settings.scss';

const AccountSettings: React.FC = () => {
  const user = useSelector(selectUser);

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showAccDel, setShowAccDel] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const {
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    loading, error, success,
    handlePasswordChange,
  } = useAccountSettings();

  const handleSubmitPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    await handlePasswordChange();
  };

  return (
    <div className="account-settings">
      <h3>Account: {user?.username}</h3>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}

      <div className="settings-buttons">
        {!showPasswordChange && (
          <button className="primary-btn" onClick={() => { setShowPasswordChange(true); setShowAccDel(false); }}>
            Change Password
          </button>
        )}

        {showPasswordChange && (
          <form className="form-container" onSubmit={handleSubmitPasswordChange}>
            <div className="form-group">
              <label htmlFor='cur-pw'>Current Password</label>
              <div className='password-input'>
                <input id='cur-pw' type={showPassword ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} disabled={loading} required />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <MdVisibility /> : <MdVisibilityOff />}</span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor='new-pw'>New Password</label>
              <div className='password-input'>
                <input id='new-pw' type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={loading} required />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <MdVisibility /> : <MdVisibilityOff />}</span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor='con-pw'>Confirm New Password</label>
              <div className='password-input'>
                <input id='con-pw' type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} required />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <MdVisibility /> : <MdVisibilityOff />}</span>
              </div>
            </div>
            <div className='pwc-btn-group'>
              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <button type="button" className='primary-btn' onClick={() => setShowPasswordChange(false)} disabled={loading}>
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className='log-out'>
          <LogoutButton />
        </div>

        {!showAccDel && (
          <button className="danger-btn" onClick={() => { setShowAccDel(true); setShowPasswordChange(false); }}>
            Delete Account
          </button>
        )}

        {showAccDel && (
          <div className="form-container">
            <div className="form-group">
              <label htmlFor='pw'>Enter Password to Confirm</label>
              <div className='password-input'>
                <input id='pw' type={showPassword ? 'text' : 'password'} value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} placeholder="Enter your password" />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <MdVisibility /> : <MdVisibilityOff />}</span>
              </div>
            </div>
            <div className='pwc-btn-group'>
              <div className='del-btn'>
                <DeleteButton username={user?.username || ''} password={deletePassword} />
              </div>
              <button className='primary-btn' onClick={() => setShowAccDel(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
