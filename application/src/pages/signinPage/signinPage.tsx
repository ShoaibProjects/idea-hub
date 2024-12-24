import React, { useEffect } from 'react';
import Navbar from '../../components/navbar/navbar';
import LeftAside from '../../components/left-aside/leftAside';
import Signin from '../../components/Auth/signinForm/signinForm';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMenu } from '../../Redux-slices/hamSlice/hamSlice';
import { RootState, AppDispatch } from '../../store';
import Menu from '../../components/navbar/menu/menu';
const SigninPage: React.FC = () => {
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
        <Menu></Menu>
        {/* <RightAside></RightAside> */}
        <Signin></Signin>
      </main>
    </div>
    </>
  );
}

export default SigninPage;
