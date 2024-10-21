import React, { useState, useEffect } from 'react';
import { ThumbsDown } from 'lucide-react';
import { FaRegThumbsDown, FaThumbsDown } from "react-icons/fa";
import axios from 'axios';
import { useSelector, useDispatch} from 'react-redux';
import { selectUser, addLikedIdea, removeLikedIdea, addDislikedIdea, removeDislikedIdea } from '../../Auth/userSlice';
import "./likeDislike.scss";

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
        const response = await axios.put(`http://localhost:5000/idea/update/${Id}/dislikes/update`, {
            dislikes: dislikes + 1,
          }, { withCredentials: true });
          setDislikes(response.data);
          await axios.put(`http://localhost:5000/user/${user.username}/disliked/add`,{
            ideaId : Id
          }, { withCredentials: true })
          setDisliked(true)
          dispatch(addDislikedIdea(Id));
          if(liked){
            const response = await axios.put(`http://localhost:5000/idea/update/${Id}/likes/update`, {
              likes: likes - 1,
            }, { withCredentials: true });
            setLikes(response.data);
            await axios.put(`http://localhost:5000/user/${user.username}/liked/remove`,{
              ideaId : Id
            }, { withCredentials: true })
            setLiked(false)
            dispatch(removeLikedIdea(Id));
          }
      }else{
        const response = await axios.put(`http://localhost:5000/idea/update/${Id}/dislikes/update`, {
            dislikes: dislikes - 1,
          }, { withCredentials: true });
          setDislikes(response.data);
          await axios.put(`http://localhost:5000/user/${user.username}/disliked/remove`,{
            ideaId : Id
          }, { withCredentials: true })
          setDisliked(false)
          dispatch(removeDislikedIdea(Id));
      } // Update local likes count after successful API response
    } catch (error) {
      console.error("Error updating dislikes:", error);
    }
  };

  return (
    <button onClick={updateDislike} className='dis-btn'>
      {disliked?(<FaThumbsDown />):(<FaRegThumbsDown />)} {dislikes}
    </button>
  );
};

export default Dislike;
