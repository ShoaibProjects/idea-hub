import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, removePostedContent } from './auth/userSlice';
import { fetchIdeaDetails, deleteIdea, updateIdea, removeUserPostedIdea } from '../api/ideaService';
import { Idea } from '../types/ideaTypes';

export const useIdeaDetails = () => {
    const [idea, setIdea] = useState<Idea | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingIdea, setEditingIdea] = useState<Idea | null>(null);

    const { lookedUpIdea: ideaId } = useParams<{ lookedUpIdea: string }>();
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!ideaId) return;

        const loadIdea = async () => {
            setLoading(true);
            try {
                const ideaData = await fetchIdeaDetails(ideaId);
                setIdea(ideaData);
            } catch (err) {
                console.error('Error fetching idea details:', err);
                setError('Failed to load idea.');
            } finally {
                setLoading(false);
            }
        };

        loadIdea();
    }, [ideaId]);

    const handleDelete = useCallback(async () => {
        if (!idea) return;
        try {
            await deleteIdea(idea._id);
            await removeUserPostedIdea(user.username || "", idea._id);
            dispatch(removePostedContent(idea._id));
            alert('Idea deleted successfully!');
            navigate('/userinfo');
        } catch (err) {
            console.error('Error deleting idea:', err);
            alert('Failed to delete idea.');
        }
    }, [idea, user, dispatch, navigate]);

    const handleUpdate = useCallback(async () => {
        if (!editingIdea) return;
        try {
            const updatedData = await updateIdea(editingIdea._id, editingIdea);
            setIdea(updatedData);
            setEditingIdea(null);
            alert('Idea updated successfully!');
        } catch (err) {
            console.error('Error updating idea:', err);
            alert('Failed to update idea.');
        }
    }, [editingIdea]);

    return {
        idea,
        loading,
        error,
        editingIdea,
        setEditingIdea,
        handleDelete,
        handleUpdate,
    };
};
