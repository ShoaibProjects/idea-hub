import { LightbulbIcon } from 'lucide-react';
import './noIdeas.scss';
interface noIdeasProp {
  dataStat : string;
}
const NoMoreIdeas: React.FC<noIdeasProp> = (dataStat) => {
  return (
    <div className="no-more-ideas" data-status={dataStat.dataStat}>
      <LightbulbIcon size={32} />
      <p>No more ideas to display.</p>
    </div>
  );
};

export default NoMoreIdeas;
