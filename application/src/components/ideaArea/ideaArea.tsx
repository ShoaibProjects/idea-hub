import React, { useEffect, useState } from 'react';
import { UserCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Like from '../Buttons/likeDislikeBtns/like';
import Dislike from '../Buttons/likeDislikeBtns/dislike';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, removePostedContent } from '../Auth/userSlice';
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
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<boolean>(false);

  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { lookedUpIdea } = useParams<{ lookedUpIdea: string }>();

  const fetchIdea = async (idea: string) => {
    try {
      setLoading(true);
      const ideaResponse = await axios.get(`https://idea-hub-app.vercel.app/idea/${idea}`);
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

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`https://idea-hub-app.vercel.app/idea/delete/${ideaDetails?._id}`, { withCredentials: true });
      await axios.put(`https://idea-hub-app.vercel.app/user/${user.username}/remove-posted-idea`, { ideaId: ideaDetails?._id }, { withCredentials: true });
      if (response.status === 201) {
        alert('Idea deleted successfully!');
        dispatch(removePostedContent(ideaDetails?._id || ''));
      }
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  };

  const handleEdit = () => {
    setEditingIdea(ideaDetails);
  };

  const handleUpdateIdea = async () => {
    try {
      const response = await axios.put(`https://idea-hub-app.vercel.app/idea/update/${editingIdea?._id}`, editingIdea, { withCredentials: true });
      setIdeaDetails(response.data);
      setEditingIdea(null);
    } catch (error) {
      console.error('Error updating idea:', error);
    }
  };

  const toggleActionMenu = () => {
    setShowActionMenu(!showActionMenu);
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
    <div className="idea-page-cont">
      <div className="idea-container">
        <div className="header-section">
          <span className="idea-title">{ideaDetails.title}</span>
          <div className="creator-info">
            <Link to={`/userinfo/profile/${ideaDetails.creator}`} className="creator-link">
              <UserCircle></UserCircle>
              {ideaDetails.creator}
            </Link>
          </div>
          <div className="idea-category">{ideaDetails.category}</div>
        </div>
        <p className="idea-description">{ideaDetails.description}</p>

        <div className="footer-section">
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

          {ideaDetails.creator === user.username && (
            <div className="action-buttons">
              <button className="dots" onClick={toggleActionMenu}>⋮</button>
              {showActionMenu && (
                <div className="dropdown-menu">
                  <button onClick={handleEdit}>Edit</button>
                  <button onClick={handleDelete}>Delete</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Move the comments section here to the bottom of the card */}
        <div className="comments-section">
          <IdeaComments ideaId={lookedUpIdea || ''} reader={user?.username || ''} />
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
              <button onClick={handleUpdateIdea}>Save Changes</button>
              <button onClick={() => setEditingIdea(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeaArea;
