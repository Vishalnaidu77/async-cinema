import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { FaSearch, FaBars, FaTimes, FaUser, FaHeart, FaHistory, FaCog, FaMoon } from 'react-icons/fa';
import { LuSun } from "react-icons/lu";
import './Navbar.css';
import { useContext } from 'react';
import { themeContextData } from '../../context/ThemeContext';
import { useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, setTheme } = useContext(themeContextData)


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    console.log(document.documentElement.getAttribute('data-theme'));
  }, [theme])

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">AsyncCinema</span>
        </Link>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/movies" className="nav-link" onClick={() => setIsOpen(false)}>Movies</Link>
          <Link to="/tv" className="nav-link" onClick={() => setIsOpen(false)}>TV Shows</Link>
          <Link to="/people" className="nav-link" onClick={() => setIsOpen(false)}>People</Link>

          <form className="nav-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <FaSearch />
            </button>
          </form> 
        </div>
        <div className="user">
          <div className="theme-toggle" onClick={() => {
            theme === "dark" ? setTheme('light') : setTheme('dark')
          }}>
            {theme === "dark" ? <LuSun /> : <FaMoon /> }            
          </div>
          {user ? (
            <div className="nav-user">
              <Link to="/favorites" className="nav-link" onClick={() => setIsOpen(false)}>
                <FaHeart /> Favorites
              </Link>
              <Link to="/history" className="nav-link" onClick={() => setIsOpen(false)}>
                <FaHistory /> History
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link admin-link" onClick={() => setIsOpen(false)}>
                  <FaCog /> Admin
                </Link>
              )}
              <div className="user-dropdown">
                <span className="user-name">
                  <FaUser /> {user.name}
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-link" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="nav-link btn-register" onClick={() => setIsOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
        

        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
