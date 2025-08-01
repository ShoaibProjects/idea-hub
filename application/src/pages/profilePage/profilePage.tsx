import React from "react";
import UserProfile from "../../components/userProfile/userProfile";
import MainLayout from "../../MainLayout";

const ProfilePage: React.FC = () => {
  return (
    <>
      <MainLayout>
        <UserProfile></UserProfile>
      </MainLayout>
    </>
  );
};

export default ProfilePage;
