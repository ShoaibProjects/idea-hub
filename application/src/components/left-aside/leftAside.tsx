import { Home, Settings,  TrendingUp } from "lucide-react";
import { NavLink } from "react-router-dom";
import './leftAside.scss';

import CreateBtn from '../Buttons/CreateBtn/CreateBtn';
import UserBtn from '../Buttons/UserBtn/UserBtn';
import { selectUser } from '../../hooks/auth/userSlice';
import { useSelector } from 'react-redux';
import LoginButton from '../Buttons/loginBtn/LoginBtn';
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6"; 
import { FaGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

function LeftAside() {
    const user = useSelector(selectUser);
  return (
    <div className='leftAside-cont'>
        <nav className="nav">
            <NavLink className="nav-link" to="/" end style={({isActive})=>({color:isActive?'var(--text-color)':'rgb(130 140 160)'})}>
               <Home/>Home
            </NavLink>
            <NavLink className="nav-link" to="/trending" style={({isActive})=>({color:isActive?'var(--text-color)':'rgb(140 150 160)'})}>
                <TrendingUp/>Trending
            </NavLink>
            <NavLink className="nav-link" to="/settings" style={({isActive})=>({color:isActive?'var(--text-color)':'rgb(140 150 160)'})}>
                <Settings/>Settings
            </NavLink>
        </nav>
        <div className='rightAside-cont-imp'>
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
    <div className='footer'>
      <p>&copy; 2024 Shoaib Akhtar</p>
      <div className='social-icons'>
        <a href="https://www.facebook.com/profile.php?id=100086582017751"><FaFacebook></FaFacebook></a>
        <a href="https://x.com/ShoaibSDE"><FaSquareXTwitter></FaSquareXTwitter></a>
        <a href="https://www.linkedin.com/in/shoaib-akhtar-117329252/"><FaLinkedin></FaLinkedin></a>
        <a href="https://github.com/ShoaibProjects"><FaGithub></FaGithub></a>
      </div>
    </div>
    </div>
  )
}

export default LeftAside