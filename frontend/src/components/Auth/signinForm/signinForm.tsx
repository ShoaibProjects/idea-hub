import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../userSlice';
import { AppDispatch } from '../../../store';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './signinForm.scss';

const Signin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me"
  const [error, setError] = useState(''); // State for error messages
  const dispatch: AppDispatch = useDispatch();

  const navigate = useNavigate();

  const validateForm = () => {
    // Reset error message
    setError('');

    // Check if username or password is empty
    if (!username.trim()) {
      setError('Username is required');
      return false;
    }

    if (!password) {
      setError('Password is required');
      return false;
    }

    return true;
  };

  const handleSignin = async () => {
    if (!validateForm()) {
      return; // Stop if validation fails
    }

    try {
      const response = await axios.post('http://localhost:5000/user/signin', {
        username,
        password,
        rememberMe, // Send the "Remember Me" value in the request
      }, { withCredentials: true });

      if (response.status === 200) {
        // Dispatch user data to Redux store
        dispatch(setUser({
          username: response.data.username,
          description: response.data.description?response.data.description:null,
          preferences: response.data.preferences,
          postedContent: response.data.postedContent,
          followers: response.data.followers,
          following: response.data.following,
          likedIdeas: response.data.likedIdeas,
          dislikedIdeas: response.data.dislikedIdeas,
        }));

        alert('Login successful');
        navigate('/')
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your username and password.'); // Set error message on failed login
    }
  };

  return (
    <div className='signin-form'>
      <h2>Login</h2>
      {error && <div className='error'>{error}</div>} {/* Display error messages */}
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
      <label>
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        Remember Me
      </label>
      <button onClick={handleSignin}>Login</button>
      <p>Doesn't have an Account yet?</p>
      <Link to={`/signup`}>Sign Up!</Link>
      <Link to={`/signup`}> OR continue as a guest User</Link>
    </div>
  );
};

export default Signin;
