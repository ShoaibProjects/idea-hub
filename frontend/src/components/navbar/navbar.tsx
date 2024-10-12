import { Bell, Home, Lightbulb, MessageSquare, Search, Settings, X, Moon } from "lucide-react";
import SearchComponent from "./search/search";
import './Navbar.scss';
import Logo from './logo';
import AccountBtn from "../accountStuff/accountBtnFolder/accountBtn";

const Navbar = () => {
  return (
    <>
      <div className='nav-cont'>
        <div className="logo-outer-cont">
          <div className='logo-inner-cont'><Logo className='logo'></Logo><span>IdeaHub</span></div>
        </div>
        <div className="search-outer-cont">
        {/* <div className="search-cont">
          <input type="search" placeholder='Search ideas...' className="searchBar"/>
          <Search className="mag-glass"/>
        </div> */}
        <SearchComponent></SearchComponent>
        </div>
        <div className="h-icons-cont">
          {/* <button><Bell/></button> */}
          <AccountBtn></AccountBtn>
          <button><Moon/></button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
