import React from "react";
import Signin from "../../components/Auth/signinForm/signinForm";
import MainLayout from "../../MainLayout";
const SigninPage: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Signin></Signin>
      </MainLayout>
    </>
  );
};

export default SigninPage;
