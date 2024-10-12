import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './Settings.scss';

// Define the interface for your component props
interface SettingsProps {
    onClose: () => void;
}

// Functional component with props typed
const Settings: React.FC = () => {
  // Component logic can go here
  const location = useLocation();

  // Check if the current route is the main settings route
  const isMainSettings = location.pathname === '/settings';
  return (
    <div className="setting-cont">
      {/* Conditionally show links only if the user is on the main settings page */}
      {isMainSettings && (
        <nav className="settings-nav">
          <Link to="AccountSettings">Account Settings</Link>
          <Link to="preferences">Preferences</Link>
          <Link to="language-settings">Language Settings</Link>
        </nav>
      )}

      {/* Render the content for the selected setting */}
      <div className="settings-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Settings;


