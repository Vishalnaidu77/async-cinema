import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getTVShows, resetMovies } from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import { MovieGridSkeleton } from '../components/Skeleton';
import './Movies.css';

const TVShows = () => {
  const dispatch = useDispatch();
  const { tvShows, isLoading, page, totalPages } = useSelector((state) => state.movies);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(resetMovies());
    dispatch(getTVShows(1));
    setCurrentPage(1);
  }, [dispatch]);

  const fetchMoreShows = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      dispatch(getTVShows(nextPage));
      setCurrentPage(nextPage);
    }
  };

  return (
    <div className="movies-page">
      <div className="page-header">
        <h1>TV Shows</h1>
        <p>Discover popular TV series and shows</p>
      </div>

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
