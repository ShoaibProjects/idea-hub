import React from 'react';
import Navbar from '../../components/navbar/navbar';
import LeftAside from '../../components/left-aside/leftAside';
import UserProfile from '../../components/userProfile/userProfile';

const ProfilePage: React.FC = () => {
  return (
    <>
    <div>
      <Navbar/>
      <main>
        <LeftAside></LeftAside>
        {/* <RightAside></RightAside> */}
        <UserProfile></UserProfile>
      </main>
    </div>
    </>
  );
}

export default ProfilePage;
