import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Select, { OnChangeValue } from 'react-select';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useSignupForm } from '../../../hooks/auth/useSignupForm';
import { selectCategories } from '../../../Redux-slices/categories/categorySlices';
import './SignupForm.scss';

type PreferenceOption = { value: string; label: string };

const Signup = () => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    setIsGuest,
    error,
    isLoading,
    handleSignup,
  } = useSignupForm();

  const [showPassword, setShowPassword] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<PreferenceOption[]>([]);
  
  const categories = useSelector(selectCategories);
  const preferenceOptions: PreferenceOption[] = categories.map((cat: string) => ({ value: cat, label: cat }));

  const handleSelectChange = (options: OnChangeValue<PreferenceOption, true>) => {
    if (options.length <= 5) {
      setSelectedPreferences([...options]);
    } else {
      alert("You can only select up to 5 preferences.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const preferenceValues = selectedPreferences.map(opt => opt.value);
    handleSignup(preferenceValues);
  };

  return (
    <div className='signup-form-cont'>
      <form className='signup-form' onSubmit={handleSubmit}>
        <h2>Signup</h2>
        {error && <div className="error">{error}</div>}
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />
        <div className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
          </span>
        </div>

        <div className="preferences-dropdown">
          <label>Select up to 5 Preferences:</label>
          <Select
            options={preferenceOptions}
            isMulti
            onChange={handleSelectChange}
            value={selectedPreferences}
            placeholder="Select your preferences..."
          />
        </div>

        <div className="remember-me">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={isLoading}
          />
          <label htmlFor="rememberMe">Remember Me</label>
        </div>

        <div className="signup-buttons">
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
          <button type="button" onClick={() => setIsGuest(true)} disabled={isLoading}>
            Continue as Guest
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
