import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Like from '../Buttons/likeDislikeBtns/like';
import Dislike from '../Buttons/likeDislikeBtns/dislike';
import { useSelector } from 'react-redux';
import { selectUser } from '../Auth/userSlice';
import IdeaComments from '../comments/commentsCard';
import axios from 'axios';
import './ideaArea.scss';

interface Idea {
  _id: string;
  title: string;
  description: string;
  creator: string;
  category: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  comments: string[];
}

const IdeaArea: React.FC = () => {
  const [ideaDetails, setIdeaDetails] = useState<Idea | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(0);
  const [dislikes, setDislikes] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const user = useSelector(selectUser); // The logged-in user
  const { lookedUpIdea } = useParams<{ lookedUpIdea: string }>(); // Extract ideaId from URL

  const fetchIdea = async (idea: string) => {
    try {
      setLoading(true);
      const ideaResponse = await axios.get(`http://localhost:5000/idea/${idea}`);
      const ideaData = ideaResponse.data;

      setIdeaDetails({
        _id: ideaData._id,
        title: ideaData.title,
        description: ideaData.description,
        creator: ideaData.creator,
        category: ideaData.category,
        tags: ideaData.tags,
        upvotes: ideaData.upvotes,
        downvotes: ideaData.downvotes,
        comments: ideaData.comments || [],
      });
      setLikes(ideaData.upvotes);
      setDislikes(ideaData.downvotes);
    } catch (error) {
      console.error('Error fetching idea details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lookedUpIdea) {
      fetchIdea(lookedUpIdea);
    }
  }, [lookedUpIdea]);

  if (loading || !ideaDetails) {
    return <p className="loading-message">Loading idea details...</p>;
  }

  return (
    <div className='idea-page-cont'>
      <div className="idea-container">
      <div className="header-section">
        <span className="idea-title">{ideaDetails.title}</span>
        <div className="idea-category">{ideaDetails.category}</div>
      </div>
      <p className="idea-description">{ideaDetails.description}</p>
      <div className="footer-section">
        <div className="creator-info">
          <Link to={`/user/profile/${ideaDetails.creator}`} className="creator-link">
            {ideaDetails.creator}
          </Link>
        </div>
        <div className="interactions">
          <Like
            Id={ideaDetails._id}
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
            Id={ideaDetails._id}
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
        <div className="comments-section">
          <MessageSquare size={20} />
          <IdeaComments ideaId={lookedUpIdea || ''} reader={user?.username || ''} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default IdeaArea;
