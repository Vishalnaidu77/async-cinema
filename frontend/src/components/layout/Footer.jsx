import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-logo">AsyncCinema</h3>
          <p>Your ultimate destination for movies and TV shows. Discover, watch, and enjoy!</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/movies">Movies</Link></li>
            <li><Link to="/tv">TV Shows</Link></li>
            <li><Link to="/people">People</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Account</h4>
          <ul>
            <li><Link to="/favorites">My Favorites</Link></li>
            <li><Link to="/history">Watch History</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Sign Up</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <div className="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MovieFlix. All rights reserved.</p>
        <p>Data provided by <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">TMDB</a></p>
      </div>
    </footer>
  );
};

export default Footer;
