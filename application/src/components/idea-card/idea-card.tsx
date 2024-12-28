import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, UserCircle, LightbulbIcon } from 'lucide-react';
import Like from '../Buttons/likeDislikeBtns/like';
import Dislike from '../Buttons/likeDislikeBtns/dislike';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { removePostedContent } from '../Auth/userSlice'; // Assuming this action is used for deleting from the Redux store
import './idea-card.scss';
import { selectIsDarkMode } from '../../Redux-slices/themeSlice/themeSlice';
import { selectUser } from '../Auth/userSlice';

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
  const [editingIdea, setEditingIdea] = useState<{ title: string; content: string } | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<boolean>(false);

  // const user = useSelector((state: any) => state.user); // Assuming user is stored in Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDarkMode = useSelector(selectIsDarkMode);

  const user = useSelector(selectUser);

  const handleCardClick = () => {
    navigate(`/ideainfo/${id}`);
  }

  // API call to delete idea
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`https://idea-hub-app.vercel.app/idea/delete/${id}`, { withCredentials: true });
      await axios.put(`https://idea-hub-app.vercel.app/user/${user.username}/remove-posted-idea`, { id }, { withCredentials: true });
      if (response.status === 201) {
        alert('Idea deleted successfully!');
        dispatch(removePostedContent(id)); // Remove idea from Redux store
        navigate('/userinfo');
      }
    } catch (error) {
      console.error('Error deleting idea:', error);
      alert('Failed to delete idea.');
    }
  };

  // API call to update idea
  const handleUpdateIdea = async () => {
    try {
      await axios.put(`https://idea-hub-app.vercel.app/idea/update/${id}`, editingIdea, { withCredentials: true });
      alert('Idea updated successfully!');
      setEditingIdea(null);
    } catch (error) {
      console.error('Error updating idea:', error);
      alert('Failed to update idea.');
    }
  };

  // Toggle action menu for edit/delete
  const toggleActionMenu = () => {
    setShowActionMenu(!showActionMenu);
  };

  return (
    <div className="card-container" onClick={handleCardClick}>
      <div className="upper-card">
        <div className="title-category">
          <span><LightbulbIcon /></span>
          <span className="title">{title}</span>
          <span className="category">{category}</span>
        </div>
      </div>
      <p className="content">{content}</p>
      <div className="lower-card">
        <div className="creator">
          <Link to={`/userinfo/profile/${creator}`} className="creator-link" onClick={(e) => e.stopPropagation()}>
            <UserCircle />
            {creator}
          </Link>
        </div>
        <div className="interaction">
          <div className="votes" onClick={(e) => e.stopPropagation()}>
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
          {creator === viewer && (
            <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
              <button className="dots" onClick={(e) => { e.stopPropagation(); toggleActionMenu(); }}>⋮</button>
              {showActionMenu && (
                <div className={isDarkMode?"dropdown-menu dark-drop":"dropdown-menu"}>
                  <button onClick={(e) => { e.stopPropagation(); setEditingIdea({ title, content }) }}>Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete() }}>Delete</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {editingIdea && (
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <h3>Edit Idea</h3>
            <input
              type="text"
              value={editingIdea.title}
              onChange={(e) => setEditingIdea({ ...editingIdea, title: e.target.value })}
            />
            <textarea
              value={editingIdea.content}
              onChange={(e) => setEditingIdea({ ...editingIdea, content: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={(e) => { e.stopPropagation(); handleUpdateIdea() }}>Save Changes</button>
              <button onClick={(e) => { e.stopPropagation(); setEditingIdea(null) }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaCard;
