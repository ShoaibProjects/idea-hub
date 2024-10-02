import React from 'react';
import './App.scss';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from './pages/home/home';
import UserPage from './pages/user/userPage';
import IdeaPage from './pages/idea/IdeaPage';
import SignupPage from './pages/signupPage/signupPage';
import SigninPage from './pages/signinPage/signinPage';
import TrendPage from './pages/trendingPage/trendingPage';
import ProfilePage from './pages/profilePage/profilePage';

const App: React.FC = () => {
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
        <Route path="/user/profile/:lookedUpUsername" element={<ProfilePage />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} /> */}
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default App;
