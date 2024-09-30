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
  const dispatch: AppDispatch = useDispatch();

  const categories = useSelector(selectCategories);

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    // Check if preference is already selected or if limit (5) is reached
    if (!selectedPreferences.includes(value) && selectedPreferences.length <= 5) {
      setSelectedPreferences([...selectedPreferences, value]);
    } else if(selectedPreferences.includes(value) && selectedPreferences.length <= 5) {
      alert("Preference already selected");
    } else {
      alert("You can only select up to 5 preferences.");
    }
  };

  const handlePreferenceRemove = (preference: string) => {
    setSelectedPreferences(selectedPreferences.filter((pref) => pref !== preference));
  };
  
  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user/signup', {
        username,
        password,
        preferences: selectedPreferences,
      });
      if (response.status === 201) {
        // Dispatch user data to Redux store
        dispatch(setUser({
          username: response.data.username,
          preferences: response.data.preferences,
          likedIdeas: response.data.likedIdeas,
          dislikedIdeas: response.data.dislikedIdeas,
        }));
        alert('Signup successful');
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <div  className='signup-form'>
      <h2>Signup</h2>
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
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default Signup;
