import React from "react";
import MainCont from "../../components/main-cont/main/main-cont";
import Signin from "../../components/Auth/signinForm/signinForm";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../../hooks/auth/userSlice";
import "./home.scss";
import MainLayout from "../../MainLayout";

const Home: React.FC = () => {
  const authStatus = useSelector(selectIsAuthenticated);
  return (
    <>
      <MainLayout>
        {authStatus ? <MainCont></MainCont> : <Signin></Signin>}
      </MainLayout>
    </>
  );
};

export default Home;
