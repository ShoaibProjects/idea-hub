import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store'; 
import { toggleMenu } from './../../Redux-slices/hamSlice/hamSlice'; 
import { ReactComponent as CrossIcon } from './../../assets/icons/cross.svg';
import { ReactComponent as BarsIcon } from '../../assets/icons/bars.svg';
import './ham.scss' 

function Ham() {
  const sharedState = useSelector((state: RootState) => state.ham.sharedState);
  const dispatch: AppDispatch = useDispatch(); // 
  const [BarIconStyle, setBarIconStyle] = useState<{ transform: string; transition?: string }>({ transform: 'scale(0)' });
  const [CrossIconStyle, setCrossIconStyle] = useState<{ transform: string; transition?: string }>({ transform: 'scale(1)' });

  useEffect(() => {
    if (sharedState) {
      setBarIconStyle({ transform: 'scale(0)', transition: 'transform 0.5s ease-in-out' });
      setCrossIconStyle({ transform: 'scale(1)', transition: 'transform 0.5s ease-in-out' });
    } else {
      setBarIconStyle({ transform: 'scale(1)', transition: 'transform 0.5s ease-in-out' });
      setCrossIconStyle({ transform: 'scale(0)', transition: 'transform 0.5s ease-in-out' });
    }
  }, [sharedState]);

  return (
    <button className="hamburger-button" onClick={() => dispatch(toggleMenu())}>
      {sharedState ? <CrossIcon className='imp-icon' style={CrossIconStyle} /> : <BarsIcon className='imp-icon' style={BarIconStyle} />}
    </button>
  );
}

export default Ham;
