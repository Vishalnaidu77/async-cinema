import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  discoverByGenre,
  getGenres,
  getTVShows,
  resetMovies,
  setSelectedGenre,
} from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import { MovieGridSkeleton } from '../components/Skeleton';
import './Movies.css';
import GenreFilter from '../components/GenreFilter';

const TVShows = () => {
  const dispatch = useDispatch();
  const { tvShows, isLoading, totalPages, tvGenres, selectedTVGenre } = useSelector((state) => state.movies);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(resetMovies());
    dispatch(setSelectedGenre({ mediaType: 'tv', genreId: null }));
    dispatch(getGenres('tv'));
    dispatch(getTVShows(1));
    setCurrentPage(1);
  }, [dispatch]);

  const handleGenreSelect = (genreId) => {
    dispatch(resetMovies());
    dispatch(setSelectedGenre({ mediaType: 'tv', genreId }));
    setCurrentPage(1);

    if (genreId === null) {
      dispatch(getTVShows(1));
      return;
    }

    dispatch(discoverByGenre({ mediaType: 'tv', genreId, page: 1 }));
  };

  const fetchMoreShows = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      if (selectedTVGenre === null) {
        dispatch(getTVShows(nextPage));
      } else {
        dispatch(discoverByGenre({ mediaType: 'tv', genreId: selectedTVGenre, page: nextPage }));
      }
      setCurrentPage(nextPage);
    }
  };

  return (
    <div className="movies-page">
      <div className="page-header">
        <h1>TV Shows</h1>
        <p>Discover popular TV series and shows</p>
      </div>
      <GenreFilter
        genres={tvGenres}
        selectedGenre={selectedTVGenre}
        onSelectGenre={handleGenreSelect}
      />

      {isLoading && tvShows.length === 0 ? (
        <MovieGridSkeleton count={12} />
      ) : (
        <InfiniteScroll
          dataLength={tvShows.length}
          next={fetchMoreShows}
          hasMore={currentPage < totalPages}
          loader={<Loader size={50} />}
          endMessage={
            <p className="end-message">You've seen all the shows!</p>
          }
        >
          <div className="movie-grid">
            {tvShows.map((show, index) => (
              <MovieCard key={`${show.id}-${index}`} movie={show} mediaType="tv" />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default TVShows;
