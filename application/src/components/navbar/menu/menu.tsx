import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store'; 
import MEnuStuff from './menuStuff'; 
import './menu.scss';

const Menu: React.FC = () => {
  const sharedState = useSelector((state: RootState) => state.ham.sharedState);

  return (
    <div className={`menu-overlay ${sharedState ? 'active' : 'inactive'}`}>
      <MEnuStuff />
    </div>
  );
};

export default Menu;
