import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../hooks/auth/userSlice';
import { useUserProfile } from '../../hooks/useUserProfile';
import IdeaCard from '../idea-card/idea-card';
import FollowBtn from '../Buttons/followBtn/followBtn';
import IdeaCardSkeleton from '../cardSkeleton/cardSkeleton';
import NoIdeasPlaceholder from '../noIdeas/noIdeas';
import './userProfile.scss';

const UserProfile: React.FC = () => {
  const { userProfile, ideas, loading, error } = useUserProfile();
  const loggedInUser = useSelector(selectUser);

  if (error) {
    return <div className="user-prof-cont error-message">{error}</div>;
  }

  return (
    <div className='user-prof-cont'>
      {userProfile && (
        <div className='profile-head'>
          <h2>{`${userProfile.username}'s Profile`}</h2>
          <div className='follow-cont'>
            <p className='followers-count'>{userProfile.followersCount} followers</p>
            {loggedInUser.username !== userProfile.username && (
              <span><FollowBtn username={userProfile.username} /></span>
            )}
          </div>
          <p>{userProfile.description}</p>
        </div>
      )}

      <div className="ideas-container">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => <IdeaCardSkeleton key={index} />)
        ) : ideas.length > 0 ? (
          ideas
            .slice()
            .reverse()
            .map((idea) => (
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
                viewer={loggedInUser.username || ''}
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

export default UserProfile;
