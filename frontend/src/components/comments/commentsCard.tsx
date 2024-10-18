import React, { useEffect, useState } from 'react';
import axios from 'axios';

const IdeaComments: React.FC<{ ideaId: string; reader: string }> = ({ ideaId, reader }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>(''); // State for new comment input
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null); // Error for submitting comments
  const [isAddingComment, setIsAddingComment] = useState<boolean>(false); // Track whether the form is visible
  const [activeComment, setActiveComment] = useState<string | null>(null); // Track which comment's options are visible
  const [editingComment, setEditingComment] = useState<string | null>(null); // Track which comment is being edited
  const [editText, setEditText] = useState<string>(''); // State for editing comment text

  // Function to fetch comments
  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/idea/${ideaId}/comments`);
      setComments(response.data); // Set comments to state
    } catch (err) {
      setError('Error fetching comments'); // Handle errors
      console.error(err);
    } finally {
      setLoading(false); // Set loading to false once the fetch is complete
    }
  };

  // Function to handle new comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return; // Don't submit if the input is empty

    try {
      const response = await axios.post(
        `http://localhost:5000/idea/comment/add`,
        { ideaId, creator: reader, description: newComment },
        { withCredentials: true }
      );
      setComments([response.data, ...comments]); // Add the new comment to the top of the state
      setNewComment(''); // Clear the input field after successful submission
      setIsAddingComment(false); // Hide the form after submission
    } catch (err) {
      setSubmitError('Error adding comment');
      console.error(err);
    }
  };

  // Function to handle comment editing
  const handleEdit = async (commentId: string) => {
    if (!editText.trim()) return; // Don't submit if the input is empty

    try {
      const response = await axios.patch(
        `http://localhost:5000/idea/comment/update`,
        { commentId, creator: reader, description: editText },
        { withCredentials: true }
      );
      // Update the comment in state after successful edit
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? { ...comment, description: response.data.description } : comment
        )
      );
      setEditingComment(null); // Exit editing mode
      setEditText(''); // Clear the edit text
    } catch (err) {
      console.error('Error editing comment:', err);
    }
  };

  // Function to handle comment deletion
  const handleDelete = async (commentId: string) => {
    try {
      await axios.delete(`http://localhost:5000/idea/comment/delete`, {
        params: {
          commentId,
          creator: reader,
        },
        withCredentials: true,
      });
      // Remove the comment from state after successful deletion
      setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  // Toggle visibility of options for a specific comment
  const toggleOptions = (commentId: string) => {
    setActiveComment(activeComment === commentId ? null : commentId);
  };

  // Fetch comments when component mounts
  useEffect(() => {
    fetchComments();
  }, [ideaId]);

  if (loading) return <div>Loading comments...</div>; // Loading state
  if (error) return <div>{error}</div>; // Error state

  return (
    <div className="comments-container">
      <h3>Comments:</h3>

      {/* Add Comment Button */}
      <button onClick={() => setIsAddingComment(!isAddingComment)}>
        {isAddingComment ? 'Cancel' : 'Add Comment'}
      </button>

      {/* Collapsible form for adding a new comment */}
      {isAddingComment && (
        <form onSubmit={handleCommentSubmit} className="add-comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your comment..."
            rows={3}
          />
          <button type="submit">Submit</button>
          {submitError && <p className="error-message">{submitError}</p>}
        </form>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="comment" style={{ position: 'relative' }}>
            {/* Dots menu at the top right */}
            {reader === comment.creator && (
              <div className="comment-options" style={{ position: 'absolute', top: 0, right: 0 }}>
                <span
                  className="dots-menu"
                  onClick={() => toggleOptions(comment._id)}
                  style={{ cursor: 'pointer', position: 'absolute', top: 0, right: 0 }}
                >
                  •••
                </span>

                {/* Show edit/delete options when the dots are clicked */}
                {activeComment === comment._id && (
                  <div className="options-dropdown" style={{ position: 'absolute', top: '20px', right: 0 }}>
                    <button onClick={() => setEditingComment(comment._id)}>Edit</button>
                    <button onClick={() => handleDelete(comment._id)}>Delete</button>
                  </div>
                )}
              </div>
            )}

            {/* If editing, show a textarea, otherwise show the comment */}
            {editingComment === comment._id ? (
              <div className="edit-comment">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={2}
                />
                <button onClick={() => handleEdit(comment._id)}>Save</button>
                <button onClick={() => setEditingComment(null)}>Cancel</button>
              </div>
            ) : (
              <p>
                <strong>{comment.creator}: </strong>{comment.description}
              </p>
            )}
            <small>{new Date(comment.createdAt).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default IdeaComments;
