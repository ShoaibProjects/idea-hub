import React from 'react';
import { ArrowUp, ArrowDown, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import './idea-card.scss';
import Like from '../Buttons/likeDislikeBtns/like';
import Dislike from '../Buttons/likeDislikeBtns/dislike';

// Step 1: Define Props interface
interface IdeaCardProps {
  id : string;
  order : number;
  title: string;
  category: string;
  content: string;
  upvotes: number;
  downvotes: number;
  comments: number;
}

// Step 2: Add props to the component
const IdeaCard: React.FC<IdeaCardProps> = ({ id, order, title, category, content, upvotes, downvotes, comments }) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(upvotes);
  const [dislikes, setDislikes] = useState<number>(downvotes);
  return (
    <div className="card-cont">
      <div className="upper-card">
        <span className="title">{title}</span><span>{order}</span>
        <div className="category">{category}</div>
      </div>
      <p className="content">{content}</p>
      <div className="lower-card">
        <div className="votes">
          <Like Id={id} setLikes={setLikes} likes={likes} setDislikes={setDislikes} dislikes={dislikes} liked={liked} setLiked={setLiked} disliked={disliked} setDisliked={setDisliked}></Like> 
          <Dislike Id={id} setLikes={setLikes} likes={likes} setDislikes={setDislikes} dislikes={dislikes} liked={liked} setLiked={setLiked} disliked={disliked} setDisliked={setDisliked}></Dislike>
        </div>
        <div className="comments">
          <MessageSquare /> {comments} Comments
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
