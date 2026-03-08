import { useState,useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { 
  FaCompass, 
  FaHeart, 
  FaCalendarAlt, 
  FaSignOutAlt,
  FaFilm,
  FaTv,
  FaUsers,
  FaCog,
  FaChevronDown
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showFollowing, setShowFollowing] = useState(true);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/', icon: FaCompass, label: 'Browse' },
    { path: '/favorites', icon: FaHeart, label: 'Watchlist', auth: true },
    { path: '/history', icon: FaCalendarAlt, label: 'History', auth: true },
  ];

  const browseItems = [
    { path: '/movies', icon: FaFilm, label: 'Movies' },
    { path: '/tv', icon: FaTv, label: 'TV Shows' },
    { path: '/people', icon: FaUsers, label: 'People' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {/* Logo */}
        <Link to="/" className="sidebar-logo">
          <span className="logo-accent">Async</span>
          <span className="logo-text">.CINEMA</span>
        </Link>

        {/* Main Navigation */}
        <div className="sidebar-section">
          <span className="section-label">Menu</span>
          <nav className="sidebar-nav">
            {menuItems.map((item) => {
              if (item.auth && !user) return null;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                >
                  <item.icon className="nav-icon" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Browse Section */}
        <div className="sidebar-section">
          <span className="section-label">Browse</span>
          <nav className="sidebar-nav">
            {browseItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <item.icon className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <div className="sidebar-section">
            <span className="section-label">Admin</span>
            <nav className="sidebar-nav">
              <Link
                to="/admin"
                className={`nav-item ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
              >
                <FaCog className="nav-icon" />
                <span>Dashboard</span>
              </Link>
            </nav>
          </div>
        )}

        {/* Following Section */}
        {user && (
          <div className="sidebar-section following-section">
            <div 
              className="section-label clickable"
              onClick={() => setShowFollowing(!showFollowing)}
            >
              <span>Following</span>
              <FaChevronDown className={`chevron ${showFollowing ? 'open' : ''}`} />
            </div>
            {showFollowing && (
              <div className="following-list">
                <div className="following-item">
                  <div className="following-avatar">
                    <img src="https://i.pravatar.cc/40?img=1" alt="User" />
                    <span className="status-dot online"></span>
                  </div>
                  <span className="following-name">Movie Fan</span>
                </div>
                <div className="following-item">
                  <div className="following-avatar">
                    <img src="https://i.pravatar.cc/40?img=2" alt="User" />
                    <span className="status-dot"></span>
                  </div>
                  <span className="following-name">Film Buff</span>
                </div>
                <div className="following-item">
                  <div className="following-avatar">
                    <img src="https://i.pravatar.cc/40?img=3" alt="User" />
                    <span className="status-dot online"></span>
                  </div>
                  <span className="following-name">Cinema Lover</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="sidebar-footer">
        {user ? (
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt className="nav-icon" />
            <span>Log Out</span>
          </button>
        ) : (
          <Link to="/login" className="login-btn">
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
