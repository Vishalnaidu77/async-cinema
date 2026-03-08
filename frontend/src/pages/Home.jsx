import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTrending, getPopular, getMovies, getTVShows } from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';
import { MovieGridSkeleton } from '../components/Skeleton';
import { FaPlay, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Home.css';

const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

const Home = () => {
  const dispatch = useDispatch();
  const { trending, popular, movies, tvShows, isLoading } = useSelector((state) => state.movies);
  const { favorites } = useSelector((state) => state.favorites);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    dispatch(getTrending());
    dispatch(getPopular());
    dispatch(getMovies(1));
    dispatch(getTVShows(1));
  }, [dispatch]);

  const featuredMovie = trending[featuredIndex] || trending[0];
  const featuredThumbnails = trending.slice(0, 5);

  const handlePrevFeatured = () => {
    setFeaturedIndex((prev) => (prev > 0 ? prev - 1 : featuredThumbnails.length - 1));
  };

  const handleNextFeatured = () => {
    setFeaturedIndex((prev) => (prev < featuredThumbnails.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="dashboard-home">
      {/* Featured Section */}
      {featuredMovie && (
        <section className="featured-section">
          <div className="featured-content">
            {/* Featured Movie Info */}
            <div className="featured-info">
              <h1 className="featured-title">
                {featuredMovie.title?.split(' ').map((word, i) => (
                  <span key={i} className={i === 0 ? 'title-light' : 'title-bold'}>
                    {word}{' '}
                  </span>
                )) || featuredMovie.name}
              </h1>
              
              <div className="featured-meta">
                <span className="meta-rating">
                  <FaStar className="star-icon" />
                  {featuredMovie.vote_average?.toFixed(1)}
                </span>
                <span className="meta-divider">•</span>
                <span className="meta-lang">
                  <img 
                    src={`https://flagcdn.com/16x12/${featuredMovie.original_language === 'en' ? 'us' : featuredMovie.original_language}.png`}
                    alt="Language"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  {featuredMovie.original_language?.toUpperCase()}
                </span>
              </div>

              <Link 
                to={`/${featuredMovie.media_type || 'movie'}/${featuredMovie.id}`}
                className="watch-btn"
              >
                Watch
              </Link>

              <div className="friends-watching">
                <div className="friend-avatars">
                  <img src="https://i.pravatar.cc/30?img=1" alt="Friend" />
                  <img src="https://i.pravatar.cc/30?img=2" alt="Friend" />
                  <img src="https://i.pravatar.cc/30?img=3" alt="Friend" />
                </div>
                <span>+5 friends are watching</span>
              </div>
            </div>

            {/* Featured Image */}
            <div 
              className="featured-image"
              style={{
                backgroundImage: `url(${IMAGE_BASE_URL}/original${featuredMovie.backdrop_path || featuredMovie.poster_path})`,
              }}
            >
              <div className="featured-overlay"></div>
            </div>

            {/* Thumbnail Carousel */}
            <div className="featured-thumbnails">
              <button className="thumb-nav prev" onClick={handlePrevFeatured}>
                <FaChevronLeft />
              </button>
              <div className="thumb-list">
                {featuredThumbnails.map((movie, index) => (
                  <div 
                    key={movie.id}
                    className={`thumb-item ${index === featuredIndex ? 'active' : ''}`}
                    onClick={() => setFeaturedIndex(index)}
                  >
                    <img 
                      src={`${IMAGE_BASE_URL}/w300${movie.backdrop_path || movie.poster_path}`}
                      alt={movie.title || movie.name}
                    />
                  </div>
                ))}
              </div>
              <button className="thumb-nav next" onClick={handleNextFeatured}>
                <FaChevronRight />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Parties Section - Popular Movies */}
      <section className="content-section parties-section">
        <div className="section-header">
          <h2>Parties</h2>
          <span className="section-indicator"></span>
        </div>
        {isLoading ? (
          <MovieGridSkeleton count={4} />
        ) : (
          <div className="parties-grid">
            {popular.slice(0, 4).map((movie) => (
              <Link 
                key={movie.id} 
                to={`/movie/${movie.id}`}
                className="party-card"
              >
                <div className="party-poster">
                  <img 
                    src={`${IMAGE_BASE_URL}/w300${movie.poster_path}`}
                    alt={movie.title}
                  />
                </div>
                <div className="party-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.genre_ids?.slice(0, 2).map(id => getGenreName(id)).join(', ') || 'Movie'}</p>
                </div>
                <div className="party-watchers">
                  <img src="https://i.pravatar.cc/24?img=4" alt="Watcher" />
                  <img src="https://i.pravatar.cc/24?img=5" alt="Watcher" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Continue Watching Section */}
      <section className="content-section">
        <div className="section-header">
          <h2>Continue Watching</h2>
          <span className="section-indicator red"></span>
        </div>
        {isLoading ? (
          <MovieGridSkeleton count={4} />
        ) : (
          <div className="continue-grid">
            {movies.slice(0, 4).map((movie) => (
              <Link 
                key={movie.id}
                to={`/movie/${movie.id}`} 
                className="continue-card"
              >
                <img 
                  src={`${IMAGE_BASE_URL}/w500${movie.backdrop_path || movie.poster_path}`}
                  alt={movie.title}
                />
                <div className="continue-overlay">
                  <div className="play-icon">
                    <FaPlay />
                  </div>
                </div>
                <div className="continue-progress">
                  <div className="progress-bar" style={{ width: `${Math.random() * 60 + 20}%` }}></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Trending Section */}
      <section className="content-section">
        <div className="section-header">
          <h2>Trending Now</h2>
          <Link to="/movies" className="view-all">View All</Link>
        </div>
        {isLoading ? (
          <MovieGridSkeleton count={6} />
        ) : (
          <div className="movie-slider">
            {trending.slice(0, 6).map((movie) => (
              <MovieCard key={movie.id} movie={movie} mediaType={movie.media_type} />
            ))}
          </div>
        )}
      </section>

      {/* TV Shows Section */}
      <section className="content-section">
        <div className="section-header">
          <h2>Popular TV Shows</h2>
          <Link to="/tv" className="view-all">View All</Link>
        </div>
        {isLoading ? (
          <MovieGridSkeleton count={6} />
        ) : (
          <div className="movie-slider">
            {tvShows.slice(0, 6).map((show) => (
              <MovieCard key={show.id} movie={show} mediaType="tv" />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

// Helper function to get genre name from ID
const getGenreName = (id) => {
  const genres = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western'
  };
  return genres[id] || 'Movie';
};

export default Home;
