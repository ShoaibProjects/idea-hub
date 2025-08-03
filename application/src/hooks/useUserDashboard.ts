import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { AppDispatch } from '../store';
import { selectUser, updateDesc } from './auth/userSlice';
import { useLogout } from '../utils/useLogout';
import userService from '../api/userService';
import { fetchIdeaById } from '../api/ideaService';

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

export const useUserDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const user = useSelector(selectUser);

    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isEditingDesc, setEditingDesc] = useState<boolean>(false);
    const [description, setDescription] = useState<string>(user.description || '');

    const fetchUserIdeas = useCallback(async () => {
        if (!user.postedContent || user.postedContent.length === 0) {
            setIdeas([]);
            return;
        }
        setIsLoading(true);
        try {
            const ideaPromises = user.postedContent.map(id => fetchIdeaById(id));
            const ideaResponses = await Promise.all(ideaPromises);
            setIdeas(ideaResponses.map(res => res.data));
        } catch (error) {
            console.error('Error fetching user ideas:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user.postedContent]);

    const handleSaveDescription = async () => {
        if (!user?.username) {
            alert("You must be logged in to update your description.");
            return;
        }
        try {
            await userService.updateUserDescription(user.username, { description });
            dispatch(updateDesc(description));
            setEditingDesc(false);
            alert('Description updated successfully!');
        } catch (err: unknown) {
            console.error('Error updating description:', err);
            if (axios.isAxiosError(err) && err.response) {
                const status = err.response.status;
                switch (status) {
                    case 401:
                        navigate('/signin');
                        break;
                    case 403:
                    case 440:
                        alert("Your session is invalid. Please log in again.");
                        await useLogout(dispatch, navigate);
                        break;
                    case 500:
                        alert("A server error occurred.");
                        break;
                    default:
                        alert("An unexpected error occurred.");
                }
            }
        }
    };

    useEffect(() => {
        fetchUserIdeas();
    }, [fetchUserIdeas]);

    return {
        user,
        ideas,
        isLoading,
        isEditingDesc,
        setEditingDesc,
        description,
        setDescription,
        handleSaveDescription,
    };
};
