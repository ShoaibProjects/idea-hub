import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../idea-card/idea-card.scss';

const IdeaCardSkeleton: React.FC = () => (
  <div className="card-container">
    <div className="title-category">
      <Skeleton width={150} height={20} />
    </div>

    <Skeleton count={2} height={15} className="content" /> 

    <div className="lower-card">
      <Skeleton circle width={35} height={35} />
      <div className="interaction">
        <Skeleton width={60} height={20} />
      </div>
    </div>
  </div>
);

export default IdeaCardSkeleton;
