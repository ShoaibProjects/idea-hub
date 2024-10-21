import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch for dispatching Redux actions
import axios from 'axios';
import IdeaCard from '../idea-card/idea-card';
import './user-cont.scss';
import { removePostedContent, selectUser, updateDesc } from '../Auth/userSlice';

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
  const [editingDescription, setEditingDescription] = useState<boolean>(false); // State for editing user description
  const [description, setDescription] = useState<string>(user.description || ''); // State for user description
  const dispatch = useDispatch(); // Add useDispatch hook

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

  const handleDescriptionEdit = async () => {
    try {
      const response = await axios.patch(`http://localhost:5000/user/update/description`,
        { username: user.username, description },
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
      <div className='profile-head'>
        <h2>{user ? `${user.username}'s dashboard` : 'Loading Profile...'}</h2>
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
              <div className='desc-cont'>
              <p>{user.description || 'No description'}</p>
              <button className='edit-desc-btn' onClick={() => setEditingDescription(true)}>Edit Description</button>
              </div>
              </>
            )}
            <p className='followers-count'>{user.followers.length} followers</p>
          </>
        )}
      </div>

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
                  viewer={user.username ? user.username : ''}
                />
              </div>
            ))
        ) : (
          loading ? <p>Loading ideas...</p> : <p>No ideas to display.</p>
        )}
      </div>
    </div>
  );
};

export default UserCont;
