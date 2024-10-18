import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { selectUser } from '../../Auth/userSlice';
import IdeaCard from '../../idea-card/idea-card';
import './trending.scss';
import { selectCategories } from '../../../Redux-slices/categories/categorySlices';

interface Idea {
  _id: string;
  title: string;
  description: string;
  creator: string;
  upvotes: number;
  downvotes: number;
  category: string;
  comments: string[];
}

function TrendingIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);  // For tracking if more ideas are available
  const [period, setPeriod] = useState<string>("7days");  // Default to last 30 days
  const [category, setCategory] = useState<string>('');  // Default to all categories
  const user = useSelector(selectUser);
  const categories = useSelector(selectCategories);

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
      if (page === 1) {
        setIdeas(newIdeas);  // Replace ideas with new data if it's the first page
      } else {
        setIdeas((prevIdeas) => [...prevIdeas, ...newIdeas]);  // Append new ideas to the list
      }
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

  useEffect(() => {
    setPage(1);   // Reset page to 1
    setIdeas([]); // Clear the ideas array
    fetchTrendingIdeas(1); // Fetch new ideas
  }, [period, category]);

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
    <div className='trend-cont'>
      <h2>Trending Ideas</h2>

      {/* Filters for period and category */}
      <div className="filters">
        <label>Time Period: </label>
        <select value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="">All Time</option>
          <option value="30days">Last 30 Days</option>
          <option value="7days">Last 7 Days</option>
        </select>

        <label>Category: </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
        </select>
      </div>

      <div className="ideas-container">
        {ideas.length > 0 ? (
          ideas.map((idea) => {
            
            return (
              <IdeaCard
              key={idea._id}
              id={idea._id}
              title={idea.title}
              content={idea.description}
              creator={idea.creator}
              upvotes={idea.upvotes}
              downvotes={idea.downvotes}  // Adjust as necessary
              category={idea.category}
              comments={idea.comments.length}  // Adjust as necessary
              viewer={user.username?user.username:''}
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
