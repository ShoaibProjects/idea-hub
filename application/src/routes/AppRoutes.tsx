import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from '../pages/home/home';
import UserPage from '../pages/user/userPage';
import IdeaPage from '../pages/idea/IdeaPage';
import SignupPage from '../pages/signupPage/signupPage';
import SigninPage from '../pages/signinPage/signinPage';
import TrendPage from '../pages/trendingPage/trendingPage';
import ProfilePage from '../pages/profilePage/profilePage';
import IdeaOpen from '../pages/idea/ideaOpen';
import SettingsPage from '../pages/settingsPage/settingsPage';
import AccountSettings from '../components/Settings/AccSettings/AccSettings';
import PrefSettings from '../components/Settings/preferencesSettings/preferencesSettings';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/userinfo" element={<UserPage />} />
      <Route path="/NewIdea" element={<IdeaPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signin" element={<SigninPage />} />
      <Route path="/trending" element={<TrendPage />} />
      <Route path="/settings" element={<SettingsPage />}>
        <Route path="AccountSettings" element={<AccountSettings />} />
        <Route path="Preferences" element={<PrefSettings />} />
      </Route>
      <Route path="/userinfo/profile/:lookedUpUsername" element={<ProfilePage />} />
      <Route path="/ideainfo/:lookedUpIdea" element={<IdeaOpen />} />
    </Routes>
  );
};

export default AppRoutes;
