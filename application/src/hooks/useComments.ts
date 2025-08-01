import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import {
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    Comment,
} from '../api/commentService';
import { useLogout } from '../utils/useLogout';
import { selectUser } from './auth/userSlice';
import { AppDispatch } from '../store';

interface UseCommentsReturn {
    comments: Comment[];
    loading: boolean;
    error: AxiosError | null;
    handleAddComment: (description: string) => Promise<void>;
    handleUpdateComment: (commentId: string, description: string) => Promise<void>;
    handleDeleteComment: (commentId: string) => Promise<void>;
}

export const useComments = (ideaId: string): UseCommentsReturn => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | null>(null);

    const user = useSelector(selectUser);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const handleSessionExpiredLogout = useLogout;

    const handleError = useCallback((err: unknown) => {
        console.error("Comment operation failed:", err);
        if (axios.isAxiosError(err)) {
            setError(err);
            if (err.response) {
                switch (err.response.status) {
                    case 401:
                        navigate('/signin');
                        break;
                    case 403:
                    case 440:
                        alert("Session expired or invalid. Please log in again.");
                        handleSessionExpiredLogout(dispatch, navigate);
                        break;
                    default:
                        alert("An unexpected error occurred. Please try again.");
                }
            }
        } else {
            alert("An unexpected error occurred.");
        }
    }, [navigate, dispatch, handleSessionExpiredLogout]);

    useEffect(() => {
        const loadComments = async () => {
            if (!ideaId) return;
            setLoading(true);
            try {
                const fetchedComments = await fetchComments(ideaId);
                setComments(fetchedComments);
            } catch (err) {
                handleError(err);
            } finally {
                setLoading(false);
            }
        };
        loadComments();
    }, [ideaId, handleError]);

    const handleAddComment = async (description: string): Promise<void> => {
        if (!user?.username) throw new Error("User is not authenticated.");
        try {
            const newComment = await addComment({ ideaId, creator: user.username, description });
            setComments(prev => [newComment, ...prev]);
        } catch (err) {
            handleError(err);
            throw err;
        }
    };

    const handleUpdateComment = async (commentId: string, description: string): Promise<void> => {
        if (!user?.username) throw new Error("User is not authenticated.");
        try {
            const updatedComment = await updateComment({ commentId, creator: user.username, description });
            setComments(prev =>
                prev.map(c => (c._id === commentId ? { ...c, ...updatedComment } : c))
            );
        } catch (err) {
            handleError(err);
            throw err;
        }
    };

    const handleDeleteComment = async (commentId: string): Promise<void> => {
        if (!user?.username) throw new Error("User is not authenticated.");
        try {
            await deleteComment({ commentId, creator: user.username, ideaId });
            setComments(prev => prev.filter(c => c._id !== commentId));
        } catch (err) {
            handleError(err);
        }
    };

    return { comments, loading, error, handleAddComment, handleUpdateComment, handleDeleteComment };
};
