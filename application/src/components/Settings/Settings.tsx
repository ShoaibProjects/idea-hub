import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './Settings.scss';
import { IoMdSettings } from "react-icons/io";
import { MdManageAccounts } from "react-icons/md";
import { Settings2 } from 'lucide-react';
// import { IoLanguage } from "react-icons/io5";

const Settings: React.FC = () => {
  const location = useLocation();
  const isMainSettings = location.pathname === '/settings';

  return (
    <div className="setting-cont">
      <div className='set-cont'>
        <h2><IoMdSettings></IoMdSettings>Settings</h2>
      {isMainSettings && (
        <nav className="settings-nav">
          <Link to="AccountSettings" className="nav-link"><MdManageAccounts size={25}></MdManageAccounts>Account Settings</Link>
          <Link to="preferences" className="nav-link"><Settings2></Settings2>Preferences</Link>
          {/* <Link to="language-settings" className="nav-link"><IoLanguage size={25}></IoLanguage>Language Settings</Link> */}
        </nav>
      )}

      <div className="settings-content">
        <Outlet />
      </div>
      </div>
    </div>
  );
};

export default Settings;
