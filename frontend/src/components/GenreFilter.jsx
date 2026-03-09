import './GenreFilter.css';

const GenreFilter = ({ genres = [], selectedGenre = null, onSelectGenre }) => {
  return (
    <section className="filters" aria-label="Genre filters">
      <button
        type="button"
        className={`filter ${selectedGenre === null ? 'active' : ''}`}
        onClick={() => onSelectGenre(null)}
      >
        All
      </button>

      {genres.map((genre) => (
        <button
          key={genre.id}
          type="button"
          className={`filter ${selectedGenre === genre.id ? 'active' : ''}`}
          onClick={() => onSelectGenre(genre.id)}
        >
          {genre.name}
        </button>
      ))}
    </section>
  );
};

export default GenreFilter;
