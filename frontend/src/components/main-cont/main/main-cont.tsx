import { useEffect, useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { selectUser } from '../../Auth/userSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './main-cont.scss';
import IdeaCard from '../../idea-card/idea-card';
import 'react-loading-skeleton/dist/skeleton.css';
import IdeaCardSkeleton from '../../cardSkeleton/cardSkeleton';
import NoIdeasPlaceholder from '../../noIdeas/noIdeas';
import LoadingSpinner from '../../noIdeas/spinners';
import NoMoreIdeas from '../../noIdeas/noMoreIdeas';
import { handleLogout } from '../../Buttons/LogOutBtn/LogOutUser';

interface Idea {
  _id: string;
  title: string;
  description: string;
  creator: string;
  category: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  comments: string[];
}

function MainCont() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);  // To check if more ideas are available
  const [shownIdeas, setShownIdeas] = useState<string[]>([]);  // Track all shown idea IDs
  const user = useSelector(selectUser);
  const [everLoaded, setEverLoaded] = useState<boolean>(false); 

  const navigate = useNavigate();
  const dispatch = useDispatch();


  
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
        `https://idea-hub-api.vercel.app/idea/recommendations/${user.username}?page=${page}&limit=20&shown=${shownIdeas.join(',')}`,
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
      if(ideas.length>0){
        setEverLoaded(true);
      } else{
        setEverLoaded(false);
      }
  
    } catch (error: unknown) {
        console.error('Error fetching ideas:', error);
      
        // Check if the error is an AxiosError
        if (axios.isAxiosError(error) && error.response) {
          const status = error.response.status;
      
          switch (status) {
            case 401:
              console.error('Unauthorized. Redirecting to login.');
              navigate('/signin');
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


  return (
    <div className='main-cont'>
      <div className="ideas-container">
        {loading ? ( // Check if loading is true
          // Show skeletons while loading
          Array.from({ length: 5 }).map((_, index) => <IdeaCardSkeleton key={index} />)
        ) : ideas.length > 0 ? (
          ideas.map((idea) => {
            return (
              <IdeaCard 
                key={idea._id} 
                id={idea._id} 
                title={idea.title} 
                content={idea.description} 
                creator={idea.creator}
                upvotes={idea.upvotes} 
                downvotes={idea.downvotes} 
                category={idea.category} 
                comments={idea.comments.length}
                viewer={user?.username || ''} // Using optional chaining
              />
            );
          })
        ) : (
          <NoIdeasPlaceholder dataStat='main'/>// Handle case where there are no ideas  
        )}

        {loading && <LoadingSpinner />}
        {!hasMore && everLoaded && <NoMoreIdeas dataStat='main'/>}
      </div>
    </div>
  );
  
}

export default MainCont;
