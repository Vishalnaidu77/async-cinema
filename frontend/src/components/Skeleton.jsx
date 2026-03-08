import './Skeleton.css';

const MovieCardSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-poster skeleton-animate"></div>
      <div className="skeleton-info">
        <div className="skeleton-title skeleton-animate"></div>
        <div className="skeleton-year skeleton-animate"></div>
      </div>
    </div>
  );
};

const MovieGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="movie-grid">
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
};

export { MovieCardSkeleton, MovieGridSkeleton };
