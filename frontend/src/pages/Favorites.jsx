import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getFavorites, removeFavorite } from '../store/slices/favoriteSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { FaHeart, FaStar, FaTrash } from 'react-icons/fa';
import './Favorites.css';

const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/200x300?text=No+Image';

const Favorites = () => {
  const dispatch = useDispatch();
  const { favorites, isLoading } = useSelector((state) => state.favorites);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getFavorites());
    }
  }, [dispatch, user]);

  const handleRemove = (movieId, mediaType, title) => {
    dispatch(removeFavorite({ movieId, mediaType }));
    toast.success(`Removed "${title}" from favorites`);
  };

  if (isLoading) {
    return <Loader size={80} />;
  }

  return (
    <div className="favorites-page">
      <div className="page-header">
        <h1><FaHeart /> My Favorites</h1>
        <p>Movies and shows you've added to your favorites</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <FaHeart className="empty-icon" />
          <h2>No favorites yet</h2>
          <p>Start adding movies and TV shows to your favorites!</p>
          <Link to="/movies" className="browse-btn">Browse Movies</Link>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((item) => (
            <div key={`${item.movieId}-${item.mediaType}`} className="favorite-card">
              <Link to={`/${item.mediaType}/${item.movieId}`}>
                <div className="favorite-poster">
                  <img
                    src={
                      item.posterPath
                        ? `${IMAGE_BASE_URL}/w500${item.posterPath}`
                        : PLACEHOLDER_IMAGE
                    }
                    alt={item.title}
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                  {item.rating > 0 && (
                    <div className="favorite-rating">
                      <FaStar /> {item.rating.toFixed(1)}
                    </div>
                  )}
                </div>
              </Link>
              <div className="favorite-info">
                <h3>{item.title}</h3>
                <span className="favorite-type">{item.mediaType === 'tv' ? 'TV Show' : 'Movie'}</span>
              </div>
              <button
                className="remove-btn"
                onClick={() => handleRemove(item.movieId, item.mediaType, item.title)}
              >
                <FaTrash /> Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
