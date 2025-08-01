import React from 'react';
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import "./likeDislike.scss";

interface LikeButtonProps {
  onClick: () => void;
  isLiked: boolean;
  likes: number;
  disabled: boolean;
}

const LikeButton: React.FC<LikeButtonProps> = ({ onClick, isLiked, likes, disabled }) => {
  return (
    <button onClick={onClick} className='lik-btn' disabled={disabled}>
      {isLiked ? <FaThumbsUp /> : <FaRegThumbsUp />} {likes}
    </button>
  );
};

export default LikeButton;