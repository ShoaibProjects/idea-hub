import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AppDispatch } from '../store';
import { selectUser, removeFromFollowing, addToFollowing } from './auth/userSlice';
import { followUser, unfollowUser } from '../api/followService';

interface UseFollowReturn {
  isFollowed: boolean;
  handleFollowToggle: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useFollow = (profileUsername: string): UseFollowReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const currentUser = useSelector(selectUser);
  const [isFollowed, setFollowed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.following?.includes(profileUsername)) {
      setFollowed(true);
    } else {
      setFollowed(false);
    }
  }, [currentUser, profileUsername]);

  const handleFollowToggle = async () => {
    if (!currentUser?.username) {
      alert('You need to log in first.');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        currentUser: currentUser.username,
        followedUser: profileUsername,
      };

      if (isFollowed) {
        await unfollowUser(payload);
        dispatch(removeFromFollowing(profileUsername));
        setFollowed(false);
        console.log(`Successfully unfollowed ${profileUsername}`);
      } else {
        await followUser(payload);
        dispatch(addToFollowing(profileUsername));
        setFollowed(true);
        console.log(`Successfully followed ${profileUsername}`);
      }
    } catch (err: unknown) {
      console.error('Error in follow operation:', err);
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        setError(`Error: ${status}`);
        switch (status) {
          case 401:
            navigate('/login');
            break;
          case 403:
            alert("Invalid token. Please log in again.");
            break;
          case 440: // Session Expired
            alert("Your session has expired. Please log in again.");
            navigate('/login');
            break;
          case 500:
            alert("A server error occurred. Please try again later.");
            break;
          default:
            alert("An unexpected error occurred.");
        }
      } else {
        setError('Network error or request failed.');
        alert("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { isFollowed, handleFollowToggle, isLoading, error };
};
