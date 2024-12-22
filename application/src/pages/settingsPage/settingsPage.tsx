import React, { useEffect } from 'react';
import Navbar from '../../components/navbar/navbar';
import LeftAside from '../../components/left-aside/leftAside';
import Settings from '../../components/Settings/Settings';
import Menu from '../../components/navbar/menu/menu';
import { AppDispatch, RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMenu } from '../../Redux-slices/hamSlice/hamSlice';

const SettingsPage: React.FC = () => {
  const sharedState = useSelector((state: RootState) => state.ham.sharedState); // Access Redux state
  const dispatch: AppDispatch = useDispatch();
  useEffect(() => {
    if (sharedState){
      setTimeout(() => {
        dispatch(toggleMenu())
      }, 1);
    }
  }, []);
  return (
    <>
    <div>
      <Navbar/>
      <main>
        <LeftAside></LeftAside>
        {/* <RightAside></RightAside> */}
        <Menu></Menu>
        <Settings></Settings>
      </main>
    </div>
    </>
  );
}

export default SettingsPage;
