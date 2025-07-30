import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToFollowing, removeFromFollowing, selectUser } from '../../../hooks/auth/userSlice';
import axios from 'axios';
import { NavigateFunction, useNavigate } from 'react-router';


// Props interface for the FollowBtn component
interface FollowBtnProps {
  username: string;  // The username of the user to follow
  isFollowed: boolean;
  setFollowed: React.Dispatch<React.SetStateAction<boolean>>;
}

const followBtnHandler = async (currentUser: string, followedUser: string, isFollowed: boolean, setFollowed: React.Dispatch<React.SetStateAction<boolean>>, navigate: NavigateFunction, dispatch: Function) => {
  try {
    // Call the API to follow the user
        if(!isFollowed){
          const response = await axios.post(`https://idea-hub-app.vercel.app/user/follow/add`, {
            currentUser,
            followedUser
          }, { withCredentials: true });
          
          if (response.status === 200) {
            console.log(`Successfully followed ${followedUser}`);
            dispatch(addToFollowing(followedUser));
            setFollowed(true)
          } else {
            console.error('Failed to follow the user');
          }
        } else{
          const response = await axios.post(`https://idea-hub-app.vercel.app/user/follow/remove`, {
            currentUser,
            followedUser
          }, { withCredentials: true });
          
          if (response.status === 200) {
            console.log(`Successfully unfollowed ${followedUser}`);
            dispatch(removeFromFollowing(followedUser));
            setFollowed(false)
          } else {
            console.error('Failed to unfollow the user');
          }
        }
  } catch (error: unknown) {
    console.error('Error in follow operation:', error);
  
    // Check if the error is an AxiosError
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
  
      switch (status) {
        case 401:
          console.error('Unauthorized. Redirecting to login.');
          navigate('/login');
          break;
  
        case 440:
          navigate('/')
          break;
  
        case 403:
          console.error('Access forbidden. Invalid token.');
          alert("Invalid token. Please log in again.");
          break;
  
        case 500:
          console.error('Server error. Please try again later.');
          alert("A server error occurred. Please try again later.");
          break;
  
        default:
          console.error(`Unhandled error with status ${status}`);
      }
    } else {
      console.error('Network error or request failed without response');
      alert("Network error. Please check your connection.");
    }
  }
};

const FollowBtn: React.FC<FollowBtnProps> = ({ username, isFollowed, setFollowed }) => {
  const currentUser = useSelector(selectUser)?.username; // Get the logged-in user
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFollow = () => {
    if (currentUser) {
      followBtnHandler(currentUser, username, isFollowed, setFollowed, navigate, dispatch);
    } else {
      alert('You need to login in first');
    }
  };

  return (
    <div className='follow-btn'>
      <button onClick={handleFollow}>{isFollowed? (<span>Unfollow</span>) : (<span>Follow</span>)} {username}</button>
    </div>
  );
};

export default FollowBtn;
