import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../idea-card/idea-card.scss';

const IdeaCardSkeleton: React.FC = () => (
  <div className="card-container">
    <div className="title-category">
      <Skeleton width={150} height={20} /> {/* Simplified single title area */}
    </div>

    <Skeleton count={2} height={15} className="content" /> {/* Simplified content with fewer lines */}

    <div className="lower-card">
      <Skeleton circle width={35} height={35} /> {/* Simplified creator name */}
      <div className="interaction">
        <Skeleton width={60} height={20} /> {/* Placeholder for likes or comments */}
      </div>
    </div>
  </div>
);

export default IdeaCardSkeleton;
