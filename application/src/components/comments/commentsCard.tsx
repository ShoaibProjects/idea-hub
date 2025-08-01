import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../hooks/auth/userSlice';
import { useComments } from '../../hooks/useComments';
import './comments.scss';

const IdeaComments: React.FC<{ ideaId: string }> = ({ ideaId }) => {
  const { comments, loading, error, handleAddComment, handleUpdateComment, handleDeleteComment } = useComments(ideaId);
  const user = useSelector(selectUser);

  const [isAddingComment, setIsAddingComment] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');

  const onCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitError(null);
    try {
      await handleAddComment(newComment);
      setNewComment('');
      setIsAddingComment(false);
    } catch (err) {
      setSubmitError('Failed to add comment. Please try again.');
    }
  };

  const onEditSubmit = async (commentId: string) => {
    if (!editText.trim()) return;
    try {
      await handleUpdateComment(commentId, editText);
      setEditingComment(null);
      setEditText('');
    } catch (err) {
      alert('Failed to update comment.');
    }
  };

  const toggleOptions = (commentId: string) => {
    setActiveComment(activeComment === commentId ? null : commentId);
  };

  if (loading) return <div className="loading">Loading comments...</div>;
  if (error) return <div className="error">Could not load comments.</div>;

  return (
    <div className="comments-container">
      <h3>Comments:</h3>
      <button className="add-comment-btn" onClick={() => setIsAddingComment(!isAddingComment)}>
        {isAddingComment ? 'Cancel' : 'Add Comment'}
      </button>

      {isAddingComment && (
        <form onSubmit={onCommentSubmit} className="add-comment-form">
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

      {comments.map((comment) => (
        <div key={comment._id} className="comment">
          {user?.username === comment.creator && (
            <div className="comment-options">
              <span className="dots-menu" onClick={() => toggleOptions(comment._id)}>•••</span>
              {activeComment === comment._id && (
                <div className="options-dropdown">
                  <button className="option-btn" onClick={() => { setEditingComment(comment._id); setEditText(comment.description); toggleOptions(comment._id); }}>Edit</button>
                  <button className="option-btn" onClick={() => handleDeleteComment(comment._id)}>Delete</button>
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
              <div className='comment-edit-btns'>
                <button className="submit-btn" onClick={() => onEditSubmit(comment._id)}>Save</button>
                <button className="cancel-btn" onClick={() => setEditingComment(null)}>Cancel</button>
              </div>
            </div>
          ) : (
            <p><strong>{comment.creator}:</strong> {comment.description}</p>
          )}
          <small className="comment-date">{new Date(comment.createdAt).toLocaleString()}</small>
        </div>
      ))}
      {comments.length === 0 && !loading && <p>No comments yet.</p>}
    </div>
  );
};

export default IdeaComments;
