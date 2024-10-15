import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUser } from '../userSlice';
import { AppDispatch } from '../../../store';
import { selectCategories } from '../../../Redux-slices/categories/categorySlices';
import './SignupForm.scss';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [isGuest, setIsGuest] = useState(false); // New state for guest signup
  const [rememberMe, setRememberMe] = useState(false); 
  const [error, setError] = useState(''); // State to track form validation errors
  const dispatch: AppDispatch = useDispatch();
  const categories = useSelector(selectCategories);

  const validateForm = () => {
    setError(''); // Clear previous errors

    if (!isGuest) {
      if (!username.trim()) {
        setError('Username is required');
        return false;
      }
      if (!password) {
        setError('Password is required');
        return false;
      }
    }

    if (selectedPreferences.length === 0) {
      setError('Please select at least one preference');
      return false;
    }

    return true;
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!selectedPreferences.includes(value) && selectedPreferences.length < 5) {
      setSelectedPreferences([...selectedPreferences, value]);
    } else if (selectedPreferences.includes(value)) {
      alert("Preference already selected");
    } else {
      alert("You can only select up to 5 preferences.");
    }
  };

  const handlePreferenceRemove = (preference: string) => {
    setSelectedPreferences(selectedPreferences.filter((pref) => pref !== preference));
  };

  const handleSignup = async () => {
    if (!validateForm()) return; // Stop signup if validation fails

    try {
      const response = await axios.post('http://localhost:5000/user/signup', {
        username,
        password,
        preferences: selectedPreferences,
        isGuest, // Send isGuest flag
        rememberMe,
      }, { withCredentials: true });

      if (response.status === 201) {
        dispatch(setUser({
          username: response.data.username,
          preferences: response.data.preferences,
          postedContent: response.data.postedContent,
          followers : response.data.followers,
          following: response.data.following,
          likedIdeas: response.data.likedIdeas,
          dislikedIdeas: response.data.dislikedIdeas,
        }));

        alert(isGuest ? 'Guest signup successful' : 'Signup successful');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <div className='signup-form'>
      <h2>Signup</h2>
      {error && <div className="error">{error}</div>} {/* Display error messages */}
      {!isGuest && (
        <>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </>
      )}
      <div className="preferences-dropdown">
        <label>Select Preferences :</label>
        <select onChange={handlePreferenceChange}>
          <option value="">Select a preference</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div className="selected-preferences">
          {selectedPreferences.map((preference, index) => (
            <div key={index} className="preference-bubble">
              {preference}
              <span onClick={() => handlePreferenceRemove(preference)}>&times;</span>
            </div>
          ))}
        </div>
      </div>
      <div className="remember-me">
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
        />
        <label htmlFor="rememberMe">Remember Me</label>
      </div>
      <div className="signup-buttons">
        <button onClick={handleSignup}>Sign Up</button>
        <button onClick={() => { setIsGuest(true); handleSignup(); }}>Continue as Guest</button>
      </div>
    </div>
  );
};

export default Signup;
