import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaFacebook, FaGithub, FaHome, FaLinkedin } from "react-icons/fa";
import { SiBuzzfeed } from "react-icons/si";
import { Settings } from 'lucide-react';
import './menuStuff.scss'; // Import the CSS file
import { useSelector } from 'react-redux';
import { selectUser } from '../../Auth/userSlice';
import { FaSquareXTwitter } from 'react-icons/fa6';
import CreateBtn from '../../Buttons/CreateBtn/CreateBtn';
import LoginButton from '../../Buttons/loginBtn/LoginBtn';
import UserBtn from '../../Buttons/UserBtn/UserBtn';
import AccountBtn from '../../accountStuff/accountBtnFolder/accountBtn';
import ModeToggleButton from '../../Buttons/ModeBtn/ModeToggleButton';

const MEnuStuff: React.FC = () => {
    const user = useSelector(selectUser);
    return (
        <div>
            <nav className="menu-container" tabIndex={0}>
                <NavLink
                    className={({ isActive }) =>
                        `menu-link ${isActive ? 'active' : ''}`
                    }
                    to="/"
                    end
                    style={({isActive})=>({filter:isActive?'brightness(1.1)':'brightness(0.65)',transform: isActive ? 'scale(1.1)' : 'scale(1)',transformOrigin: 'left',transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55), filter 0.3s ease'})}
                >
                    <FaHome className="icon" /> Home
                </NavLink>
                <NavLink
                    className={({ isActive }) =>
                        `menu-link ${isActive ? 'active' : ''}`
                    }
                    to="/trending"
                    style={({isActive})=>({filter:isActive?'brightness(1.1)':'brightness(0.65)',transform: isActive ? 'scale(1.1)' : 'scale(1)',transformOrigin: 'left',transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55), filter 0.3s ease'})}
                >
                    <SiBuzzfeed className="icon" /> Trending
                </NavLink>
                <NavLink
                    className={({ isActive }) =>
                        `menu-link ${isActive ? 'active' : ''}`
                    }
                    to="/settings"
                    style={({isActive})=>({filter:isActive?'brightness(1.1)':'brightness(0.65)',transform: isActive ? 'scale(1.1)' : 'scale(1)',transformOrigin: 'left',transition: 'transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55), filter 0.3s ease'})}
                >
                    <Settings size={19} className="icon" /> Settings
                </NavLink>
                {/* <NavLink
                    className={({ isActive }) =>
                        `menu-link ${isActive ? 'active' : ''}`
                    }
                    to="/faq"
                >
                    <FcFaq className="icon" /> FAQ
                </NavLink> */}
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
                  <div className="h-icons-cont">
          <AccountBtn></AccountBtn>
          <ModeToggleButton/>
        </div>
    </div>
    <div className='footer footer-menu'>
      <p>&copy; 2024 Shoaib Akhtar</p>
      <div className='social-icons'>
        <a href=""><FaFacebook></FaFacebook></a>
        <a href=""><FaSquareXTwitter></FaSquareXTwitter></a>
        <a href=""><FaLinkedin></FaLinkedin></a>
        <a href=""><FaGithub></FaGithub></a>
      </div>
    </div>
        </div>
    );
};

export default MEnuStuff;
