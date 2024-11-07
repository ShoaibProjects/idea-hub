import React, {  useEffect } from 'react';
// import { ThumbsDown } from 'lucide-react';
import { FaRegThumbsDown, FaThumbsDown } from "react-icons/fa";
import axios from 'axios';
import { useSelector, useDispatch} from 'react-redux';
import { selectUser, removeLikedIdea, addDislikedIdea, removeDislikedIdea } from '../../Auth/userSlice';
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

const Dislike: React.FC<IdeaIdProps> = ({ Id , liked, setLiked, likes, setLikes, dislikes, setDislikes, disliked, setDisliked }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const navigate = useNavigate();


  const isDisliked = async () =>{
    try {
        const isDislikedCond = user.dislikedIdeas.includes(Id)
        setDisliked(isDislikedCond);
    } catch (error) {
        console.error(error);
    }
  }

  useEffect(() => {
    isDisliked();
    // Fetch like count once when the component mounts
  });

  // Increment likes and update on the server
  const updateDislike = async () => {
    try {
      if(!disliked){
        const response = await axios.put(`https://idea-hub-app.vercel.app/idea/update/${Id}/dislikes/update`, {
            dislikes: dislikes + 1,
          }, { withCredentials: true });
          setDislikes(response.data);
          await axios.put(`https://idea-hub-app.vercel.app/user/${user.username}/disliked/add`,{
            ideaId : Id
          }, { withCredentials: true })
          setDisliked(true)
          dispatch(addDislikedIdea(Id));
          if(liked){
            const response = await axios.put(`https://idea-hub-app.vercel.app/idea/update/${Id}/likes/update`, {
              likes: likes - 1,
            }, { withCredentials: true });
            setLikes(response.data);
            await axios.put(`https://idea-hub-app.vercel.app/user/${user.username}/liked/remove`,{
              ideaId : Id
            }, { withCredentials: true })
            setLiked(false)
            dispatch(removeLikedIdea(Id));
          }
      }else{
        const response = await axios.put(`https://idea-hub-app.vercel.app/idea/update/${Id}/dislikes/update`, {
            dislikes: dislikes - 1,
          }, { withCredentials: true });
          setDislikes(response.data);
          await axios.put(`https://idea-hub-app.vercel.app/user/${user.username}/disliked/remove`,{
            ideaId : Id
          }, { withCredentials: true })
          setDisliked(false)
          dispatch(removeDislikedIdea(Id));
      } // Update local likes count after successful API response
    } catch (error: unknown) {
      console.error('Error updating dislikes:', error);
    
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
    <button onClick={updateDislike} className='dis-btn'>
      {disliked?(<FaThumbsDown />):(<FaRegThumbsDown />)} {dislikes}
    </button>
  );
};

export default Dislike;
