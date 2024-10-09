import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../userSlice';
import { AppDispatch } from '../../../store';                                                                                                   
import './signinForm.scss';

const Signin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch: AppDispatch = useDispatch();

  const handleSignin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/user/signin', {
        username,
        password,
      });
      if (response.status === 200) {
        // Dispatch user data to Redux store
        dispatch(setUser({
          username: response.data.username,
          preferences: response.data.preferences,
          postedContent: response.data.postedContent,
          followers : response.data.followers,
          following: response.data.following,
          likedIdeas: response.data.likedIdeas,
          dislikedIdeas: response.data.dislikedIdeas,
        }));
        alert('Login successful');
        console.log(response)
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div  className='signin-form'>
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
      <button onClick={handleSignin}>Login</button>
    </div>
  );
};

export default Signin;
