import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './comments.scss'; // Import your SCSS file
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { handleLogout } from '../Buttons/LogOutBtn/LogOutUser';

const IdeaComments: React.FC<{ ideaId: string; reader: string }> = ({ ideaId, reader }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isAddingComment, setIsAddingComment] = useState<boolean>(false);
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch comments from API
  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://idea-hub-app.vercel.app/idea/${ideaId}/comments`);
      setComments(response.data);
    } catch (err) {
      setError('Error fetching comments');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle new comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(
        `https://idea-hub-app.vercel.app/idea/comment/add`,
        { ideaId, creator: reader, description: newComment },
        { withCredentials: true }
      );
      setComments([response.data, ...comments]);
      setNewComment('');
      setIsAddingComment(false);
    } catch (err: unknown) {
      setSubmitError('Error adding comment');
      console.error(err);
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
    
        switch (status) {
          case 401:
            console.error('Unauthorized. Redirecting to login.');
            navigate('/signin');
            break;
    
          case 440:
            console.log('Session expired. Redirecting to login.');
            alert("Session expired. Please log in again.");
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
      } else {
        console.error('Network error or request failed without response');
        alert("Network error. Please check your connection.");
      }
    }
  };

  // Handle comment editing
  const handleEdit = async (commentId: string) => {
    if (!editText.trim()) return;

    try {
      const response = await axios.patch(
        `https://idea-hub-app.vercel.app/idea/comment/update`,
        { commentId, creator: reader, description: editText },
        { withCredentials: true }
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? { ...comment, description: response.data.description } : comment
        )
      );
      setEditingComment(null);
      setEditText('');
    } catch (error: unknown) {
      console.error('Error updating Comment:', error);
    
      // Check if the error is an AxiosError
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
    
        switch (status) {
          case 401:
            console.error('Unauthorized. Redirecting to login.');
            navigate('/signin');
            break;
    
          case 440:
            console.log('Session expired. Redirecting to login.');
            alert("Session expired. Please log in again.");
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
      } else {
        console.error('Network error or request failed without response');
        alert("Network error. Please check your connection.");
      }
    }
    
  };

  // Handle comment deletion
  const handleDelete = async (commentId: string) => {
    try {
      await axios.delete(`https://idea-hub-app.vercel.app/idea/comment/delete`, {
        params: { commentId, creator: reader, ideaId },
        withCredentials: true,
      });
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
    } catch (error: unknown) {
      console.error('Error deleting comment:', error);
    
      // Check if the error is an AxiosError
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
    
        switch (status) {
          case 401:
            console.error('Unauthorized. Redirecting to login.');
            navigate('/signin');
            break;
    
          case 440:
            console.log('Session expired. Redirecting to login.');
            alert("Session expired. Please log in again.");
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
      } else {
        console.error('Network error or request failed without response');
        alert("Network error. Please check your connection.");
      }
    }
    
  };

  // Toggle options for a specific comment
  const toggleOptions = (commentId: string) => {
    setActiveComment(activeComment === commentId ? null : commentId);
  };

  useEffect(() => {
    fetchComments();
  }, [ideaId]);

  if (loading) return <div className="loading">Loading comments...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="comments-container">
      <h3>Comments:</h3>

      <button className="add-comment-btn" onClick={() => setIsAddingComment(!isAddingComment)}>
        {isAddingComment ? 'Cancel' : 'Add Comment'}
      </button>

      {isAddingComment && (
        <form onSubmit={handleCommentSubmit} className="add-comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your comment..."
            rows={3}
            className="comment-input"
          />
          <button type="submit" className="submit-btn">Submit</button>
          {submitError && <p className="error-message">{submitError}</p>}
        </form>
      )}

      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="comment">
            {reader === comment.creator && (
              <div className="comment-options">
                <span className="dots-menu" onClick={() => toggleOptions(comment._id)}>•••</span>
                {activeComment === comment._id && (
                  <div className="options-dropdown">
                    <button className="option-btn" onClick={() => setEditingComment(comment._id)}>Edit</button>
                    <button className="option-btn" onClick={() => handleDelete(comment._id)}>Delete</button>
                  </div>
                )}
              </div>
            )}
            {editingComment === comment._id ? (
              <div className="edit-comment">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={2}
                  className="comment-input"
                />
                <button className="submit-btn" onClick={() => handleEdit(comment._id)}>Save</button>
                <button className="cancel-btn" onClick={() => setEditingComment(null)}>Cancel</button>
              </div>
            ) : (
              <p>
                <strong>{comment.creator}:</strong> {comment.description}
              </p>
            )}
            <small className="comment-date">{new Date(comment.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default IdeaComments;
