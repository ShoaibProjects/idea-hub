import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; // To get username from URL
import { selectUser } from '../Auth/userSlice';
import axios from 'axios';
import './userProfile.scss';
import IdeaCard from '../idea-card/idea-card';

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
  const [loading, setLoading] = useState<boolean>(false);

  const user = useSelector(selectUser); // The logged-in user
  const { lookedUpUsername } = useParams<{ lookedUpUsername: string }>(); // Extract username from URL

  // Fetch the profile data of the looked-up user and their ideas
  const fetchUserProfile = async (username: string) => {
    try {
      setLoading(true);
      // Step 1: Fetch user profile data by username
      const profileResponse = await axios.get(`http://localhost:5000/user/${username}`);
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
        await axios.get<Idea>(`http://localhost:5000/idea/${ideaId}`)
      );

      // Step 3: Await all idea fetches
      const ideasResponses = await Promise.all(ideaPromises);
      const fetchedIdeas = ideasResponses.map((res) => res.data);

      setIdeas(fetchedIdeas); // Store fetched ideas
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

  let order = 1;

  return (
    <div className='user-prof-cont'>
      <h2>{userProfile ? `${userProfile.username}'s Profile` : 'Loading Profile...'}</h2>
            {/* Display description and follower count */}
      {userProfile && (
        <>
          <p>{userProfile.description}</p>
          <p>{userProfile.followersCount} followers</p>
        </>
      )}
      {/* Display posted ideas */}
      <div className="ideas-container">
        {ideas.length > 0 ? (
          ideas
          .slice() // Create a shallow copy of the array
          .reverse() // Reverse the order of the ideas
          .map((idea) => {
            const currentOrder = order;
            order++; // Increment order after use
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
                category={idea.category.join(', ')} // Assuming it's an array of categories
                comments={0}  // Adjust as necessary
              />
            );
          })
        ) : (
          loading ? <p>Loading ideas...</p> : <p>No ideas to display.</p>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
