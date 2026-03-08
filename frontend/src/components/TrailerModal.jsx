import { FaTimes } from 'react-icons/fa';
import './TrailerModal.css';

const TrailerModal = ({ videoKey, onClose }) => {
  if (!videoKey) return null;

  return (
    <div className="trailer-modal-overlay" onClick={onClose}>
      <div className="trailer-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="trailer-modal-close" onClick={onClose}>
          <FaTimes />
        </button>
        <div className="trailer-video-container">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
            title="Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
