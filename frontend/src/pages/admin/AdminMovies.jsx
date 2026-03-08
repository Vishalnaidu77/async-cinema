import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import adminService from '../../services/adminService';
import Loader from '../../components/Loader';
import { FaFilm, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './Admin.css';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/50x75?text=No+Image';

const AdminMovies = () => {
  const { user } = useSelector((state) => state.auth);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    posterUrl: '',
    backdropUrl: '',
    description: '',
    releaseDate: '',
    trailerUrl: '',
    genres: '',
    category: 'movie',
    rating: ''
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const data = await adminService.getMovies(user.token);
      setMovies(data.movies || []);
    } catch (error) {
      toast.error('Failed to fetch movies');
    }
    setIsLoading(false);
  };

  const handleOpenModal = (movie = null) => {
    if (movie) {
      setEditingMovie(movie);
      setFormData({
        title: movie.title,
        posterUrl: movie.posterUrl,
        backdropUrl: movie.backdropUrl || '',
        description: movie.description,
        releaseDate: movie.releaseDate,
        trailerUrl: movie.trailerUrl || '',
        genres: movie.genres?.join(', ') || '',
        category: movie.category,
        rating: movie.rating || ''
      });
    } else {
      setEditingMovie(null);
      setFormData({
        title: '',
        posterUrl: '',
        backdropUrl: '',
        description: '',
        releaseDate: '',
        trailerUrl: '',
        genres: '',
        category: 'movie',
        rating: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMovie(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const movieData = {
      ...formData,
      genres: formData.genres.split(',').map((g) => g.trim()).filter(Boolean),
      rating: formData.rating ? parseFloat(formData.rating) : 0
    };

    try {
      if (editingMovie) {
        await adminService.updateMovie(editingMovie._id, movieData, user.token);
        toast.success('Movie updated successfully');
      } else {
        await adminService.addMovie(movieData, user.token);
        toast.success('Movie added successfully');
      }
      handleCloseModal();
      fetchMovies();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (movieId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await adminService.deleteMovie(movieId, user.token);
        toast.success('Movie deleted successfully');
        fetchMovies();
      } catch (error) {
        toast.error('Failed to delete movie');
      }
    }
  };

  const extractYouTubeId = (url) => {
    if (!url) return '';
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : url;
  };

  if (isLoading) {
    return <Loader size={80} />;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1><FaFilm /> Manage Movies</h1>
        <p>Add, edit, or delete custom movies</p>
      </div>

      <div className="admin-toolbar">
        <p>{movies.length} movie(s) in database</p>
        <button className="add-movie-btn" onClick={() => handleOpenModal()}>
          <FaPlus /> Add New Movie
        </button>
      </div>

      {movies.length === 0 ? (
        <div className="empty-state">
          <FaFilm className="empty-icon" />
          <h2>No custom movies yet</h2>
          <p>Start by adding your first movie!</p>
        </div>
      ) : (
        <div className="movies-table">
          <table>
            <thead>
              <tr>
                <th>Poster</th>
                <th>Title</th>
                <th>Category</th>
                <th>Release Date</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id}>
                  <td>
                    <img
                      src={movie.posterUrl || PLACEHOLDER_IMAGE}
                      alt={movie.title}
                      className="table-poster"
                      onError={(e) => {
                        e.target.src = PLACEHOLDER_IMAGE;
                      }}
                    />
                  </td>
                  <td>{movie.title}</td>
                  <td>{movie.category === 'tv' ? 'TV Show' : 'Movie'}</td>
                  <td>{movie.releaseDate || 'N/A'}</td>
                  <td>{movie.rating || 'N/A'}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        className="action-btn-small edit"
                        onClick={() => handleOpenModal(movie)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-btn-small delete"
                        onClick={() => handleDelete(movie._id, movie.title)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h2>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Poster Image URL</label>
                <input
                  type="url"
                  name="posterUrl"
                  value={formData.posterUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/poster.jpg"
                />
              </div>

              <div className="form-group">
                <label>Backdrop Image URL</label>
                <input
                  type="url"
                  name="backdropUrl"
                  value={formData.backdropUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/backdrop.jpg"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Movie description..."
                />
              </div>

              <div className="form-group">
                <label>Release Date</label>
                <input
                  type="date"
                  name="releaseDate"
                  value={formData.releaseDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>YouTube Trailer URL</label>
                <input
                  type="text"
                  name="trailerUrl"
                  value={formData.trailerUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              <div className="form-group">
                <label>Genres (comma separated)</label>
                <input
                  type="text"
                  name="genres"
                  value={formData.genres}
                  onChange={handleChange}
                  placeholder="Action, Comedy, Drama"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="movie">Movie</option>
                  <option value="tv">TV Show</option>
                </select>
              </div>

              <div className="form-group">
                <label>Rating (0-10)</label>
                <input
                  type="number"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>

              <div className="modal-buttons">
                <button type="button" className="modal-btn secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="modal-btn primary">
                  {editingMovie ? 'Update Movie' : 'Add Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMovies;
