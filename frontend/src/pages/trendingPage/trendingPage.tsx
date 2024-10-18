import React from 'react';
import Navbar from '../../components/navbar/navbar';
import LeftAside from '../../components/left-aside/leftAside';
import RightAside from '../../components/right-aside/rightAside';
import TrendCont from '../../components/main-cont/trending-main/trending';

const TrendPage: React.FC = () => {
  return (
    <>
    <div>
      <Navbar/>
      <main>
        <LeftAside></LeftAside>
        {/* <RightAside></RightAside> */}
        <TrendCont></TrendCont>
      </main>
    </div>
    </>
  );
}

export default TrendPage;
