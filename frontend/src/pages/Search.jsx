import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { search, resetMovies, setSearchQuery } from '../store/slices/movieSlice';
import MovieCard from '../components/MovieCard';
import PersonCard from '../components/PersonCard';
import Loader from '../components/Loader';
import { MovieGridSkeleton } from '../components/Skeleton';
import { FaSearch } from 'react-icons/fa';
import './Search.css';

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Search = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults, isLoading, page, totalPages, searchQuery } = useSelector(
    (state) => state.movies
  );
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      dispatch(resetMovies());
      dispatch(search({ query: debouncedQuery, page: 1 }));
      dispatch(setSearchQuery(debouncedQuery));
      setSearchParams({ q: debouncedQuery });
      setCurrentPage(1);
    }
  }, [debouncedQuery, dispatch, setSearchParams]);

  const fetchMore = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      dispatch(search({ query: debouncedQuery, page: nextPage }));
      setCurrentPage(nextPage);
    }
  };

  const renderResultCard = (item, index) => {
    if (item.media_type === 'person') {
      return <PersonCard key={`${item.id}-${index}`} person={item} />;
    }
    return (
      <MovieCard
        key={`${item.id}-${index}`}
        movie={item}
        mediaType={item.media_type || 'movie'}
      />
    );
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Search</h1>
        <div className="search-input-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for movies, TV shows, or people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {query && (
        <p className="search-results-info">
          {isLoading ? 'Searching...' : `Results for "${debouncedQuery}"`}
        </p>
      )}

      {isLoading && searchResults.length === 0 ? (
        <MovieGridSkeleton count={12} />
      ) : searchResults.length > 0 ? (
        <InfiniteScroll
          dataLength={searchResults.length}
          next={fetchMore}
          hasMore={currentPage < totalPages}
          loader={<Loader size={50} />}
          endMessage={
            searchResults.length > 0 && (
              <p className="end-message">No more results</p>
            )
          }
        >
          <div className="movie-grid">
            {searchResults.map((item, index) => renderResultCard(item, index))}
          </div>
        </InfiniteScroll>
      ) : query && !isLoading ? (
        <div className="no-results">
          <h2>No results found</h2>
          <p>Try searching for something else</p>
        </div>
      ) : (
        <div className="search-placeholder">
          <FaSearch className="placeholder-icon" />
          <h2>Start typing to search</h2>
          <p>Search for movies, TV shows, or people</p>
        </div>
      )}
    </div>
  );
};

export default Search;
