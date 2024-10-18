import React from 'react';
import Navbar from '../../components/navbar/navbar';
import LeftAside from '../../components/left-aside/leftAside';
import RightAside from '../../components/right-aside/rightAside';
import Signin from '../../components/Auth/signinForm/signinForm';
const SigninPage: React.FC = () => {
  return (
    <>
    <div>
      <Navbar/>
      <main>
        <LeftAside></LeftAside>
        {/* <RightAside></RightAside> */}
        <Signin></Signin>
      </main>
    </div>
    </>
  );
}

export default SigninPage;
