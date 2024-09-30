import React from 'react';
import Navbar from '../../components/navbar/navbar';
import LeftAside from '../../components/left-aside/leftAside';
import RightAside from '../../components/right-aside/rightAside';
import Signup from '../../components/Auth/SignupForm/SignupForm';
const SignupPage: React.FC = () => {
  return (
    <>
    <div>
      <Navbar/>
      <main>
        <LeftAside></LeftAside>
        <RightAside></RightAside>
        <Signup></Signup>
      </main>
    </div>
    </>
  );
}

export default SignupPage;
