import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from './auth/userSlice';
import { useLogout } from '../utils/useLogout';
import { fetchRecommendedIdeas } from '../api/feedService';
import { Idea } from '../types/ideaTypes';

export const useInfiniteIdeas = () => {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [shownIdeas, setShownIdeas] = useState<string[]>([]);

    const user = useSelector(selectUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleSessionExpiredLogout = useLogout;

    const loadMoreIdeas = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        if (!user?.username) {
            alert("You must be logged in to submit an idea.");
            return;
        }
        try {
            const newIdeas = await fetchRecommendedIdeas({ username: user.username, page, shownIdeas });

            if (newIdeas.length === 0) {
                setHasMore(false);
            } else {
                setIdeas(prev => [...prev, ...newIdeas]);
                setShownIdeas(prev => [...prev, ...newIdeas.map(idea => idea._id)]);
                setPage(prev => prev + 1);
            }
        } catch (err: any) {
            console.error('Error fetching ideas:', err);
            if (err.response) {
                switch (err.response.status) {
                    case 401: navigate('/signin'); break;
                    case 403:
                    case 440:
                        alert("Session expired or invalid. Please log in again.");
                        handleSessionExpiredLogout(dispatch, navigate);
                        break;
                    default:
                        alert("An error occurred while fetching ideas.");
                }
            }
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, user.username, page, shownIdeas, navigate, dispatch, handleSessionExpiredLogout]);

    useEffect(() => {
        loadMoreIdeas();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 100) return;
            loadMoreIdeas();
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMoreIdeas]);

    return { ideas, loading, hasMore };
};
