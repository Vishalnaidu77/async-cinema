import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import tmdbService from '../services/tmdbService';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import './PersonDetails.css';

const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300x450?text=No+Image';

const PersonDetails = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerson = async () => {
      setIsLoading(true);
      try {
        const data = await tmdbService.getPersonDetails(id);
        setPerson(data);
      } catch (error) {
        console.error('Error fetching person:', error);
      }
      setIsLoading(false);
    };

    fetchPerson();
  }, [id]);

  if (isLoading) {
    return <Loader size={80} />;
  }

  if (!person) {
    return (
      <div className="error-page">
        <h2>Person not found</h2>
      </div>
    );
  }

  const {
    name,
    profile_path,
    biography,
    birthday,
    place_of_birth,
    known_for_department,
    combined_credits
  } = person;

  const profileUrl = profile_path
    ? `${IMAGE_BASE_URL}/w500${profile_path}`
    : PLACEHOLDER_IMAGE;

  const age = birthday
    ? Math.floor((new Date() - new Date(birthday)) / (365.25 * 24 * 60 * 60 * 1000))
    : null;

  // Get top movies/shows
  const credits = combined_credits?.cast || [];
  const sortedCredits = [...credits]
    .filter((credit) => credit.poster_path)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 12);

  return (
    <div className="person-details-page">
      <div className="person-content">
        <div className="person-profile">
          <img
            src={profileUrl}
            alt={name}
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
        </div>

        <div className="person-info">
          <h1>{name}</h1>

          <div className="person-meta">
            {known_for_department && (
              <span className="department">{known_for_department}</span>
            )}
            {birthday && (
              <span>Born: {birthday} {age && `(${age} years old)`}</span>
            )}
            {place_of_birth && <span>From: {place_of_birth}</span>}
          </div>

          <div className="person-biography">
            <h3>Biography</h3>
            <p>{biography || 'Biography not available.'}</p>
          </div>
        </div>
      </div>

      {sortedCredits.length > 0 && (
        <div className="known-for-section">
          <h2>Known For</h2>
          <div className="movie-grid">
            {sortedCredits.map((credit) => (
              <MovieCard
                key={`${credit.id}-${credit.credit_id}`}
                movie={credit}
                mediaType={credit.media_type}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonDetails;
