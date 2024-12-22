import React, { useEffect } from 'react';
import Navbar from '../../components/navbar/navbar';
import LeftAside from '../../components/left-aside/leftAside';
import MainCont from '../../components/main-cont/main/main-cont';
import Signin from '../../components/Auth/signinForm/signinForm';
import { useSelector} from 'react-redux';
import { selectIsAuthenticated } from '../../components/Auth/userSlice';
import Menu from '../../components/navbar/menu/menu';
import './home.scss'
import {  useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store'; // Import RootState & AppDispatch types
import { toggleMenu } from './../../Redux-slices/hamSlice/hamSlice'; // Import toggleMenu action

const Home: React.FC = () => {
  // const user = useSelector(selectUser);
    const sharedState = useSelector((state: RootState) => state.ham.sharedState); // Access Redux state
    const dispatch: AppDispatch = useDispatch();
    useEffect(() => {
      if (sharedState){
        setTimeout(() => {
          dispatch(toggleMenu())
        }, 1);
      }
    }, []);
  const authStatus = useSelector(selectIsAuthenticated);
  return (
    <>
    <div>
      <Navbar/>
      <main>
        <LeftAside></LeftAside>
        {/* <RightAside></RightAside> */}
        <Menu></Menu>
        {authStatus?<MainCont></MainCont>:<Signin></Signin>}
      </main>
    </div>
    </>
  );
}

export default Home;
