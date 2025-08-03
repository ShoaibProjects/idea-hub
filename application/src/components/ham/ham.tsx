import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { toggleMenu } from './../../Redux-slices/hamSlice/hamSlice';
import { ReactComponent as CrossIcon } from './../../assets/icons/cross.svg';
import { ReactComponent as BarsIcon } from '../../assets/icons/bars.svg';
import './ham.scss';

function Ham() {
  const sharedState = useSelector((state: RootState) => state.ham.sharedState);
  const dispatch: AppDispatch = useDispatch();

  const crossIconStyle = {
    transform: sharedState ? 'scale(1)' : 'scale(0)',
    transition: 'transform 0.5s ease-in-out',
  };

  const barIconStyle = {
    transform: sharedState ? 'scale(0)' : 'scale(1)',
    transition: 'transform 0.5s ease-in-out',
  };

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(toggleMenu());
  };

  return (
    <button className="hamburger-button" onClick={handleClick}>
      {sharedState ? (
        <CrossIcon className="imp-icon" style={crossIconStyle} />
      ) : (
        <BarsIcon className="imp-icon" style={barIconStyle} />
      )}
    </button>
  );
}

export default Ham;