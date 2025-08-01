import React from "react";
import TrendCont from "../../components/main-cont/trending-main/trending";
import MainLayout from "../../MainLayout";

const TrendPage: React.FC = () => {
  return (
    <>
      <MainLayout>
        <TrendCont></TrendCont>
      </MainLayout>
    </>
  );
};

export default TrendPage;
