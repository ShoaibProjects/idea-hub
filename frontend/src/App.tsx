import React from 'react';
import './App.scss';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUser, selectUser } from './components/Auth/userSlice';  // Import your setUser action from Redux
import { AppDispatch } from './store';

import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from './pages/home/home';
import UserPage from './pages/user/userPage';
import IdeaPage from './pages/idea/IdeaPage';
import SignupPage from './pages/signupPage/signupPage';
import SigninPage from './pages/signinPage/signinPage';
import TrendPage from './pages/trendingPage/trendingPage';
import ProfilePage from './pages/profilePage/profilePage';
import IdeaOpen from './pages/idea/ideaOpen';
import SettingsPage from './pages/settingsPage/settingsPage';
import AccountSettings from './components/Settings/AccSettings/AccSettings';
import PrefSettings from './components/Settings/preferencesSettings/preferencesSettings';

const App: React.FC = () => {

  const dispatch: AppDispatch = useDispatch();
  const user = useSelector(selectUser);
  // Check if "rememberMe" or "token" cookies exist
  const rememberMeCookie = document.cookie.split('; ').find(row => row.startsWith('rememberMe='));

  // Function to fetch user data if cookies exist
  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user/getUser/current', { withCredentials: true });

      if (response.status === 200) {
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
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    
    // If either the "rememberMe" cookie or the JWT token exists, fetch the user data
    if (rememberMeCookie) {
      fetchUserData();
    }
  }, [dispatch]);

  useEffect(() => {
    // Call the logout API if user state becomes empty
    if (!user.username && !rememberMeCookie) {
      const logout = async () => {
        try {
          await axios.post('http://localhost:5000/user/logout', {}, { withCredentials: true });
        } catch (error) {
          console.error('Logout error:', error);
        }
      };
      logout();
    }
  }, [user]); // This effect will run whenever user state changes

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/NewIdea" element={<IdeaPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/trending" element={<TrendPage />} />
        <Route path="/settings" element={<SettingsPage />}>
          <Route path="AccountSettings" element={<AccountSettings />} />
          <Route path="Preferences" element={<PrefSettings />} />
        </Route>
        <Route path="/user/profile/:lookedUpUsername" element={<ProfilePage />} />
        <Route path="/idea/:lookedUpIdea" element={<IdeaOpen />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} /> */}
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default App;
