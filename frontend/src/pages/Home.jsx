import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getTrending, getPopular, getMovies, getTVShows } from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';
import { MovieGridSkeleton } from '../components/Skeleton';
import { FaPlay, FaInfoCircle } from 'react-icons/fa';
import './Home.css';

const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

const Home = () => {
  const dispatch = useDispatch();
  const { trending, popular, movies, tvShows, isLoading } = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(getTrending());
    dispatch(getPopular());
    dispatch(getMovies(1));
    dispatch(getTVShows(1));
  }, [dispatch]);

  const heroMovie = trending[0];

  return (
    <div className="home-page">
      {/* Hero Section */}
      {heroMovie && (
        <section
          className="hero-section"
          style={{
            backgroundImage: `url(${IMAGE_BASE_URL}/original${heroMovie.backdrop_path})`,
          }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">{heroMovie.title || heroMovie.name}</h1>
            <p className="hero-overview">
              {heroMovie.overview?.slice(0, 200)}
              {heroMovie.overview?.length > 200 ? '...' : ''}
            </p>
            <div className="hero-buttons">
              <Link
                to={`/${heroMovie.media_type || 'movie'}/${heroMovie.id}`}
                className="hero-btn primary"
              >
                <FaPlay /> Watch Now
              </Link>
              <Link
                to={`/${heroMovie.media_type || 'movie'}/${heroMovie.id}`}
                className="hero-btn secondary"
              >
                <FaInfoCircle /> More Info
              </Link>
            </div>
          </div>
        </section>
      )}

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

      {/* Popular Movies Section */}
      <section className="content-section">
        <div className="section-header">
          <h2>Popular Movies</h2>
          <Link to="/movies" className="view-all">View All</Link>
        </div>
        {isLoading ? (
          <MovieGridSkeleton count={6} />
        ) : (
          <div className="movie-slider">
            {popular.slice(0, 6).map((movie) => (
              <MovieCard key={movie.id} movie={movie} mediaType="movie" />
            ))}
          </div>
        )}
      </section>

      {/* Now Playing Section */}
      <section className="content-section">
        <div className="section-header">
          <h2>Now Playing</h2>
          <Link to="/movies" className="view-all">View All</Link>
        </div>
        {isLoading ? (
          <MovieGridSkeleton count={6} />
        ) : (
          <div className="movie-slider">
            {movies.slice(0, 6).map((movie) => (
              <MovieCard key={movie.id} movie={movie} mediaType="movie" />
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

export default Home;
