import SearchComponent from "./search/search";
import './navbar.scss';
import Logo from './logo';
import AccountBtn from "../accountStuff/accountBtnFolder/accountBtn";
import ModeToggleButton from "../Buttons/ModeBtn/ModeToggleButton";
import Ham from "../ham/ham";
import { useSelector } from "react-redux";


const Navbar = () => {
  const isModalOpen = useSelector((state: any) => state.search.isOpen);
  return (
    <>
      <div className='nav-cont'>
        <div className={`logo-outer-cont ${isModalOpen ? '' : ''}`}>
          <div className='logo-inner-cont'><Logo className='logo'></Logo><span>IdeaHub</span></div>
        </div>
        <div className="transparent-cont">
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
          <ModeToggleButton/>
          <Ham/>
        </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
