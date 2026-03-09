import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useSpring } from 'framer-motion';
import './PersonCard.css';

const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x450?text=No+Image';

const springConfig = { damping: 20, stiffness: 150 };

const PersonCard = ({ person }) => {
  const { id, name, profile_path, known_for_department, known_for } = person;

  const profileUrl = profile_path
    ? `${IMAGE_BASE_URL}/w500${profile_path}`
    : PLACEHOLDER_IMAGE;

  const knownForTitles = known_for
    ?.slice(0, 2)
    .map((item) => item.title || item.name)
    .join(', ');

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
      to={`/person/${id}`} 
      className={`person-card ${hoverSide ? `hover-${hoverSide}` : ''}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={ref}
        className="person-card-image"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        <img
          src={profileUrl}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />
      </motion.div>
      <div className="person-card-info">
        <h3 className="person-card-name">{name}</h3>
        <span className="person-card-department">{known_for_department}</span>
        {knownForTitles && (
          <p className="person-card-known-for">{knownForTitles}</p>
        )}
      </div>
    </Link>
  );
};

export default PersonCard;
