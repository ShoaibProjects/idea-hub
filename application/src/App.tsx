import React, { useEffect } from 'react';
import { BrowserRouter } from "react-router-dom";
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { AppDispatch } from './store';
import { setTheme } from './Redux-slices/themeSlice/themeSlice';
import { useAuth } from './hooks/auth/useAuth';
import AppRoutes from './routes/AppRoutes';

const App: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  useAuth();

  useEffect(() => {
    const theme = Cookies.get('theme');
    if (theme) {
      const isDarkMode = theme === 'dark';
      dispatch(setTheme(isDarkMode));
      document.documentElement.classList.toggle('dark', isDarkMode);
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
