import React from 'react';
import { useFollow } from '../../../hooks/useFollow';
interface FollowBtnProps {
  username: string;
}

const FollowBtn: React.FC<FollowBtnProps> = ({ username }) => {
  const { isFollowed, handleFollowToggle, isLoading } = useFollow(username);

  return (
    <div className='follow-btn'>
      <button onClick={handleFollowToggle} disabled={isLoading}>
        {isLoading
          ? 'Loading...'
          : isFollowed
          ? 'Unfollow'
          : 'Follow'}
      </button>
    </div>
  );
};

export default FollowBtn;
