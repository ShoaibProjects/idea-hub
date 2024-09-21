import React from 'react';
import Navbar from '../../components/navbar/navbar';
import LeftAside from '../../components/left-aside/leftAside';
import RightAside from '../../components/right-aside/rightAside';
import MainCont from '../../components/main-cont/main/main-cont';
import './home.scss'

const Home: React.FC = () => {
  return (
    <>
    <div>
      <Navbar/>
      <main>
        <LeftAside></LeftAside>
        <RightAside></RightAside>
        <MainCont></MainCont>
      </main>
    </div>
    </>
  );
}

export default Home;
