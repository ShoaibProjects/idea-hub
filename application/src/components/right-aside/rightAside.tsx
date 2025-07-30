import './rightAside.scss';
import CreateBtn from '../Buttons/CreateBtn/CreateBtn';
import UserBtn from '../Buttons/UserBtn/UserBtn';
import { selectUser } from '../../hooks/auth/userSlice';
import { useSelector } from 'react-redux';
import LoginButton from '../Buttons/loginBtn/LoginBtn';

function RightAside() {
  const user = useSelector(selectUser);
  return (
    <div className='rightAside-cont'>
      {
        user.username?(
          <>
            <CreateBtn></CreateBtn>
            <UserBtn></UserBtn>
          </>
        ):(
          <LoginButton></LoginButton>
        )
      }
    </div>
  )
}

export default RightAside