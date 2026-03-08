import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
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
const PLACEHOLDER_PROFILE = 'https://via.placeholder.com/185x278?text=No+Photo';

const MovieDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const mediaType = location.pathname.includes('/tv/') ? 'tv' : 'movie';
  const heroRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  const { currentMovie, videos, isLoading } = useSelector((state) => state.movies);
  const { user } = useSelector((state) => state.auth);
  const { favorites } = useSelector((state) => state.favorites);

  const [showTrailer, setShowTrailer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    dispatch(getMovieDetails({ id, mediaType }));
    dispatch(getVideos({ id, mediaType }));
    setImageLoaded(false);
    window.scrollTo(0, 0);

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
    recommendations,
    tagline,
    images
  } = currentMovie;

  const displayTitle = title || name || 'Unknown Title';
  const posterUrl = poster_path ? `${IMAGE_BASE_URL}/w500${poster_path}` : PLACEHOLDER_IMAGE;
  const backdropUrl = backdrop_path ? `${IMAGE_BASE_URL}/original${backdrop_path}` : '';
  const releaseYear = (release_date || first_air_date || '').split('-')[0];
  const movieRuntime = runtime || (episode_run_time && episode_run_time[0]) || 0;
  const hours = Math.floor(movieRuntime / 60);
  const minutes = movieRuntime % 60;
  const runtimeDisplay = movieRuntime ? `${hours}h ${minutes}m` : 'N/A';

  const cast = credits?.cast?.slice(0, 8) || [];
  const mainCast = credits?.cast?.slice(0, 6) || [];
  const similarMovies = (similar?.results || recommendations?.results || []).slice(0, 6);
  const galleryImages = images?.backdrops?.slice(0, 4) || [];

  return (
    <div className="cinematic-movie-page">
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section" ref={heroRef}>
        <div 
          className="hero-backdrop"
          style={{ 
            backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
            transform: `translateY(${scrollY * 0.5}px)` 
          }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-mist hero-mist-top"></div>
          <div className="hero-mist hero-mist-bottom"></div>
        </div>

        <div className="hero-content">
          <div className="hero-cast-strip">
            {mainCast.map((person, index) => (
              <Link 
                to={`/person/${person.id}`} 
                key={person.id} 
                className="hero-cast-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="hero-cast-img-wrapper">
                  <img
                    src={person.profile_path ? `${IMAGE_BASE_URL}/w185${person.profile_path}` : PLACEHOLDER_PROFILE}
                    alt={person.name}
                  />
                </div>
                <span className="hero-cast-name">{person.name?.split(' ')[0]}</span>
              </Link>
            ))}
          </div>

          <h1 className="hero-title" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
            {displayTitle.toUpperCase()}
          </h1>

          {tagline && <p className="hero-tagline">{tagline}</p>}

          <div className="hero-meta">
            {vote_average > 0 && (
              <span className="hero-rating">
                <FaStar /> {vote_average.toFixed(1)}
              </span>
            )}
            <span className="hero-divider">|</span>
            <span>{releaseYear}</span>
            {movieRuntime > 0 && (
              <>
                <span className="hero-divider">|</span>
                <span>{runtimeDisplay}</span>
              </>
            )}
          </div>

          <button className="hero-play-btn" onClick={handlePlayTrailer}>
            <div className="play-icon-wrapper">
              <FaPlay />
            </div>
            <span>Watch Trailer</span>
          </button>
        </div>
      </section>

      {/* ===== CHARACTER SECTION ===== */}
      <section className="character-section">
        <div className="section-content">
          <div className="character-header">
            <div className="character-featured">
              <div className="featured-image-frame">
                <img
                  src={posterUrl}
                  alt={displayTitle}
                  className={`featured-poster ${imageLoaded ? 'loaded' : ''}`}
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            </div>
            <div className="character-title-block">
              <span className="section-label">CHARACTER</span>
              <h2 className="character-heading">Meet the Cast</h2>
            </div>
          </div>

          <div className="character-grid">
            {cast.map((person, index) => (
              <Link 
                to={`/person/${person.id}`} 
                key={person.id} 
                className="character-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="character-card-image">
                  <img
                    src={person.profile_path ? `${IMAGE_BASE_URL}/w185${person.profile_path}` : PLACEHOLDER_PROFILE}
                    alt={person.name}
                  />
                </div>
                <div className="character-card-info">
                  <h4>{person.name}</h4>
                  <p>{person.character}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STORY SECTION ===== */}
      <section className="story-section">
        {/* Scene Image - Left Side */}
        <div className="story-scene-wrapper">
          <div 
            className="story-scene-image"
            style={{ 
              backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
            }}
          ></div>
          <div className="story-scene-fade"></div>
        </div>
        
        {/* Story Content - Right Side */}
        <div className="story-content-wrapper">
          <h2 className="story-title-large">STORY</h2>
          <div className="story-text-block">
            <p className="overview-text">{overview || 'Description not available'}</p>
            
            {genres && genres.length > 0 && (
              <div className="story-genres">
                {genres.map((genre) => (
                  <span key={genre.id} className="genre-pill">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <div className="story-meta-inline">
              {(release_date || first_air_date) && (
                <span><FaCalendar /> {release_date || first_air_date}</span>
              )}
              {movieRuntime > 0 && (
                <span><FaClock /> {runtimeDisplay}</span>
              )}
              {vote_average > 0 && (
                <span className="rating-inline"><FaStar /> {vote_average.toFixed(1)}</span>
              )}
            </div>

            <div className="story-actions">
              <button className="action-btn-cinematic primary" onClick={handlePlayTrailer}>
                <FaPlay /> Watch Trailer
              </button>
              <button
                className={`action-btn-cinematic ${isFavorite ? 'favorite active' : 'favorite'}`}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? <FaHeart /> : <FaRegHeart />}
                {isFavorite ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ===== GALLERY SECTION ===== */}
      {galleryImages.length > 0 && (
        <section className="gallery-section">
          <div className="section-content">
            <div className="gallery-header">
              <span className="section-label">GALLERY</span>
              <h2 className="gallery-heading">Scenes & Moments</h2>
            </div>

            <div className="gallery-grid">
              {galleryImages.map((image, index) => (
                <div 
                  key={index} 
                  className={`gallery-item ${index === 0 ? 'large' : ''}`}
                >
                  <img
                    src={`${IMAGE_BASE_URL}/w780${image.file_path}`}
                    alt={`Scene ${index + 1}`}
                  />
                  <div className="gallery-item-overlay"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== SIMILAR MOVIES ===== */}
      {similarMovies.length > 0 && (
        <section className="similar-section-cinematic">
          <div className="section-content">
            <div className="similar-header">
              <span className="section-label">DISCOVER</span>
              <h2>You May Also Like</h2>
            </div>
            <div className="similar-grid">
              {similarMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} mediaType={mediaType} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== TRAILER MODAL ===== */}
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
