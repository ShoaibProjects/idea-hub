import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, UserCircle, LightbulbIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectIsDarkMode } from '../../Redux-slices/themeSlice/themeSlice';
import { selectUser } from '../../hooks/auth/userSlice';
import { useIdeaInteraction } from '../../hooks/useIdeaInteraction';
import { useIdeaCard } from '../../hooks/useIdeaCard';
import LikeButton from '../Buttons/likeDislikeBtns/like';
import DislikeButton from '../Buttons/likeDislikeBtns/dislike';
import './idea-card.scss';
import { Idea } from '../../types/ideaTypes';


const IdeaCard: React.FC<Idea> = ({ _id, title, category, description, creator, upvotes, downvotes, commentsCount }) => {
  const user = useSelector(selectUser);
  const isDarkMode = useSelector(selectIsDarkMode);
  const { likes, dislikes, isLiked, isDisliked, handleLike, handleDislike, isLoading: isInteractionLoading } = useIdeaInteraction({
    ideaId: _id,
    initialLikes: upvotes,
    initialDislikes: downvotes,
  });
  const { editingIdea, setEditingIdea, showActionMenu, handleCardClick, handleDelete, handleUpdate, toggleActionMenu, openEditModal } = useIdeaCard({
    _id,
    title,
    description,
  });

  return (
    <div className="card-container" onClick={handleCardClick}>
      <div className="upper-card">
        <div className="title-category">
          <LightbulbIcon />
          <span className="title">{title}</span>
          <span className="category">{category}</span>
        </div>
      </div>
      <p className="content">{description}</p>
      <div className="lower-card">
        <div className="creator">
          <Link to={`/userinfo/profile/${creator}`} className="creator-link" onClick={(e) => e.stopPropagation()}>
            <UserCircle /> {creator}
          </Link>
        </div>
        <div className="interaction">
          <div className="votes" onClick={(e) => e.stopPropagation()}>
            <LikeButton onClick={handleLike} isLiked={isLiked} likes={likes} disabled={isInteractionLoading} />
            <DislikeButton onClick={handleDislike} isDisliked={isDisliked} dislikes={dislikes} disabled={isInteractionLoading} />
          </div>
          <div className="comments"><MessageSquare size={20} /> {commentsCount} Comments</div>
          {user?.username === creator && (
            <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
              <button className="dots" onClick={toggleActionMenu}>⋮</button>
              {showActionMenu && (
                <div className={isDarkMode ? "dropdown-menu dark-drop" : "dropdown-menu"}>
                  <button onClick={openEditModal}>Edit</button>
                  <button onClick={handleDelete}>Delete</button>
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
              value={editingIdea.description}
              onChange={(e) => setEditingIdea({ ...editingIdea, description: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={handleUpdate}>Save Changes</button>
              <button onClick={() => setEditingIdea(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaCard;
