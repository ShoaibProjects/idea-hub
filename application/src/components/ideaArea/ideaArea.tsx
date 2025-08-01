import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../hooks/auth/userSlice';
import { useIdeaDetails } from '../../hooks/useIdeaDetails';
import { useIdeaInteraction } from '../../hooks/useIdeaInteraction';
import LikeButton from '../Buttons/likeDislikeBtns/like';
import DislikeButton from '../Buttons/likeDislikeBtns/dislike';
import IdeaComments from '../comments/commentsCard';
import './ideaArea.scss';

const IdeaArea: React.FC = () => {
  const { idea, loading, error, editingIdea, setEditingIdea, handleDelete, handleUpdate } = useIdeaDetails();
  const user = useSelector(selectUser);
  const [showActionMenu, setShowActionMenu] = useState(false);

  const interaction = useIdeaInteraction({
    ideaId: idea?._id || '',
    initialLikes: idea?.upvotes || 0,
    initialDislikes: idea?.downvotes || 0,
  });

  if (loading) return <p className="loading-message">Loading idea details...</p>;
  if (error || !idea) return <p className="error-message">{error || 'Idea not found.'}</p>;

  return (
    <div className="idea-page-cont">
      <div className="idea-container">
        <div className="header-section">
          <span className="idea-title">{idea.title}</span>
          <div className="creator-info">
            <Link to={`/userinfo/profile/${idea.creator}`} className="creator-link">
              <UserCircle /> {idea.creator}
            </Link>
          </div>
          <div className="idea-category">{idea.category}</div>
        </div>
        <p className="idea-description">{idea.description}</p>

        <div className="footer-section">
          <div className="interactions">
            <LikeButton onClick={interaction.handleLike} isLiked={interaction.isLiked} likes={interaction.likes} disabled={interaction.isLoading} />
            <DislikeButton onClick={interaction.handleDislike} isDisliked={interaction.isDisliked} dislikes={interaction.dislikes} disabled={interaction.isLoading} />
          </div>

          {user?.username === idea.creator && (
            <div className="action-buttons">
              <button className="dots" onClick={() => setShowActionMenu(!showActionMenu)}>⋮</button>
              {showActionMenu && (
                <div className="dropdown-menu">
                  <button onClick={() => { setEditingIdea(idea); setShowActionMenu(false); }}>Edit</button>
                  <button onClick={handleDelete}>Delete</button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="comments-section">
          <IdeaComments ideaId={idea._id} />
        </div>
      </div>

      {editingIdea && (
        <div className="modal">
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

export default IdeaArea;
