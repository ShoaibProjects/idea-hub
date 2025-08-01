import React from 'react';
import { useInfiniteIdeas } from '../../../hooks/useInfiniteIdeas';
import IdeaCard from '../../idea-card/idea-card';
import IdeaCardSkeleton from '../../cardSkeleton/cardSkeleton';
import NoIdeasPlaceholder from '../../noIdeas/noIdeas';
import LoadingSpinner from '../../noIdeas/spinners';
import NoMoreIdeas from '../../noIdeas/noMoreIdeas';
import './main-cont.scss';

const MainCont: React.FC = () => {
  const { ideas, loading, hasMore } = useInfiniteIdeas();

  const renderContent = () => {
    if (loading && ideas.length === 0) {
      return Array.from({ length: 5 }).map((_, index) => <IdeaCardSkeleton key={index} />);
    }

    if (!loading && ideas.length === 0) {
      return <NoIdeasPlaceholder  dataStat={ideas.length%2==0?'main':''}/>;
    }

    return ideas.map((idea) => (
      <IdeaCard
        key={idea._id}
        _id={idea._id}
        title={idea.title}
        description={idea.description}
        creator={idea.creator}
        upvotes={idea.upvotes}
        downvotes={idea.downvotes}
        category={idea.category}
        comments={idea.comments}
        commentsCount={idea.comments.length}
        tags={idea.tags}
      />
    ));
  };

  return (
    <div className='main-cont'>
      <div className="ideas-container">
        {renderContent()}
      </div>
      {loading && ideas.length > 0 && <LoadingSpinner />}
      {!hasMore && ideas.length > 0 && <NoMoreIdeas  dataStat={ideas.length%2==0?'main':''}/>}
    </div>
  );
};

export default MainCont;
