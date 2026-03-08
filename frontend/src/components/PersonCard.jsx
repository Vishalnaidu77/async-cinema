import { Link } from 'react-router-dom';
import './PersonCard.css';

const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x450?text=No+Image';

const PersonCard = ({ person }) => {
  const { id, name, profile_path, known_for_department, known_for } = person;

  const profileUrl = profile_path
    ? `${IMAGE_BASE_URL}/w500${profile_path}`
    : PLACEHOLDER_IMAGE;

  const knownForTitles = known_for
    ?.slice(0, 2)
    .map((item) => item.title || item.name)
    .join(', ');

  return (
    <Link to={`/person/${id}`} className="person-card">
      <div className="person-card-image">
        <img
          src={profileUrl}
          alt={name}
          loading="lazy"
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />
      </div>
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
