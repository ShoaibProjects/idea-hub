import React, { useEffect, useState } from 'react';
import { useSelector,  } from 'react-redux';
import axios from 'axios';
import IdeaCard from '../idea-card/idea-card';
import './user-cont.scss';

// Assume we have the Redux store to select the user
import { removePostedContent, selectUser } from '../Auth/userSlice';

interface Idea {
  _id: string;
  title: string;
  description: string;
  creator: string;
  category: string[];
  tags: string[];
  upvotes: number;
  downvotes: number;
}

const UserCont: React.FC = () => {
  const user = useSelector(selectUser);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null); // For showing action menu for a specific idea

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
      const response= await axios.delete(`http://localhost:5000/idea/delete/${ideaId}`, { withCredentials: true });
      setIdeas(ideas.filter((idea) => idea._id !== ideaId)); // Remove the deleted idea from the list
      await axios.put(`http://localhost:5000/user/${user.username}/remove-posted-idea`, {
        ideaId,
    }, { withCredentials: true });
    if (response.status === 201) {
      alert('Idea deleted successfully!');
      dispatch(removePostedContent(ideaId));
  }
    } catch (error) {
      console.error('Error deleting idea:', error);
    }
  };

  const handleEdit = (idea: Idea) => {
    setEditingIdea(idea); // Set the idea to edit
  };

  const handleUpdateIdea = async (updatedIdea: Idea) => {
    try {
      const response = await axios.put(`http://localhost:5000/idea/update/${updatedIdea._id}`, updatedIdea, { withCredentials: true });
      const updatedIdeas = ideas.map((idea) =>
        idea._id === response.data._id ? response.data : idea
      );
      setIdeas(updatedIdeas);
      setEditingIdea(null); // Close the edit modal after successful update
    } catch (error) {
      console.error('Error updating idea:', error);
    }
  };

  // Show/hide the action menu
  const toggleActionMenu = (ideaId: string) => {
    setShowActionMenu(showActionMenu === ideaId ? null : ideaId);
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  return (
    <div className='user-cont'>
      <h2>{user ? `${user.username}'s Profile` : 'Loading Profile...'}</h2>
      {user && (
        <>
          <p>No description</p>
          <p>{user.followers.length} followers</p>
        </>
      )}
      <div className="ideas-container">
        {ideas.length > 0 ? (
          ideas
            .slice() // Create a shallow copy of the array
            .reverse() // Reverse the order of the ideas
            .map((idea) => (
              <div key={idea._id} className="idea-item">
                <IdeaCard
                  order={ideas.length - ideas.indexOf(idea)}
                  id={idea._id}
                  title={idea.title}
                  content={idea.description}
                  creator={idea.creator}
                  upvotes={idea.upvotes}
                  downvotes={idea.downvotes}
                  category={idea.category.join(', ')} // Assuming it's an array of categories
                  comments={0}                />

                {/* Action menu with dots */}
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

      {/* Modal for editing idea */}
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
            {/* Add other fields like category and tags here */}
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
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}

