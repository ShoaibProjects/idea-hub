import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, removePostedContent } from './auth/userSlice';
import { deleteIdea, updateIdea, removeUserPostedIdea } from '../api/ideaService';

interface UseIdeaCardProps {
    _id: string;
    title: string;
    description: string;
}

export const useIdeaCard = ({ _id, title, description }: UseIdeaCardProps) => {
    const [editingIdea, setEditingIdea] = useState<{ title: string; description: string } | null>(null);
    const [showActionMenu, setShowActionMenu] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/ideainfo/${_id}`);
    };

    const handleDelete = async () => {
        try {
            await deleteIdea(_id);
            await removeUserPostedIdea(user.username || "", _id);
            dispatch(removePostedContent(_id));
            alert('Idea deleted successfully!');
            navigate('/');
        } catch (err) {
            console.error('Error deleting idea:', err);
            setError('Failed to delete idea.');
            alert('Failed to delete idea.');
        }
    };

    const handleUpdate = async () => {
        if (!editingIdea) return;
        try {
            await updateIdea(_id, editingIdea);
            setEditingIdea(null);
            alert('Idea updated successfully!');
        } catch (err) {
            console.error('Error updating idea:', err);
            setError('Failed to update idea.');
            alert('Failed to update idea.');
        }
    };

    const toggleActionMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowActionMenu(prev => !prev);
    };

    const openEditModal = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingIdea({ title, description });
        setShowActionMenu(false);
    };

    return {
        editingIdea,
        setEditingIdea,
        showActionMenu,
        error,
        handleCardClick,
        handleDelete,
        handleUpdate,
        toggleActionMenu,
        openEditModal,
    };
};
