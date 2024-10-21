import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../Auth/userSlice';
import axios from 'axios';

// Props interface for the FollowBtn component
interface FollowBtnProps {
  username: string;  // The username of the user to follow
  isFollowed: boolean;
  setFollowed: React.Dispatch<React.SetStateAction<boolean>>;
}

const followBtnHandler = async (currentUser: string, followedUser: string, isFollowed: boolean, setFollowed: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    // Call the API to follow the user
        if(!isFollowed){
          const response = await axios.post(`http://localhost:5000/user/follow/add`, {
            currentUser,
            followedUser
          }, { withCredentials: true });
          
          if (response.status === 200) {
            console.log(`Successfully followed ${followedUser}`);
            setFollowed(true)
          } else {
            console.error('Failed to follow the user');
          }
        } else{
          const response = await axios.post(`http://localhost:5000/user/follow/remove`, {
            currentUser,
            followedUser
          }, { withCredentials: true });
          
          if (response.status === 200) {
            console.log(`Successfully unfollowed ${followedUser}`);
            setFollowed(false)
          } else {
            console.error('Failed to unfollow the user');
          }
        }
  } catch (error) {
    console.error('Error in follow operation:', error);
  }
};

const FollowBtn: React.FC<FollowBtnProps> = ({ username, isFollowed, setFollowed }) => {
  const currentUser = useSelector(selectUser)?.username; // Get the logged-in user

  const handleFollow = () => {
    if (currentUser) {
      followBtnHandler(currentUser, username, isFollowed, setFollowed);
    } else {
      console.log('User not logged in');
    }
  };

  return (
    <div className='follow-btn'>
      <button onClick={handleFollow}>{isFollowed? (<span>Unfollow</span>) : (<span>Follow</span>)} {username}</button>
    </div>
  );
};

export default FollowBtn;
