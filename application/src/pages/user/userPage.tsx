import React from "react";
import UserCont from "../../components/userDashBoard/userDashBoard";
import MainLayout from "../../MainLayout";
const UserPage: React.FC = () => {
  return (
    <>
      <MainLayout>
        <UserCont></UserCont>
      </MainLayout>
    </>
  );
};

export default UserPage;
