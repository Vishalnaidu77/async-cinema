import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { motion, useSpring } from 'framer-motion';
import { FaArrowRightLong } from "react-icons/fa6";
import './MovieCard.css';

const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x450?text=No+Image';

const springConfig = { damping: 20, stiffness: 150 };

const MovieCard = ({ movie, mediaType = 'movie' }) => {
  const {
    id,
    title,
    name,
    poster_path,
    posterPath,
    vote_average,
    rating,
    release_date,
    first_air_date,
    releaseDate,
    media_type
  } = movie;

  const displayTitle = title || name;
  const type = media_type || mediaType;
  const posterUrl = poster_path || posterPath
    ? `${IMAGE_BASE_URL}/w500${poster_path || posterPath}`
    : PLACEHOLDER_IMAGE;
  const voteRating = vote_average || rating || 0;
  const date = release_date || first_air_date || releaseDate || '';
  const year = date ? new Date(date).getFullYear() : '';

  const ref = useRef(null);
  const cardRef = useRef(null);
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const [hoverSide, setHoverSide] = useState(null);

  const handleMouseMove = (e) => {
    if (!ref.current || !cardRef.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cardRect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateXValue = ((e.clientY - centerY) / (rect.height / 2)) * -8;
    const rotateYValue = ((e.clientX - centerX) / (rect.width / 2)) * 8;
    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);

    // Determine which side the mouse is closest to
    const x = e.clientX - cardRect.left;
    const y = e.clientY - cardRect.top;
    const w = cardRect.width;
    const h = cardRect.height;
    
    const distTop = y;
    const distBottom = h - y;
    const distLeft = x;
    const distRight = w - x;
    
    const minDist = Math.min(distTop, distBottom, distLeft, distRight);
    
    if (minDist === distTop) setHoverSide('top');
    else if (minDist === distBottom) setHoverSide('bottom');
    else if (minDist === distLeft) setHoverSide('left');
    else setHoverSide('right');
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setHoverSide(null);
  };

  return (
    <Link 
      to={`/${type}/${id}`} 
      className={`movie-card ${hoverSide ? `hover-${hoverSide}` : ''}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={ref}
        className="movie-card-poster"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        <img
          src={posterUrl}
          alt={displayTitle}
          loading="lazy"
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />
        <div className="movie-card-overlay">
          <span className="view-details">View Details <FaArrowRightLong /></span>
        </div>
        {voteRating > 0 && (
          <div className="movie-card-rating">
            <FaStar /> {voteRating.toFixed(1)}
          </div>
        )}
      </motion.div>
      <div className="movie-card-info">
        <h3 className="movie-card-title">{displayTitle || 'Unknown Title'}</h3>
        {year && <span className="movie-card-year">{year}</span>}
      </div>
    </Link>
  );
};

export default MovieCard;
