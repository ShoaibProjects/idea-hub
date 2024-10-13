// Signin.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../userSlice';
import { AppDispatch, setRememberMe } from '../../../store';  
import { Link } from 'react-router-dom';                                                                                                 
import './signinForm.scss';

const Signin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMeState] = useState(false); 
  const dispatch: AppDispatch = useDispatch();

  const handleSignin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user/signin', {
        username,
        password,
      }, { withCredentials: true });

      if (response.status === 200) {
        // Dispatch user data to Redux store
        dispatch(setUser({
          username: response.data.username,
          preferences: response.data.preferences,
          postedContent: response.data.postedContent,
          followers: response.data.followers,
          following: response.data.following,
          likedIdeas: response.data.likedIdeas,
          dislikedIdeas: response.data.dislikedIdeas,
        }));

        // Update remember me state
        dispatch(setRememberMe(rememberMe)); // Store remember me choice in Redux
        localStorage.setItem('rememberMe', rememberMe.toString()); // Store in localStorage

        alert('Login successful');
        console.log(response);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className='signin-form'>
      <h2>Login</h2>
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
          onChange={(e) => setRememberMeState(e.target.checked)} 
        />
        Remember Me
      </label>
      <button onClick={handleSignin}>Login</button>
      <p>Doesn't have an Account yet?</p>
      <Link to={`/signup`}>Sign Up! </Link>
      <Link to={`/signup`}> OR continue as a guest User</Link>
    </div>
  );
};

export default Signin;
