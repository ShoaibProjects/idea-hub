import React from 'react';
import './rightAside.scss';
import CreateBtn from '../Buttons/CreateBtn/CreateBtn';
import UserBtn from '../Buttons/UserBtn/UserBtn';

function RightAside() {
  return (
    <div className='rightAside-cont'>
      <CreateBtn></CreateBtn>
      <UserBtn></UserBtn>
    </div>
  )
}

export default RightAside