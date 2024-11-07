import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; // To get username from URL
import { selectUser } from '../Auth/userSlice';
import axios from 'axios';
import './userProfile.scss';
import IdeaCard from '../idea-card/idea-card';
import FollowBtn from '../Buttons/followBtn/followBtn';
import IdeaCardSkeleton from '../cardSkeleton/cardSkeleton';
import NoMoreIdeas from '../noIdeas/noMoreIdeas';

// Define interfaces for Idea and UserProfile
interface Idea {
  _id: string;
  title: string;
  description: string;
  creator: string;
  category: string[];
  tags: string[];
  upvotes: number;
  downvotes: number;
  comments: string[];
}

interface UserProfileData {
  username: string;
  postedIdeas: string[];  // Array of idea IDs
  followersCount: number; // Number of followers
  description?: string;   
}

function UserProfile() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [followed, setFollowed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const user = useSelector(selectUser); // The logged-in user
  const { lookedUpUsername } = useParams<{ lookedUpUsername: string }>(); // Extract username from URL

  // Fetch the profile data of the looked-up user and their ideas
  const fetchUserProfile = async (username: string) => {
    try {
      setLoading(true);
      // Step 1: Fetch user profile data by username
      const profileResponse = await axios.get(`https://idea-hub-app.vercel.app/user/${username}`);
      const userData = profileResponse.data;
      


      // Assign extracted fields to the state
      setUserProfile({
        username: userData.username,
        postedIdeas: userData.postedContent,
        followersCount: userData.followers ? userData.followers.length : 0, // Assuming followers is an array
        description: userData.description || 'No description provided', // Fallback if no description
      });
     
      // Step 2: Fetch each posted idea based on the idea IDs from profile
      const ideaPromises = userData.postedContent.map(async (ideaId: string) =>
        await axios.get<Idea>(`https://idea-hub-app.vercel.app/idea/${ideaId}`)
      );

      // Step 3: Await all idea fetches
      const ideasResponses = await Promise.all(ideaPromises);
      const fetchedIdeas = ideasResponses.map((res) => res.data);

      setIdeas(fetchedIdeas); // Store fetched ideas
      const isFollowedCond = user.following.includes(userData.username)
      setFollowed(isFollowedCond);
    } catch (error) {
      console.error('Error fetching user profile or ideas:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch user data and posted ideas when the component mounts or when lookedUpUsername changes
  useEffect(() => {
    if (lookedUpUsername) {
      fetchUserProfile(lookedUpUsername); // Fetch the looked-up user profile
    }
  }, [lookedUpUsername]);



  return (
    <div className='user-prof-cont'>
            {/* Display description and follower count */}
      {userProfile && (
        <>
          <div className='profile-head'>
          <h2>{userProfile ? `${userProfile.username}'s Profile` : 'Loading Profile...'}</h2>
          <div className='follow-cont'>
          <p className='followers-count'>{userProfile.followersCount} followers</p>
          {user.username!=userProfile.username && (
            <span><FollowBtn username={userProfile.username} isFollowed={followed} setFollowed={setFollowed}></FollowBtn></span>
          )}
          </div>
          <p>{userProfile.description}</p>
          </div>
        </>
      )}
      {/* Display posted ideas */}
      <div className="ideas-container">
        {ideas.length > 0 ? (
          ideas
          .slice() // Create a shallow copy of the array
          .reverse() // Reverse the order of the ideas
          .map((idea) => {
            
            return (
              <IdeaCard 
                key={idea._id}
                id={idea._id}
                title={idea.title}
                content={idea.description}
                creator={idea.creator}
                upvotes={idea.upvotes}
                downvotes={idea.downvotes}
                category={idea.category.join(', ')} // Assuming it's an array of categories
                comments={idea.comments.length}
                viewer={user.username?user.username:''}
              />
            );
          })
        ) : (
          loading ? Array.from({ length: 5 }).map((_, index) => <IdeaCardSkeleton key={index} />) : <NoMoreIdeas dataStat='main' />
        )}
      </div>
    </div>
  );
}

export default UserProfile;
