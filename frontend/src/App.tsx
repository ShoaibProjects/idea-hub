import React from 'react';
import './App.scss';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Home from './pages/home/home';
import UserPage from './pages/user/userPage';
import IdeaPage from './pages/idea/IdeaPage';

const App: React.FC = () => {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/NewIdea" element={<IdeaPage />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} /> */}
      </Routes>
    </BrowserRouter>
    </>
  );
};

export default App;
