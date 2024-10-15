import React from 'react';
import { Link } from 'react-router-dom';


const LoginButton: React.FC = () => {

  return (
    <Link to={'/signin'}>
    <button >
      Log in
    </button></Link>
  );
};

export default LoginButton;
