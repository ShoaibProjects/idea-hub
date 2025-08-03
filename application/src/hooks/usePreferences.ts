import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MultiValue } from 'react-select';
import { AppDispatch } from '../store';
import { selectUser, updatePref } from './auth/userSlice';
import { selectCategories } from '../Redux-slices/categories/categorySlices';
import userService from '../api/userService';
import { useLogout } from '../utils/useLogout';

interface SelectOption {
    value: string;
    label: string;
}

export const usePreferences = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const user = useSelector(selectUser);
    const categories = useSelector(selectCategories);

    const [selectedPreferences, setSelectedPreferences] = useState<string[]>(user.preferences || []);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const categoryOptions: SelectOption[] = useMemo(() =>
        categories.map((category: string) => ({
            value: category,
            label: category,
        })), [categories]);

    const handlePreferenceChange = (selectedOptions: MultiValue<SelectOption>) => {
        if (selectedOptions.length <= 5) {
            setSelectedPreferences(selectedOptions.map(option => option.value));
        } else {
            alert("You can only select up to 5 preferences.");
        }
    };

    const savePreferences = async () => {
        if (!user.username) {
            alert("User not found. Please log in again.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await userService.updateUserPreferences(user.username, {
                preferences: selectedPreferences,
            });

            dispatch(updatePref(selectedPreferences));
            alert('Preferences updated successfully!');

        } catch (err: unknown) {
            console.error('Error updating preferences:', err);
            setError('Failed to update preferences.');
            alert('Failed to update preferences');

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
                        alert("A server error occurred. Please try again later.");
                        break;
                    default:
                        console.error(`Unhandled error with status ${status}`);
                }
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        selectedPreferences,
        setSelectedPreferences,
        categoryOptions,
        handlePreferenceChange,
        savePreferences,
        isLoading,
        error
    };
};
