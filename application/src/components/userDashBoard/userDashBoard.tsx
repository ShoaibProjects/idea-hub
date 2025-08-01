import React from 'react';
import { useUserDashboard } from '../../hooks/useUserDashboard';
import IdeaCard from '../idea-card/idea-card';
import IdeaCardSkeleton from '../cardSkeleton/cardSkeleton';
import NoIdeasPlaceholder from '../noIdeas/noIdeas';
import './user-cont.scss';

const UserCont: React.FC = () => {
  const {
    user,
    ideas,
    isLoading,
    isEditingDesc,
    setEditingDesc,
    description,
    setDescription,
    handleSaveDescription,
  } = useUserDashboard();

  return (
    <div className='user-cont'>
      <div className='profile-head'>
        <h2>{user.username ? `${user.username}'s dashboard` : 'Loading Profile...'}</h2>
        {user.username && (
          <>
            {isEditingDesc ? (
              <div className="description-edit">
                <label className="description-edit__label">Edit Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="description-edit__textarea"
                />
                <div className="description-edit__buttons">
                  <button onClick={handleSaveDescription} className="description-edit__button description-edit__button--save">
                    Save
                  </button>
                  <button onClick={() => setEditingDesc(false)} className="description-edit__button description-edit__button--cancel">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className='desc-cont'>
                <p>{user.description || 'No description provided.'}</p>
                <button className='edit-desc-btn' onClick={() => setEditingDesc(true)}>
                  Edit Description
                </button>
              </div>
            )}
            <p className='followers-count'>{user.followers.length} followers</p>
          </>
        )}
      </div>

      <div className="ideas-container">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => <IdeaCardSkeleton key={index} />)
        ) : ideas.length > 0 ? (
          ideas.slice().reverse().map((idea) => (
            <IdeaCard
              key={idea._id}
              _id={idea._id}
              title={idea.title}
              description={idea.description}
              creator={idea.creator}
              upvotes={idea.upvotes}
              downvotes={idea.downvotes}
              category={idea.category.join(', ')}
              comments={idea.comments}
              commentsCount={idea.comments.length}
              viewer={user.username || ''}
              tags={idea.tags}
            />
          ))
        ) : (
          <NoIdeasPlaceholder dataStat='main' />
        )}
      </div>
    </div>
  );
};

export default UserCont;
