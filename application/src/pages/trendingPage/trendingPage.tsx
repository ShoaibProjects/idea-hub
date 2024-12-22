import React, { useEffect } from 'react';
import Navbar from '../../components/navbar/navbar';
import LeftAside from '../../components/left-aside/leftAside';
import TrendCont from '../../components/main-cont/trending-main/trending';
import {  useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store'; // Import RootState & AppDispatch types
import { toggleMenu } from './../../Redux-slices/hamSlice/hamSlice'; // Import toggleMenu action
import Menu from '../../components/navbar/menu/menu';

const TrendPage: React.FC = () => {
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
        <TrendCont></TrendCont>
      </main>
    </div>
    </>
  );
}

export default TrendPage;
