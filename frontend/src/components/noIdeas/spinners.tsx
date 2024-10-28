import { ColorRing } from 'react-loader-spinner';
import './noIdeas.scss';



const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner">
      <ColorRing colors={['#4A90E2','#4A90E2','#4A90E2','#4A90E2','#4A90E2']}/>
    </div>
  );
};

export default LoadingSpinner;
