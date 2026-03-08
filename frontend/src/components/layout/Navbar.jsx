import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { FaSearch, FaBars, FaBell, FaUser, FaMoon, FaCog, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { LuSun } from "react-icons/lu";
import './Navbar.css';
import { themeContextData } from '../../context/ThemeContext';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, setTheme } = useContext(themeContextData);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    navigate('/');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <nav className="topbar">
      <div className="topbar-container">
        {/* Search Bar */}
        <form className="topbar-search" onSubmit={handleSearch}>
          
          <input
            type="text"
            placeholder="Search everything"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="search-icon" />
        </form>

        {/* Right Section */}
        <div className="topbar-right">
          {/* Theme Toggle */}
          <button 
            className="topbar-icon-btn"
            onClick={() => setTheme(theme === "dark" ? 'light' : 'dark')}
          >
            {theme === "dark" ? <LuSun /> : <FaMoon />}
          </button>

          {/* Notifications */}
          <button className="topbar-icon-btn">
            <FaBell />
          </button>

          {/* User */}
          {user ? (
            <div className="topbar-user">
              <button 
                className="user-avatar-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e50914&color=fff`} 
                  alt={user.name}
                  className="user-avatar"
                />
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-header">
                    <span className="dropdown-name">{user.name}</span>
                    <span className="dropdown-email">{user.email}</span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link to="/favorites" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    Watchlist
                  </Link>
                  <Link to="/history" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    History
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      Admin Panel
                    </Link>
                  )}
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="topbar-login-btn">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
