import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { MdPerson } from "react-icons/md";
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
import logoIcon from '../../assets/logo.png';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

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
          <img src={logoIcon} alt="Logo" className="logo-icon" />
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
                  <span className="nav-label">{item.label}</span>
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
                <span className="nav-label">{item.label}</span>
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
                <span className="nav-label">Dashboard</span>
              </Link>
            </nav>
          </div>
        )}

        {/* Following Section */}
      </div>

      {/* Bottom Section */}
      <div className="sidebar-footer">
        {user ? (
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt className="nav-icon" />
            <span className="nav-label">Log Out</span>
          </button>
        ) : (
          <Link to="/login" className="login-btn">
            <div className="login-icon"><MdPerson/></div>
            <span className="nav-label">Sign In</span>
          </Link>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
