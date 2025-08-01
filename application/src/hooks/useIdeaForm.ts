import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, addPostedContent } from './auth/userSlice';
import { createIdea, addUserPostedIdea } from '../api/ideaService';
import { useLogout } from '../utils/useLogout';

interface IdeaFormData {
    title: string;
    description: string;
    category: string;
    tags: string[];
}

export const useIdeaForm = () => {
    const [formData, setFormData] = useState<IdeaFormData>({
        title: '',
        description: '',
        category: '',
        tags: [],
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSessionExpiredLogout = useLogout;

    const handleInputChange = (field: keyof IdeaFormData, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = () => {
        if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
            alert('Title, description, and category are required.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setError(null);

        if (!user?.username) {
            alert("You must be logged in to submit an idea.");
            return;
        }

        try {
            const newIdea = await createIdea({ ...formData, creator: user.username });
            await addUserPostedIdea(user.username || "", newIdea._id);

            dispatch(addPostedContent(newIdea._id));
            alert('Idea submitted successfully!');
            navigate('/userinfo');

        } catch (err: any) {
            console.error('Error submitting idea:', err);
            setError('Failed to submit idea. Please try again.');

            if (err.response) {
                switch (err.response.status) {
                    case 401: navigate('/signin'); break;
                    case 403:
                    case 440:
                        alert("Session expired or invalid. Please log in again.");
                        handleSessionExpiredLogout(dispatch, navigate);
                        break;
                    default:
                        alert(err.response.data.message || "An unexpected error occurred.");
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { formData, isLoading, error, handleInputChange, handleSubmit };
};
