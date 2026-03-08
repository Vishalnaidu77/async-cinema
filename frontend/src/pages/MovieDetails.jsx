import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getMovieDetails, getVideos, clearCurrentMovie } from '../store/slices/movieSlice';
import { addFavorite, removeFavorite } from '../store/slices/favoriteSlice';
import { addToHistory } from '../store/slices/historySlice';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import TrailerModal from '../components/TrailerModal';
import { FaPlay, FaHeart, FaRegHeart, FaStar, FaClock, FaCalendar } from 'react-icons/fa';
import './MovieDetails.css';

const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/500x750?text=No+Image';

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const mediaType = location.pathname.includes('/tv/') ? 'tv' : 'movie';

  const { currentMovie, videos, isLoading } = useSelector((state) => state.movies);
  const { user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);

  const [showTrailer, setShowTrailer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    dispatch(getMovieDetails({ id, mediaType }));
    dispatch(getVideos({ id, mediaType }));

    return () => {
      dispatch(clearCurrentMovie());
    };
  }, [dispatch, id, mediaType]);

  // Add to watch history when page loads
  useEffect(() => {
    if (currentMovie && user) {
      dispatch(addToHistory({
        movieId: currentMovie.id,
        mediaType,
        title: currentMovie.title || currentMovie.name,
        posterPath: currentMovie.poster_path
      }));
    }
  }, [currentMovie, user, dispatch, mediaType]);

  // Check if in favorites
  useEffect(() => {
    if (currentMovie && favorites) {
      const found = favorites.some(
        (fav) => fav.movieId === currentMovie.id && fav.mediaType === mediaType
      );
      setIsFavorite(found);
    }
  }, [currentMovie, favorites, mediaType]);

  const handleToggleFavorite = () => {
    if (!user) {
      toast.info('Please login to add favorites');
      return;
    }

    if (isFavorite) {
      dispatch(removeFavorite({ movieId: currentMovie.id, mediaType }));
      toast.success('Removed from favorites');
    } else {
      dispatch(addFavorite({
        movieId: currentMovie.id,
        mediaType,
        title: currentMovie.title || currentMovie.name,
        posterPath: currentMovie.poster_path,
        releaseDate: currentMovie.release_date || currentMovie.first_air_date,
        rating: currentMovie.vote_average
      }));
      toast.success('Added to favorites');
    }
  };

  const trailer = videos.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  const handlePlayTrailer = () => {
    if (trailer) {
      setShowTrailer(true);
      // Add to history when watching trailer
      if (user) {
        dispatch(addToHistory({
          movieId: currentMovie.id,
          mediaType,
          title: currentMovie.title || currentMovie.name,
          posterPath: currentMovie.poster_path
        }));
      }
    } else {
      toast.info('Trailer for this movie is currently unavailable.');
    }
  };

  if (isLoading || !currentMovie) {
    return <Loader size={80} />;
  }

  const {
    title,
    name,
    poster_path,
    backdrop_path,
    overview,
    vote_average,
    release_date,
    first_air_date,
    runtime,
    episode_run_time,
    genres,
    credits,
    similar,
    recommendations
  } = currentMovie;

  const displayTitle = title || name || 'Unknown Title';
  const posterUrl = poster_path ? `${IMAGE_BASE_URL}/w500${poster_path}` : PLACEHOLDER_IMAGE;
  const backdropUrl = backdrop_path ? `${IMAGE_BASE_URL}/original${backdrop_path}` : '';
  const releaseYear = (release_date || first_air_date || '').split('-')[0];
  const movieRuntime = runtime || (episode_run_time && episode_run_time[0]) || 0;
  const hours = Math.floor(movieRuntime / 60);
  const minutes = movieRuntime % 60;
  const runtimeDisplay = movieRuntime ? `${hours}h ${minutes}m` : 'N/A';

  const cast = credits?.cast?.slice(0, 10) || [];
  const similarMovies = (similar?.results || recommendations?.results || []).slice(0, 6);

  return (
    <div className="movie-details-page">
      {/* Backdrop */}
      <div
        className="movie-backdrop"
        style={{ backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none' }}
      >
        <div className="backdrop-overlay"></div>
      </div>

      {/* Content */}
      <div className="movie-details-content">
        <div className="movie-poster">
          <img
            src={posterUrl}
            alt={displayTitle}
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
        </div>

        <div className="movie-info">
          <h1 className="movie-title">
            {displayTitle}
            {releaseYear && <span className="movie-year">({releaseYear})</span>}
          </h1>

          <div className="movie-meta">
            {vote_average > 0 && (
              <span className="movie-rating">
                <FaStar /> {vote_average.toFixed(1)}
              </span>
            )}
            {movieRuntime > 0 && (
              <span className="movie-runtime">
                <FaClock /> {runtimeDisplay}
              </span>
            )}
            {(release_date || first_air_date) && (
              <span className="movie-release">
                <FaCalendar /> {release_date || first_air_date}
              </span>
            )}
          </div>

          {genres && genres.length > 0 && (
            <div className="movie-genres">
              {genres.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div className="movie-actions">
            <button className="action-btn primary" onClick={handlePlayTrailer}>
              <FaPlay /> Watch Trailer
            </button>
            <button
              className={`action-btn ${isFavorite ? 'favorite active' : 'favorite'}`}
              onClick={handleToggleFavorite}
            >
              {isFavorite ? <FaHeart /> : <FaRegHeart />}
              {isFavorite ? 'Remove Favorite' : 'Add to Favorites'}
            </button>
          </div>

          <div className="movie-overview">
            <h3>Overview</h3>
            <p>{overview || 'Description not available'}</p>
          </div>

          {cast.length > 0 && (
            <div className="movie-cast">
              <h3>Cast</h3>
              <div className="cast-list">
                {cast.map((person) => (
                  <div key={person.id} className="cast-item">
                    <img
                      src={
                        person.profile_path
                          ? `${IMAGE_BASE_URL}/w185${person.profile_path}`
                          : PLACEHOLDER_IMAGE
                      }
                      alt={person.name}
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                    <p className="cast-name">{person.name}</p>
                    <p className="cast-character">{person.character}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <div className="similar-section">
          <h2>You May Also Like</h2>
          <div className="movie-slider">
            {similarMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} mediaType={mediaType} />
            ))}
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <TrailerModal
          videoKey={trailer.key}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
};

export default MovieDetails;
