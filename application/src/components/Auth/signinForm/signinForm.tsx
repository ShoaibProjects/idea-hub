import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useSigninForm } from '../../../hooks/auth/useSigninForm';
import './signinForm.scss';

const Signin = () => {
  const {
    username,
    setUsername,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    error,
    isLoading,
    handleSignin,
  } = useSigninForm();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className='signin-form-cont'>
      {/* Use the <form> element with onSubmit */}
      <form className='signin-form' onSubmit={handleSignin}>
        <h2>Login</h2>
        <p>Welcome back! Please enter your details.</p>
        {error && <div className='error'>{error}</div>}

        <div>
          <label htmlFor="username">Username: </label>
          <input
            id='username'
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password: </label>
          <div className="password-input">
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
            </span>
          </div>
        </div>

        <label className='remember'>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span> </span>Remember Me
        </label>
        
        {/* Disable button while loading */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <p className='signup-prompt'>Doesn't have an Account yet?</p>
        <Link to={`/signup`}>Sign Up!</Link>
        <Link to={`/signup`} className='guest-signup'>OR continue as a Guest User</Link>
      </form>
    </div>
  );
};

export default Signin;