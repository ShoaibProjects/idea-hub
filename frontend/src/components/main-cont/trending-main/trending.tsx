import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { selectUser } from '../../Auth/userSlice';
import IdeaCard from '../../idea-card/idea-card';
import './trending.scss';
import { selectCategories } from '../../../Redux-slices/categories/categorySlices';
import { FaFireAlt } from "react-icons/fa";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import IdeaCardSkeleton from '../../cardSkeleton/cardSkeleton';
import NoIdeasPlaceholder from '../../noIdeas/noIdeas';
import LoadingSpinner from '../../noIdeas/spinners';
import NoMoreIdeas from '../../noIdeas/noMoreIdeas';
import { handleLogout } from '../../Buttons/LogOutBtn/LogOutUser';
import { useNavigate } from 'react-router';

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
  const [period, setPeriod] = useState<string>("");  // Default to last 30 days
  const [category, setCategory] = useState<string>('');  // Default to all categories
  const user = useSelector(selectUser);
  const categories = useSelector(selectCategories);
  const [everLoaded, setEverLoaded] = useState<boolean>(false); 

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      if(ideas.length>0){
        setEverLoaded(true);
      } else{
        setEverLoaded(false);
      }
    }  catch (error: unknown) {
      console.error('Error fetching ideas:', error);
    
      // Check if the error is an AxiosError
      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
    
        switch (status) {
          case 401:
            console.error('Unauthorized. Redirecting to login.');
            navigate('/login');
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
      {/* Filters for period and category */}
      <div className="filters sticky">
        <h2>
          <FaFireAlt size={30} /> Trending Ideas
        </h2>
        <div>
          <label>Time Period: </label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="">All Time</option>
            <option value="30days">Last 30 Days</option>
            <option value="7days">Last 7 Days</option>
          </select>
        </div>

        <div>
          <label>Category: </label>
          <select className='select-class' value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="ideas-container">
        {loading ? (
          // Show skeletons while loading
          Array.from({ length: 5 }).map((_, index) => <IdeaCardSkeleton key={index} />)
        ) : ideas.length > 0 ? (
          ideas.map((idea) => (
            <IdeaCard
              key={idea._id}
              id={idea._id}
              title={idea.title}
              content={idea.description}
              creator={idea.creator}
              upvotes={idea.upvotes}
              downvotes={idea.downvotes} // Adjust as necessary
              category={idea.category}
              comments={idea.comments.length} // Adjust as necessary
              viewer={user?.username || ''}
            />
          ))
        ) : (
          <NoIdeasPlaceholder dataStat='main'/>// Handle case where there are no ideas   
        )}

        {loading && <LoadingSpinner />}
        {!hasMore && everLoaded && <NoMoreIdeas dataStat='main'/>}
      </div>
    </div>
  );
}

export default TrendingIdeas;
