import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './MovieCard.css';

const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x450?text=No+Image';

const MovieCard = ({ movie, mediaType = 'movie' }) => {
  const {
    id,
    title,
    name,
    poster_path,
    posterPath,
    vote_average,
    rating,
    release_date,
    first_air_date,
    releaseDate,
    media_type
  } = movie;

  const displayTitle = title || name;
  const type = media_type || mediaType;
  const posterUrl = poster_path || posterPath
    ? `${IMAGE_BASE_URL}/w500${poster_path || posterPath}`
    : PLACEHOLDER_IMAGE;
  const voteRating = vote_average || rating || 0;
  const date = release_date || first_air_date || releaseDate || '';
  const year = date ? new Date(date).getFullYear() : '';

  return (
    <Link to={`/${type}/${id}`} className="movie-card">
      <div className="movie-card-poster">
        <img
          src={posterUrl}
          alt={displayTitle}
          loading="lazy"
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />
        <div className="movie-card-overlay">
          <span className="view-details">View Details</span>
        </div>
        {voteRating > 0 && (
          <div className="movie-card-rating">
            <FaStar /> {voteRating.toFixed(1)}
          </div>
        )}
      </div>
      <div className="movie-card-info">
        <h3 className="movie-card-title">{displayTitle || 'Unknown Title'}</h3>
        {year && <span className="movie-card-year">{year}</span>}
      </div>
    </Link>
  );
};

export default MovieCard;
