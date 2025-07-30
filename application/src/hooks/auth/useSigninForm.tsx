import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from './userSlice';
import authService from '../../api/authService';

export const useSigninForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setError('');

    if (!username.trim() || !password) {
      setError('Username and password are required');
      return;
    }

    setIsLoading(true);
    try {
      const userData = await authService.signin({username, password, rememberMe});
      
      dispatch(setUser({
        username: userData.username?? "",
        description: userData.description?? "",
        preferences: userData.preferences,
        postedContent: userData.postedContent,
        followers: userData.followers,
        following: userData.following,
        likedIdeas: userData.likedIdeas,
        dislikedIdeas: userData.dislikedIdeas,
      }));
      
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your username and password.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    error,
    isLoading,
    handleSignin,
  };
};