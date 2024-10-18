import React, { useEffect } from 'react';
import { ArrowUp, ArrowDown, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Like from '../Buttons/likeDislikeBtns/like';
import Dislike from '../Buttons/likeDislikeBtns/dislike';
import { useSelector } from 'react-redux';
import { selectUser } from '../Auth/userSlice';
import IdeaComments from '../comments/commentsCard';
import axios from 'axios';
import './ideaArea.scss';

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

// Step 2: Add props to the component
const IdeaArea: React.FC = () => {
  const [ideaDetails, setIdeaDetails] = useState<Idea | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [disliked, setDisliked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(0);
  const [dislikes, setDislikes] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);


  const user = useSelector(selectUser); // The logged-in user
  const { lookedUpIdea } = useParams<{ lookedUpIdea: string }>(); // Extract username from URL
  console.log(lookedUpIdea)

  // Fetch the profile data of the looked-up user and their ideas
  const fetchIdea = async (idea: string) => { 
    try {
      setLoading(true);
      // Step 1: Fetch user profile data by username
      const ideaResponse = await axios.get(`http://localhost:5000/idea/${idea}`);
      const ideaData = ideaResponse.data;
      


      // Assign extracted fields to the state
      setIdeaDetails({
        _id: ideaData._id,
        title: ideaData.title,
        description: ideaData.description,
        creator: ideaData.creator,
        category: ideaData.category,
        tags: ideaData.tags,
        upvotes: ideaData.upvotes,
        downvotes: ideaData.downvotes,
        comments: ideaData.comments?ideaData.comments:''
      });
      setLikes(ideaData.upvotes); // Set likes based on fetched data
      setDislikes(ideaData.downvotes); // Set dislikes based on fetched data

    } catch (error) {
      console.error('Error fetching user profile or ideas:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch user data and posted ideas when the component mounts or when lookedUpUsername changes
  useEffect(() => {
    if (lookedUpIdea) {
      fetchIdea(lookedUpIdea); // Fetch the looked-up user profile
    }
  }, [lookedUpIdea]);
 
  if (loading || !ideaDetails) {
    return <p>Loading idea details...</p>;
  }

  return (
    <div className="idea-page-cont">
      <div className="upper-card">
        <span className="title">{ideaDetails?ideaDetails.title:'new'}</span>
        <div className="category">{ideaDetails?ideaDetails.category:'new'}</div>
      </div>
      <p className="content">{ideaDetails?ideaDetails.description:'new'}</p>
      <div className="lower-card">
        <div>
            <Link to={`/user/profile/${ideaDetails?ideaDetails.creator:'new'}`} className="creator-link">
              {ideaDetails?ideaDetails.creator:'new'}
            </Link>
        </div>
        <div className="votes">
          <Like Id={ideaDetails?ideaDetails._id:'new'} setLikes={setLikes} likes={likes} setDislikes={setDislikes} dislikes={dislikes} liked={liked} setLiked={setLiked} disliked={disliked} setDisliked={setDisliked}></Like> 
          <Dislike Id={ideaDetails?ideaDetails._id:'new'} setLikes={setLikes} likes={likes} setDislikes={setDislikes} dislikes={dislikes} liked={liked} setLiked={setLiked} disliked={disliked} setDisliked={setDisliked}></Dislike>
        </div>
        <div className="comments">
          <MessageSquare />
          <div>
            <IdeaComments ideaId={lookedUpIdea?lookedUpIdea:''} reader={user.username?user.username:''}></IdeaComments>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaArea;
