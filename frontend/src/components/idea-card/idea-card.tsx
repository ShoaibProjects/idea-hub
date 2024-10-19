import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import Like from '../Buttons/likeDislikeBtns/like';
import Dislike from '../Buttons/likeDislikeBtns/dislike';
import './idea-card.scss';

interface IdeaCardProps {
  id: string;
  title: string;
  category: string;
  content: string;
  creator: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  viewer: string;
}

const IdeaCard: React.FC<IdeaCardProps> = ({
  id,
  title,
  category,
  content,
  creator,
  upvotes,
  downvotes,
  comments,
  viewer,
}) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(upvotes);
  const [dislikes, setDislikes] = useState<number>(downvotes);

  return (
    <div className="card-container">
      <div className="upper-card">
        <div className="title-category">
          <span className="title">{title}</span>
          <span className="category">{category}</span>
        </div>
      </div>
      <p className="content">{content}</p>
      <div className="lower-card">
        <div className="creator">
          <Link to={`/user/profile/${creator}`} className="creator-link">
            {creator}
          </Link>
          <Link to={`/idea/${id}`} className="details-link">
            View Idea
          </Link>
        </div>
        <div className="interaction">
          <div className="votes">
            <Like
              Id={id}
              setLikes={setLikes}
              likes={likes}
              setDislikes={setDislikes}
              dislikes={dislikes}
              liked={liked}
              setLiked={setLiked}
              disliked={disliked}
              setDisliked={setDisliked}
            />
            <Dislike
              Id={id}
              setLikes={setLikes}
              likes={likes}
              setDislikes={setDislikes}
              dislikes={dislikes}
              liked={liked}
              setLiked={setLiked}
              disliked={disliked}
              setDisliked={setDisliked}
            />
          </div>
          <div className="comments">
            <MessageSquare size={20} /> {comments} Comments
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;
