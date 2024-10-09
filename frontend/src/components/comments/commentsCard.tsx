import React, { useEffect, useState } from 'react';
import axios from 'axios';

const IdeaComments: React.FC<{ ideaId: string }> = ({ ideaId }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch comments when component mounts
  useEffect(() => {
    fetchComments();
  }, [ideaId]);

  if (loading) return <div>Loading comments...</div>; // Loading state
  if (error) return <div>{error}</div>; // Error state

  return (
    <div className="comments-container">
      <h3>Comments:</h3>
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="comment">
            <p><strong>{comment.creator}: </strong>{comment.description}</p>
            <small>{new Date(comment.date).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
};

export default IdeaComments;
