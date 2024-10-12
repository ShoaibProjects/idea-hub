import React, { useEffect, useState } from 'react';
import { useSelector} from 'react-redux';
import { selectUser } from '../../Auth/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './main-cont.scss';
import IdeaCard from '../../idea-card/idea-card';

interface Idea {
  _id: string;
  title: string;
  description: string;
  creator: string;
  category: string[];
  tags: string[];
  upvotes: number;
  downvotes: number;
}

function MainCont() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);  // To check if more ideas are available
  const [shownIdeas, setShownIdeas] = useState<string[]>([]);  // Track all shown idea IDs
  const user = useSelector(selectUser);

  const navigate = useNavigate();


  
  // Fetch ideas based on the current page and shown ideas
  const fetchIdeas = async (page: number) => {
    try {
      setLoading(true);
      console.log(page, 'p');
  
      // // Get the token from cookies
      // const token = document.cookie;
      // console.log('Token:', token);
  
      // // Check if the token exists
      // if (!token) {
      //   console.error('No token found, redirecting to login.');
      //   navigate('/signin'); // Assuming you're using react-router's navigate
      //   return;
      // }
  
      // Make the request with the Authorization header
      const response = await axios.get(
        `http://localhost:5000/idea/recommendations/${user.username}?page=${page}&limit=20&shown=${shownIdeas.join(',')}`,
        {
          withCredentials: true,  // Include cookies in the request
        }
      );
  
      const newIdeas: Idea[] = response.data;
      console.log(newIdeas, 'ni');
  
      // Filter out ideas that have already been shown
      const uniqueIdeas = newIdeas.filter((idea) => !shownIdeas.includes(idea._id));
      console.log(uniqueIdeas, 'u');
  
      // Update state with the new unique ideas
      setIdeas((prevIdeas) => [...prevIdeas, ...uniqueIdeas]);
      setShownIdeas((prevShown) => [...prevShown, ...uniqueIdeas.map((idea) => idea._id)]); // Track shown ideas
  
      // Update loading state and check if there are more ideas to load
      setLoading(false);
      setHasMore(newIdeas.length > 0); // Check if there are more ideas to load
  
    } catch (error) {
      console.error('Error fetching ideas:', error);
  
      // // Handle token-related errors (e.g., 401 Unauthorized)
      // if (error.response && error.response.status === 401) {
      //   console.error('Unauthorized. Redirecting to login.');
      //   navigate('/login');  // Redirect to login if unauthorized
      // }
  
      setLoading(false);
    }
  };
  

  useEffect(() => {
    // Initial fetch
    fetchIdeas(page);
    console.log(ideas.length)
    // console.log(page)
  }, [page]);

  // Infinite scrolling logic
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 100 && !loading && hasMore) {
        setPage((prevPage) => prevPage + 1);  // Load next page when bottom is reached
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);  // Cleanup scroll listener
  }, [loading, hasMore]);

  let order = 1;

  return (
    <div className='main-cont'>
      <div className="ideas-container">
        {ideas.length > 0 ? (
          ideas.map((idea) => {
            const currentOrder = order;
            order++;  // Increment order after use
            return (
              <IdeaCard 
                key={idea._id} 
                order={currentOrder} 
                id={idea._id} 
                title={idea.title} 
                content={idea.description} 
                creator={idea.creator}
                upvotes={idea.upvotes} 
                downvotes={idea.downvotes} 
                category='' 
                comments={0}
              />
            );
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

export default MainCont;
