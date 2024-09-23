import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './main-cont.scss';

interface Idea {
  _id: string;
  title: string;
  description: string;
}

function MainCont() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);  // To check if more ideas are available
  const [shownIdeas, setShownIdeas] = useState<string[]>([]);  // Track all shown idea IDs

  // Fetch ideas based on the current page and shown ideas
  const fetchIdeas = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/idea/recommendations/john_doe?page=${page}&limit=20&shown=${shownIdeas.join(',')}`);
      const newIdeas: Idea[] = response.data;
      
      // Update shown ideas
      const uniqueIdeas = newIdeas.filter((idea) => !shownIdeas.includes(idea._id));
      setIdeas((prevIdeas) => [...prevIdeas, ...uniqueIdeas]);
      setShownIdeas((prevShown) => [...prevShown, ...uniqueIdeas.map(idea => idea._id)]);  // Track shown ideas
      // Update loading state and check for more pages
      setLoading(false);
      setHasMore(newIdeas.length > 0);  // Check if there are more ideas to load
    } catch (error) {
      console.error('Error fetching ideas:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchIdeas(page);
  }, [page]);

  // Infinite scrolling logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2 && !loading && hasMore) {
        setPage((prevPage) => prevPage + 1);  // Load next page when bottom is reached
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);  // Cleanup scroll listener
  }, [loading, hasMore]);

  return (
    <div className='main-cont'>
      <div className="ideas-container">
        {ideas.length > 0 ? (
          ideas.map((idea) => (
            <div key={idea._id} className="idea-card">
              <h2>{idea.title}</h2>
              <p>{idea.description}</p>
            </div>
          ))
        ) : (
          <p>Loading ideas...</p>
        )}

        {loading && <p>Loading more ideas...</p>}
        {!hasMore && <p>No more ideas to display.</p>}
      </div>
    </div>
  );
}

export default MainCont;
