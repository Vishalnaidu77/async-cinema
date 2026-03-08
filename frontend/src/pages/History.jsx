import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getHistory, clearHistory } from '../store/slices/historySlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { FaHistory, FaTrash } from 'react-icons/fa';
import './History.css';

const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/200x300?text=No+Image';

const History = () => {
  const dispatch = useDispatch();
  const { history, isLoading } = useSelector((state) => state.history);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getHistory());
    }
  }, [dispatch, user]);

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your watch history?')) {
      dispatch(clearHistory());
      toast.success('Watch history cleared');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <Loader size={80} />;
  }

  return (
    <div className="history-page">
      <div className="page-header">
        <div className="header-left">
          <h1><FaHistory /> Watch History</h1>
          <p>Movies and shows you've recently viewed</p>
        </div>
        {history.length > 0 && (
          <button className="clear-history-btn" onClick={handleClearHistory}>
            <FaTrash /> Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <FaHistory className="empty-icon" />
          <h2>No watch history</h2>
          <p>Start exploring movies and TV shows!</p>
          <Link to="/movies" className="browse-btn">Browse Movies</Link>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <Link
              key={item._id}
              to={`/${item.mediaType}/${item.movieId}`}
              className="history-item"
            >
              <div className="history-poster">
                <img
                  src={
                    item.posterPath
                      ? `${IMAGE_BASE_URL}/w200${item.posterPath}`
                      : PLACEHOLDER_IMAGE
                  }
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
              </div>
              <div className="history-info">
                <h3>{item.title}</h3>
                <span className="history-type">
                  {item.mediaType === 'tv' ? 'TV Show' : 'Movie'}
                </span>
                <span className="history-date">
                  Watched: {formatDate(item.watchedAt)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
