// ModeToggleButton.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../../Redux-slices/themeSlice/themeSlice';
import Cookies from 'js-cookie';
import { RootState, AppDispatch } from '../../../store'; // Adjust the path as needed
import { Moon, Sun } from 'lucide-react';


const ModeToggleButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);

  const handleToggle = () => {
    const newTheme = !isDarkMode;
    document.documentElement.classList.toggle('dark');
    dispatch(toggleTheme());
    Cookies.set('theme', newTheme ? 'dark' : 'light', { expires: 7 }); // Store theme in a cookie for 7 days
  };

  return (
    <button onClick={handleToggle}>
      {isDarkMode ?  <Moon/> : <Sun/>}
    </button>
  );
};

export default ModeToggleButton;
