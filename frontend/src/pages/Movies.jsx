import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getMovies, resetMovies } from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import { MovieGridSkeleton } from '../components/Skeleton';
import './Movies.css';

const Movies = () => {
  const dispatch = useDispatch();
  const { movies, isLoading, page, totalPages } = useSelector((state) => state.movies);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(resetMovies());
    dispatch(getMovies(1));
    setCurrentPage(1);
  }, [dispatch]);

  const fetchMoreMovies = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      dispatch(getMovies(nextPage));
      setCurrentPage(nextPage);
    }
  };

  return (
    <div className="movies-page">
      <div className="page-header">
        <h1>Movies</h1>
        <p>Discover the latest and greatest movies</p>
      </div>

      {isLoading && movies.length === 0 ? (
        <MovieGridSkeleton count={12} />
      ) : (
        <InfiniteScroll
          dataLength={movies.length}
          next={fetchMoreMovies}
          hasMore={currentPage < totalPages}
          loader={<Loader size={50} />}
          endMessage={
            <p className="end-message">You've seen all the movies!</p>
          }
        >
          <div className="movie-grid">
            {movies.map((movie, index) => (
              <MovieCard key={`${movie.id}-${index}`} movie={movie} mediaType="movie" />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Movies;
