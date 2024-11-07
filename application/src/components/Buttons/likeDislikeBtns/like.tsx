import React, { useEffect } from 'react';
// import { ThumbsUp } from 'lucide-react';
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import axios from 'axios';
import { useSelector, useDispatch} from 'react-redux';
import { selectUser, addLikedIdea, removeLikedIdea, removeDislikedIdea } from '../../Auth/userSlice';
import "./likeDislike.scss";
import { useNavigate } from 'react-router';
import { handleLogout } from '../LogOutBtn/LogOutUser';

interface IdeaIdProps {
  Id: string;
  liked : boolean;
  likes: number;
  setLikes : React.Dispatch<React.SetStateAction<number>>;
  dislikes: number;
  setDislikes : React.Dispatch<React.SetStateAction<number>>;
  setLiked: React.Dispatch<React.SetStateAction<boolean>>;
  disliked : boolean;
  setDisliked: React.Dispatch<React.SetStateAction<boolean>>;
}

const Like: React.FC<IdeaIdProps> = ({ Id , liked, setLiked, likes, setLikes, dislikes, setDislikes, disliked, setDisliked}) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLiked = async () =>{
    try {
        const isLikedCond = user.likedIdeas.includes(Id)
        setLiked(isLikedCond);
    } catch (error) {
        console.error(error);
    }
  }

  useEffect(() => {
    isLiked();
    // Fetch like count once when the component mounts
  });

  // Increment likes and update on the server
  const updateLike = async () => {
    try {
      if(!liked){
        const response = await axios.put(`https://idea-hub-app.vercel.app/idea/update/${Id}/likes/update`, {
            likes: likes + 1,
          }, { withCredentials: true });
          if(response){
            setLikes(response.data);
          }
          await axios.put(`https://idea-hub-app.vercel.app/user/${user.username}/liked/add`,{
            ideaId : Id
          }, { withCredentials: true })
          setLiked(true)
          dispatch(addLikedIdea(Id));
          if(disliked){
            const response = await axios.put(`https://idea-hub-app.vercel.app/idea/update/${Id}/dislikes/update`, {
              dislikes: dislikes - 1,
            }, { withCredentials: true });
            setDislikes(response.data);
            await axios.put(`https://idea-hub-app.vercel.app/user/${user.username}/disliked/remove`,{
              ideaId : Id
            }, { withCredentials: true })
            setDisliked(false)
            dispatch(removeDislikedIdea(Id));
          }
      }else{
        const response = await axios.put(`https://idea-hub-app.vercel.app/idea/update/${Id}/likes/update`, {
            likes: likes - 1,
          }, { withCredentials: true });
          setLikes(response.data);
          await axios.put(`https://idea-hub-app.vercel.app/user/${user.username}/liked/remove`,{
            ideaId : Id
          }, { withCredentials: true })
          setLiked(false)
          dispatch(removeLikedIdea(Id));
      } // Update local likes count after successful API response
    } catch (error: unknown) {
      console.error('Error updating Likes:', error);
    
      // Check if the error is an AxiosError
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
    
        switch (status) {
          case 401:
            console.error('Unauthorized. Redirecting to login.');
            navigate('/signin');
            break;
    
          case 440:
            console.log('Session expired. Redirecting to login.');
            alert("Session expired. Please log in again.");
            await handleLogout(dispatch, navigate);
            break;
    
          case 403:
            console.error('Access forbidden. Invalid token.');
            alert("Invalid token. Please log in again.");
            await handleLogout(dispatch, navigate);
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

  return (
    <button onClick={updateLike} className='lik-btn'>
      {liked?(<FaThumbsUp />):(<FaRegThumbsUp />)} {likes}
    </button>
  );
};

export default Like;
