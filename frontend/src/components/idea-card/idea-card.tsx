import React from 'react';
import { ArrowUp, ArrowDown, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './idea-card.scss';
import Like from '../Buttons/likeDislikeBtns/like';
import Dislike from '../Buttons/likeDislikeBtns/dislike';

// Step 1: Define Props interface
interface IdeaCardProps {
  id : string;
  title: string;
  category: string;
  content: string;
  creator: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  viewer: string;
}

// Step 2: Add props to the component
const IdeaCard: React.FC<IdeaCardProps> = ({ id, title, category, content, creator, upvotes, downvotes, comments, viewer }) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(upvotes);
  const [dislikes, setDislikes] = useState<number>(downvotes);
  return (
    <div className="card-cont">
      <div className="upper-card">
        <span className="title">{title}</span>
        <div className="category">{category}</div>
      </div>
      <p className="content">{content}</p>
      <div className="lower-card">
        <div>
            <Link to={`/user/profile/${creator}`} className="creator-link">
              {creator}
            </Link>
            <Link to={`/idea/${id}`} className="creator-link">
              <span>idea detail</span>
            </Link>
        </div>
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
