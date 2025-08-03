import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser, addLikedIdea, removeLikedIdea, addDislikedIdea, removeDislikedIdea } from './auth/userSlice';
import { updateIdeaCount, updateUserIdeaList } from '../api/ideaInteractionService';
import { useLogout } from '../utils/useLogout';

interface UseIdeaInteractionProps {
    ideaId: string;
    initialLikes: number;
    initialDislikes: number;
}

export const useIdeaInteraction = ({ ideaId, initialLikes, initialDislikes }: UseIdeaInteractionProps) => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSessionExpiredLogout = useLogout;

    const [likes, setLikes] = useState<number>(initialLikes);
    const [dislikes, setDislikes] = useState<number>(initialDislikes);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [isDisliked, setIsDisliked] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<any | null>(null);

    useEffect(() => {
        if (user) {
            setIsLiked(user.likedIdeas.includes(ideaId));
            setIsDisliked(user.dislikedIdeas.includes(ideaId));
        }
    }, [user, ideaId]);

    const executeInteraction = async (interaction: () => Promise<void>) => {
        if (!user.username) {
            alert('You need to log in first.');
            navigate('/');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await interaction();
        } catch (err: any) {
            console.error('Interaction error:', err);
            setError(err);
            if (err.response) {
                switch (err.response.status) {
                    case 401: navigate('/signin'); break;
                    case 403:
                    case 440:
                        alert("Session expired or invalid. Please log in again.");
                        handleSessionExpiredLogout(dispatch, navigate);
                        break;
                    default:
                        alert("An unexpected error occurred. Please try again.");
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLike = () => executeInteraction(async () => {
        const newLikedState = !isLiked;

        setIsLiked(newLikedState);
        setLikes(l => newLikedState ? l + 1 : l - 1);

        if (newLikedState) {
            dispatch(addLikedIdea(ideaId));
            if (isDisliked) {
                setIsDisliked(false);
                setDislikes(d => d - 1);
                dispatch(removeDislikedIdea(ideaId));
                await updateUserIdeaList(user.username || "", ideaId, 'disliked', 'remove');
                await updateIdeaCount(ideaId, 'dislikes', dislikes - 1);
            }
        } else {
            dispatch(removeLikedIdea(ideaId));
        }

        await updateUserIdeaList(user.username || "", ideaId, 'liked', newLikedState ? 'add' : 'remove');
        await updateIdeaCount(ideaId, 'likes', newLikedState ? likes + 1 : likes - 1);
    });

    const handleDislike = () => executeInteraction(async () => {
        const newDislikedState = !isDisliked;

        setIsDisliked(newDislikedState);
        setDislikes(d => newDislikedState ? d + 1 : d - 1);

        if (newDislikedState) {
            dispatch(addDislikedIdea(ideaId));
            if (isLiked) {
                setIsLiked(false);
                setLikes(l => l - 1);
                dispatch(removeLikedIdea(ideaId));
                await updateUserIdeaList(user.username || "", ideaId, 'liked', 'remove');
                await updateIdeaCount(ideaId, 'likes', likes - 1);
            }
        } else {
            dispatch(removeDislikedIdea(ideaId));
        }

        await updateUserIdeaList(user.username || "", ideaId, 'disliked', newDislikedState ? 'add' : 'remove');
        await updateIdeaCount(ideaId, 'dislikes', newDislikedState ? dislikes + 1 : dislikes - 1);
    });

    return { likes, dislikes, isLiked, isDisliked, handleLike, handleDislike, isLoading, error };
};
