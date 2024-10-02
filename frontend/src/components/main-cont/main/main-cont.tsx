import React, { useEffect, useState } from 'react';
import { useSelector} from 'react-redux';
import { selectUser } from '../../Auth/userSlice';
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


  // Fetch ideas based on the current page and shown ideas
  const fetchIdeas = async (page: number) => {
    try {
      setLoading(true);
      console.log(page,'p')
      const response = await axios.get(`http://localhost:5000/idea/recommendations/${user.username}?page=${page}&limit=20&shown=${shownIdeas.join(',')}`);
      const newIdeas: Idea[] = response.data;
      console.log(newIdeas,'ni')
      // Update shown ideas
      const uniqueIdeas = newIdeas.filter((idea) => !shownIdeas.includes(idea._id));
      console.log(uniqueIdeas,'u')
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
