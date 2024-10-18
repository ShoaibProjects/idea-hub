import React from 'react';
import Navbar from '../../components/navbar/navbar';
import LeftAside from '../../components/left-aside/leftAside';
import RightAside from '../../components/right-aside/rightAside';
import MainCont from '../../components/main-cont/main/main-cont';
import Signin from '../../components/Auth/signinForm/signinForm';
import { useSelector} from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../../components/Auth/userSlice';
import './home.scss'

const Home: React.FC = () => {
  const user = useSelector(selectUser);
  const authStatus = useSelector(selectIsAuthenticated);
  return (
    <>
    <div>
      <Navbar/>
      <main>
        <LeftAside></LeftAside>
        {/* <RightAside></RightAside> */}
        {authStatus?<MainCont></MainCont>:<Signin></Signin>}
      </main>
    </div>
    </>
  );
}

export default Home;
