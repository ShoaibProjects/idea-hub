import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../userSlice';
import { AppDispatch } from '../../../store';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'; // Importing Material Design icons
import './signinForm.scss';

const Signin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const signinButtonRef = useRef(null);

  const validateForm = () => {
    setError('');
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
    if (!validateForm()) return;

    try {
      const response = await axios.post('https://idea-hub-api.vercel.app/user/signin', {
        username,
        password,
        rememberMe,
      }, { withCredentials: true });

      if (response.status === 200) {
        dispatch(setUser({
          username: response.data.username,
          description: response.data.description ? response.data.description : null,
          preferences: response.data.preferences,
          postedContent: response.data.postedContent,
          followers: response.data.followers,
          following: response.data.following,
          likedIdeas: response.data.likedIdeas,
          dislikedIdeas: response.data.dislikedIdeas,
        }));
        alert('Login successful');
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your username and password.');
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    nextRef: React.RefObject<HTMLInputElement>
  ) => {
    if (event.key === 'Enter' && nextRef.current) {
      nextRef.current.focus();
    }
  };
  

  return (
    <div className='signin-form-cont'>
      <div className='signin-form'>
        <h2>Login</h2>
        <p>Welcome back! Please enter your details.</p>
        {error && <div className='error'>{error}</div>}

        <div>
          <label htmlFor="username">Username: </label>
          <input
            id='username'
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, passwordRef)}
            ref={usernameRef}
          />
        </div>

        <div>
          <label htmlFor="password">Password: </label>
          <div className="password-input">
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, signinButtonRef)}
              ref={passwordRef}
            />
            <span 
              className="toggle-password" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <MdVisibility /> : <MdVisibilityOff />} {/* Use Material Design Icons */}
            </span>
          </div>
        </div>

        <label className='remember'>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span> </span>Remember Me
        </label>

        <button onClick={handleSignin} ref={signinButtonRef}>Login</button>

        <p className='signup-prompt'>Doesn't have an Account yet?</p>

        <Link to={`/signup`}>Sign Up!</Link>

        <Link to={`/signup`} className='guest-signup'>OR continue as a Guest User</Link>
      </div>
    </div>
  );
};

export default Signin;
