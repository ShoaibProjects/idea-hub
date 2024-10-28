import React from 'react';
import { LightbulbIcon } from 'lucide-react';
import './noIdeas.scss'; // Assuming you want to add some custom styles
interface noIdeasProp {
  dataStat : string;
}

const NoIdeasPlaceholder: React.FC<noIdeasProp> = (dataStat) => {
  return (
    <div className="no-ideas-container" data-status={dataStat.dataStat}>
      <LightbulbIcon size={48} className="no-ideas-icon" />
      <p className="no-ideas-text">No ideas available at the moment.</p>
      <p className="no-ideas-suggestion">
        Why not be the first to share your idea?
      </p>
    </div>
  );
};

export default NoIdeasPlaceholder;
