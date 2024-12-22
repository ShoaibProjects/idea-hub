import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store'; // Import RootState type
import MEnuStuff from './menuStuff'; // Import the MEnuStuff component
import './menu.scss'; // Import the CSS file

const Menu: React.FC = () => {
  const sharedState = useSelector((state: RootState) => state.ham.sharedState);

  return (
    <div className={`menu-overlay ${sharedState ? 'active' : 'inactive'}`}>
      <MEnuStuff />
    </div>
  );
};

export default Menu;
