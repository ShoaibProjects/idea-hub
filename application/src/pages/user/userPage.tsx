import React from 'react';
import Navbar from '../../components/navbar/navbar';
import LeftAside from '../../components/left-aside/leftAside';
import UserCont from '../../components/userDashBoard/userDashBoard';
const UserPage: React.FC = () => {
  return (
    <>
    <div>
      <Navbar/>
      <main>
        <LeftAside></LeftAside>
        {/* <RightAside></RightAside> */}
        <UserCont></UserCont>
      </main>
    </div>
    </>
  );
}

export default UserPage;
