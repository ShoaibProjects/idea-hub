import React from 'react';
import Navbar from '../../components/navbar/navbar';
import LeftAside from '../../components/left-aside/leftAside';
import RightAside from '../../components/right-aside/rightAside';
import Settings from '../../components/Settings/Settings';

const SettingsPage: React.FC = () => {
  return (
    <>
    <div>
      <Navbar/>
      <main>
        <LeftAside></LeftAside>
        <RightAside></RightAside>
        <Settings></Settings>
      </main>
    </div>
    </>
  );
}

export default SettingsPage;
