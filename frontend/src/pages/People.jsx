import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getPeople, resetMovies } from '../store/slices/movieSlice';
import PersonCard from '../components/PersonCard';
import Loader from '../components/Loader';
import { MovieGridSkeleton } from '../components/Skeleton';
import './Movies.css';

const People = () => {
  const dispatch = useDispatch();
  const { people, isLoading, page, totalPages } = useSelector((state) => state.movies);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(resetMovies());
    dispatch(getPeople(1));
    setCurrentPage(1);
  }, [dispatch]);

  const fetchMorePeople = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      dispatch(getPeople(nextPage));
      setCurrentPage(nextPage);
    }
  };

  return (
    <div className="movies-page">
      <div className="page-header">
        <h1>Popular People</h1>
        <p>Discover popular actors, directors, and more</p>
      </div>

      {isLoading && people.length === 0 ? (
        <MovieGridSkeleton count={12} />
      ) : (
        <InfiniteScroll
          dataLength={people.length}
          next={fetchMorePeople}
          hasMore={currentPage < totalPages}
          loader={<Loader size={50} />}
          endMessage={
            <p className="end-message">You've seen all the people!</p>
          }
        >
          <div className="movie-grid">
            {people.map((person, index) => (
              <PersonCard key={`${person.id}-${index}`} person={person} />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
};

export default People;
