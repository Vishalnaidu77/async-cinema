import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaFilm, FaUsers, FaCog } from 'react-icons/fa';
import './Admin.css';

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><FaCog /> Admin Dashboard</h1>
        <p>Welcome, {user?.name}! Manage your movie platform.</p>
      </div>

      <div className="admin-cards">
        <Link to="/admin/movies" className="admin-card">
          <div className="admin-card-icon">
            <FaFilm />
          </div>
          <div className="admin-card-info">
            <h3>Manage Movies</h3>
            <p>Add, edit, or delete movies from the database</p>
          </div>
        </Link>

        <Link to="/admin/users" className="admin-card">
          <div className="admin-card-icon">
            <FaUsers />
          </div>
          <div className="admin-card-info">
            <h3>Manage Users</h3>
            <p>View, ban, or delete user accounts</p>
          </div>
        </Link>
      </div>

      <div className="admin-info-section">
        <h2>Quick Stats</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Platform Features</h4>
            <ul>
              <li>TMDB API Integration</li>
              <li>User Authentication</li>
              <li>Favorites & Watch History</li>
              <li>Custom Movie Management</li>
            </ul>
          </div>
          <div className="stat-card">
            <h4>Admin Capabilities</h4>
            <ul>
              <li>Add custom movies with trailers</li>
              <li>Edit movie information</li>
              <li>Delete movies from database</li>
              <li>Manage user accounts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
