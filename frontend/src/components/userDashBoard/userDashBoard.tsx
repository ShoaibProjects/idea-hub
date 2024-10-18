import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch for dispatching Redux actions
import axios from 'axios';
import IdeaCard from '../idea-card/idea-card';
import './user-cont.scss';

import { removePostedContent, selectUser, setUser, updateDesc } from '../Auth/userSlice';

interface Idea {
  _id: string;
  title: string;
  description: string;
  creator: string;
  category: string[];
  tags: string[];
  upvotes: number;
  downvotes: number;
  comments: string[];
}

const UserCont: React.FC = () => {
  const user = useSelector(selectUser);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [editingDescription, setEditingDescription] = useState<boolean>(false); // State for editing user description
  const [description, setDescription] = useState<string>(user.description || ''); // State for user description
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const dispatch = useDispatch(); // Add useDispatch hook
  console.log(user.preferences)

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const ideaPromises = user.postedContent.map(async (ideaId: string) =>
        await axios.get<Idea>(`http://localhost:5000/idea/${ideaId}`)
      );
      const ideasResponses = await Promise.all(ideaPromises);
      const fetchedIdeas = ideasResponses.map((res) => res.data);
      setIdeas(fetchedIdeas);
    } catch (error) {
      console.error('Error fetching user ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ideaId: string) => {
    try {
      const response = await axios.delete(`http://localhost:5000/idea/delete/${ideaId}`, { withCredentials: true });
      setIdeas(ideas.filter((idea) => idea._id !== ideaId));
      await axios.put(`http://localhost:5000/user/${user.username}/remove-posted-idea`, { ideaId }, { withCredentials: true });
      if (response.status === 201) {
        alert('Idea deleted successfully!');
        dispatch(removePostedContent(ideaId));
      }
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  };

  const handleEdit = (idea: Idea) => {
    setEditingIdea(idea);
  };

  const handleUpdateIdea = async (updatedIdea: Idea) => {
    try {
      const response = await axios.put(`http://localhost:5000/idea/update/${updatedIdea._id}`, updatedIdea, { withCredentials: true });
      const updatedIdeas = ideas.map((idea) =>
        idea._id === response.data._id ? response.data : idea
      );
      setIdeas(updatedIdeas);
      setEditingIdea(null);
    } catch (error) {
      console.error('Error updating idea:', error);
    }
  };

  const toggleActionMenu = (ideaId: string) => {
    setShowActionMenu(showActionMenu === ideaId ? null : ideaId);
  };

  const handleDescriptionEdit = async () => {
    try {
      const response = await axios.patch(`http://localhost:5000/user/update/description`, 
        { username: user.username,
          description },
        { withCredentials: true });
      if (response.status === 200) {
        alert('Description updated successfully!');
        dispatch(updateDesc(description));
        setEditingDescription(false);
      }
    } catch (error) {
      console.error('Error updating description:', error);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  return (
    <div className='user-cont'>
      <h2>{user ? `${user.username}'s Profile` : 'Loading Profile...'}</h2>
      {user && (
        <>
          {editingDescription ? (
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <button onClick={handleDescriptionEdit}>Save Description</button>
              <button onClick={() => setEditingDescription(false)}>Cancel</button>
            </div>
          ) : (
            <>
              <p>{user.description || 'No description'}</p>
              <button onClick={() => setEditingDescription(true)}>Edit Description</button>
            </>
          )}
          <p>{user.followers.length} followers</p>
        </>
      )}

      <div className="ideas-container">
        {ideas.length > 0 ? (
          ideas
            .slice()
            .reverse()
            .map((idea) => (
              <div key={idea._id} className="idea-item">
                <IdeaCard
                  id={idea._id}
                  title={idea.title}
                  content={idea.description}
                  creator={idea.creator}
                  upvotes={idea.upvotes}
                  downvotes={idea.downvotes}
                  category={idea.category.join(', ')}
                  comments={idea.comments.length}
                  viewer={user.username?user.username:''}
                />
                <div className="action-menu">
                  <button className="dots" onClick={() => toggleActionMenu(idea._id)}>⋮</button>
                  {showActionMenu === idea._id && (
                    <div className="dropdown-menu">
                      <button onClick={() => handleEdit(idea)}>Edit</button>
                      <button onClick={() => handleDelete(idea._id)}>Delete</button>
                    </div>
                  )}
                </div>
              </div>
            ))
        ) : (
          loading ? <p>Loading ideas...</p> : <p>No ideas to display.</p>
        )}
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
              <button onClick={() => handleUpdateIdea(editingIdea)}>Save Changes</button>
              <button onClick={() => setEditingIdea(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCont;
