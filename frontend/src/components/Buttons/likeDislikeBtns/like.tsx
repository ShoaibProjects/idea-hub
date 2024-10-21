import React, { useState, useEffect } from 'react';
import { ThumbsUp } from 'lucide-react';
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import axios from 'axios';
import { useSelector, useDispatch} from 'react-redux';
import { selectUser, addLikedIdea, removeLikedIdea, removeDislikedIdea } from '../../Auth/userSlice';
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

const Like: React.FC<IdeaIdProps> = ({ Id , liked, setLiked, likes, setLikes, dislikes, setDislikes, disliked, setDisliked}) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

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
        const response = await axios.put(`http://localhost:5000/idea/update/${Id}/likes/update`, {
            likes: likes + 1,
          }, { withCredentials: true });
          if(response){
            setLikes(response.data);
          }
          await axios.put(`http://localhost:5000/user/${user.username}/liked/add`,{
            ideaId : Id
          }, { withCredentials: true })
          setLiked(true)
          dispatch(addLikedIdea(Id));
          if(disliked){
            const response = await axios.put(`http://localhost:5000/idea/update/${Id}/dislikes/update`, {
              dislikes: dislikes - 1,
            }, { withCredentials: true });
            setDislikes(response.data);
            await axios.put(`http://localhost:5000/user/${user.username}/disliked/remove`,{
              ideaId : Id
            }, { withCredentials: true })
            setDisliked(false)
            dispatch(removeDislikedIdea(Id));
          }
      }else{
        const response = await axios.put(`http://localhost:5000/idea/update/${Id}/likes/update`, {
            likes: likes - 1,
          }, { withCredentials: true });
          setLikes(response.data);
          await axios.put(`http://localhost:5000/user/${user.username}/liked/remove`,{
            ideaId : Id
          }, { withCredentials: true })
          setLiked(false)
          dispatch(removeLikedIdea(Id));
      } // Update local likes count after successful API response
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

  return (
    <button onClick={updateLike} className='lik-btn'>
      {liked?(<FaThumbsUp />):(<FaRegThumbsUp />)} {likes}
    </button>
  );
};

export default Like;
