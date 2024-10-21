import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './comments.scss'; // Import your SCSS file

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

  // Fetch comments from API
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/idea/${ideaId}/comments`);
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
        `http://localhost:5000/idea/comment/add`,
        { ideaId, creator: reader, description: newComment },
        { withCredentials: true }
      );
      setComments([response.data, ...comments]);
      setNewComment('');
      setIsAddingComment(false);
    } catch (err) {
      setSubmitError('Error adding comment');
      console.error(err);
    }
  };

  // Handle comment editing
  const handleEdit = async (commentId: string) => {
    if (!editText.trim()) return;

    try {
      const response = await axios.patch(
        `http://localhost:5000/idea/comment/update`,
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
    } catch (err) {
      console.error('Error editing comment:', err);
    }
  };

  // Handle comment deletion
  const handleDelete = async (commentId: string) => {
    try {
      await axios.delete(`http://localhost:5000/idea/comment/delete`, {
        params: { commentId, creator: reader, ideaId },
        withCredentials: true,
      });
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
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
