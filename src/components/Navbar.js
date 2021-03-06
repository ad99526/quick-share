import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../store/actions/userActions";
import { useOnlineStatus, useWindowSize } from "../utils/customHooks";
import SearchBar from "./SearchBar";
import { CreatePostIcon, LogoutIcon, ProfileIcon } from "./Svg";
const NavBar = () => {
  const token = localStorage.getItem("jwt");
  const { width } = useWindowSize();
  const isOnline = useOnlineStatus();
  const dispatch = useDispatch();
  return (
    token && (
      <>
        <div className="nav-container">
          <nav className="nav">
            <div className="logo">
              <Link to="/">
                <img
                  src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                  alt="instagram logo"
                  className="logo-img"
                />
              </Link>
            </div>
            <SearchBar className={`${width < 600 ? "ps-ab top-90" : ""}`} />
            <div className="nav-links">
              {/* <Link to="/myfollowingpost">
                <div>
                  <ExploreBtn />
                </div>
              </Link> */}
              <Link to="/create">
                <div>
                  <CreatePostIcon />
                </div>
              </Link>
              <Link to="/profile">
                <div className="fl-ct">
                  <ProfileIcon />
                  <div
                    title={`${isOnline ? "online" : "offline"}`}
                    className={`isOnline ${isOnline ? "lg" : "gy"}`}
                  />
                </div>
              </Link>
              <Link to="/signin">
                <div onClick={() => dispatch(logout())}>
                  <LogoutIcon />
                </div>
              </Link>
            </div>
          </nav>
        </div>
      </>
    )
  );
};

export default NavBar;
