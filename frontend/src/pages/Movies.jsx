import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  discoverByGenre,
  getGenres,
  getMovies,
  resetMovies,
  setSelectedGenre,
} from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import { MovieGridSkeleton } from '../components/Skeleton';
import './Movies.css';
import GenreFilter from '../components/GenreFilter';

const Movies = () => {
  const dispatch = useDispatch();
  const { movies, isLoading, totalPages, movieGenres, selectedMovieGenre } = useSelector((state) => state.movies);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(resetMovies());
    dispatch(setSelectedGenre({ mediaType: 'movie', genreId: null }));
    dispatch(getGenres('movie'));
    dispatch(getMovies(1));
    setCurrentPage(1);
  }, [dispatch]);

  const handleGenreSelect = (genreId) => {
    dispatch(resetMovies());
    dispatch(setSelectedGenre({ mediaType: 'movie', genreId }));
    setCurrentPage(1);

    if (genreId === null) {
      dispatch(getMovies(1));
      return;
    }

    dispatch(discoverByGenre({ mediaType: 'movie', genreId, page: 1 }));
  };

  const fetchMoreMovies = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      if (selectedMovieGenre === null) {
        dispatch(getMovies(nextPage));
      } else {
        dispatch(discoverByGenre({ mediaType: 'movie', genreId: selectedMovieGenre, page: nextPage }));
      }
      setCurrentPage(nextPage);
    }
  };

  return (
    <div className="movies-page">
      <div className="page-header">
        <h1>Movies</h1>
        <p>Discover the latest and greatest movies</p>
      </div>
      <GenreFilter
        genres={movieGenres}
        selectedGenre={selectedMovieGenre}
        onSelectGenre={handleGenreSelect}
      />
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
