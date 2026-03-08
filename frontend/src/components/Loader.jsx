import { TailSpin } from 'react-loader-spinner';
import './Loader.css';

const Loader = ({ size = 80 }) => {
  return (
    <div className="loader-container">
      <TailSpin
        height={size}
        width={size}
        color="#e50914"
        ariaLabel="loading"
      />
    </div>
  );
};

export default Loader;
