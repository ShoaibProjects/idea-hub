import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { SiBuzzfeed } from "react-icons/si";
import { Settings } from 'lucide-react';
import './menuStuff.scss'; // Import the CSS file

const MEnuStuff: React.FC = () => {
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
                    <Settings className="icon" /> Settings
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
        </div>
    );
};

export default MEnuStuff;
