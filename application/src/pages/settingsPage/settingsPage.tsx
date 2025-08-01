import React from "react";
import Settings from "../../components/Settings/Settings";
import MainLayout from "../../MainLayout";

const SettingsPage: React.FC = () => {
  return (
    <>
      <MainLayout>
        <Settings></Settings>
      </MainLayout>
    </>
  );
};

export default SettingsPage;
