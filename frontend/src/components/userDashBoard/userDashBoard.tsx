import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch for dispatching Redux actions
import axios from 'axios';
import IdeaCard from '../idea-card/idea-card';
import './user-cont.scss';
import { removePostedContent, selectUser, updateDesc } from '../Auth/userSlice';
import IdeaCardSkeleton from '../cardSkeleton/cardSkeleton';
import NoIdeasPlaceholder from '../noIdeas/noIdeas';
import { useNavigate } from 'react-router';
import { handleLogout } from '../Buttons/LogOutBtn/LogOutUser';

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
  const navigate = useNavigate();

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
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
    
        switch (status) {
          case 401:
            console.error('Unauthorized. Redirecting to login.');
            navigate('/signin');
            break;
    
          case 440:
            console.log('Session expired. Redirecting to login.');
            alert("Session expired. Please log in again then try.");
            await handleLogout(dispatch, navigate);
            break;
    
          case 403:
            console.error('Access forbidden. Invalid token.');
            alert("Invalid token. Please log in again.");
            await handleLogout(dispatch, navigate);
            break;
    
          case 500:
            console.error('Server error. Please try again later.');
            alert("A server error occurred. Please try again later.");
            break;
    
          default:
            console.error(`Unhandled error with status ${status}`);
        }
      }
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
              <div className="description-edit">
              <label className="description-edit__label">Edit Description</label>
              
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="description-edit__textarea"
              />
            
              <div className="description-edit__buttons">
                <button
                  onClick={handleDescriptionEdit}
                  className="description-edit__button description-edit__button--save"
                >
                  Save Description
                </button>
            
                <button
                  onClick={() => setEditingDescription(false)}
                  className="description-edit__button description-edit__button--cancel"
                >
                  Cancel
                </button>
              </div>
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
          loading ? Array.from({ length: 5 }).map((_, index) => <IdeaCardSkeleton key={index} />) : <NoIdeasPlaceholder dataStat='main'/>
        )}
      </div>
    </div>
  );
};

export default UserCont;

