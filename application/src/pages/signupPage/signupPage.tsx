import React from "react";
import Signup from "../../components/Auth/SignupForm/SignupForm";
import MainLayout from "../../MainLayout";
const SignupPage: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Signup></Signup>
      </MainLayout>
    </>
  );
};

export default SignupPage;
