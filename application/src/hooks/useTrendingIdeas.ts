import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import ideaService from '../api/feedService';
import { Idea } from '../types/ideaTypes';
import { useLogout } from '../utils/useLogout';
import { AppDispatch } from '../store';

export const useTrendingIdeas = () => {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [period, setPeriod] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const logout = useLogout;

    const fetchIdeas = useCallback(async (currentPage: number, isNewFilter: boolean) => {
        setLoading(true);
        setError(null);
        try {
            const newIdeas = await ideaService.getTrendingIdeas({ page: currentPage, period, category });
            setIdeas(prev => (isNewFilter ? newIdeas : [...prev, ...newIdeas]));
            setHasMore(newIdeas.length > 0);
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.response) {
                const status = err.response.status;
                if (status === 401 || status === 403 || status === 440) {
                    setError("Your session has expired. Please log in again.");
                    await logout(dispatch, navigate);
                } else {
                    setError("Failed to fetch ideas. Please try again later.");
                }
            } else {
                setError("A network error occurred. Please check your connection.");
            }
            console.error('Error fetching ideas:', err);
        } finally {
            setLoading(false);
        }
    }, [category, period, dispatch, navigate, logout]);

    useEffect(() => {
        setPage(1);
        setIdeas([]);
        fetchIdeas(1, true);
    }, [period, category, fetchIdeas]);

    useEffect(() => {
        if (page > 1) {
            fetchIdeas(page, false);
        }
    }, [page, fetchIdeas]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 500 && !loading && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    return { ideas, loading, hasMore, period, setPeriod, category, setCategory, error };
};
