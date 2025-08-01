import React from 'react';
import { FaThumbsDown, FaRegThumbsDown } from "react-icons/fa";
import "./likeDislike.scss";
interface DislikeButtonProps {
  onClick: () => void;
  isDisliked: boolean;
  dislikes: number;
  disabled: boolean;
}

const DislikeButton: React.FC<DislikeButtonProps> = ({ onClick, isDisliked, dislikes, disabled }) => {
  return (
    <button onClick={onClick} className='dis-btn' disabled={disabled}>
      {isDisliked ? <FaThumbsDown /> : <FaRegThumbsDown />} {dislikes}
    </button>
  );
};

export default DislikeButton;