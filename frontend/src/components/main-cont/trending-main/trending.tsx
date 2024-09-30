import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { selectUser } from '../../Auth/userSlice';
import IdeaCard from '../../idea-card/idea-card';
import './trending.scss';

interface Idea {
  _id: string;
  title: string;
  description: string;
  upvotes: number;
  category: string;
}

function TrendingIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);  // For tracking if more ideas are available
  const [period, setPeriod] = useState<string>('');  // Default to last 30 days
  const [category, setCategory] = useState<string>('');  // Default to all categories
  const user = useSelector(selectUser);

  // Fetch trending ideas with pagination and filters
  const fetchTrendingIdeas = async (page: number) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/idea/trending`, {
        params: {
          page,
          limit: 20,
          period,
          category,
        },
      });
      const newIdeas: Idea[] = response.data;
      setIdeas((prevIdeas) => [...prevIdeas, ...newIdeas]);  // Append new ideas to the list
      setLoading(false);
      setHasMore(newIdeas.length > 0);  // Check if there are more ideas to load
    } catch (error) {
      console.error('Error fetching trending ideas:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch when page or filters change
    fetchTrendingIdeas(page);
  }, [page, period, category]);

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
  let order = 1;
  return (
    <div className='trend-cont'>
      <h2>Trending Ideas</h2>

      {/* Filters for period and category */}
      <div className="filters">
        <label>Time Period: </label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="30days">Last 30 Days</option>
          <option value="7days">Last 7 Days</option>
          <option value="">All Time</option>
        </select>

        <label>Category: </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="tech">Tech</option>
          <option value="science">Science</option>
          <option value="art">Art</option>
          {/* Add other categories as needed */}
        </select>
      </div>

      <div className="ideas-container">
        {ideas.length > 0 ? (
          ideas.map((idea) => {
            const currentOrder = order;
            order++; 
            return (
              <IdeaCard
              key={idea._id}
              id={idea._id}
              order={currentOrder}
              title={idea.title}
              content={idea.description}
              upvotes={idea.upvotes}
              downvotes={0}  // Adjust as necessary
              category={idea.category}
              comments={0}  // Adjust as necessary
            />
            )
})
        ) : (
          <p>Loading ideas...</p>
        )}

        {loading && <p>Loading more ideas...</p>}
        {!hasMore && <p>No more ideas to display.</p>}
      </div>
    </div>
  );
}

export default TrendingIdeas;
