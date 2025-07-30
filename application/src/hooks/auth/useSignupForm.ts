import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from './userSlice';
import { AppDispatch } from '../../store';
import authService from '../../api/authService';
import { AxiosError } from 'axios';

export const useSignupForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isGuest, setIsGuest] = useState(false);

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const handleSignup = async (preferences: string[]) => {
        setError('');
        if (!isGuest && (!username.trim() || !password)) {
            setError('Username and password are required for a full account.');
            return;
        }

        setIsLoading(true);
        try {
            const userData = await authService.signup({
                username: isGuest ? undefined : username,
                password: isGuest ? undefined : password,
                preferences,
                isGuest,
                rememberMe,
            });

            dispatch(setUser({
                username: userData.username ?? '', 
                description: userData.description ?? '',
                preferences: userData.preferences ?? [],
                postedContent: userData.postedContent ?? [],
                followers: userData.followers ?? [],
                following: userData.following ?? [],
                likedIdeas: userData.likedIdeas ?? [],
                dislikedIdeas: userData.dislikedIdeas ?? [],
            }));
            navigate('/');

        } catch (err: unknown) {
            if (err instanceof AxiosError && err.response) {
                switch (err.response.status) {
                    case 409:
                        setError(err.response.data.message || 'This username is not available.');
                        break;
                    case 422:
                        setError(err.response.data.message || 'Password validation failed.');
                        break;
                    default:
                        setError('Signup failed. Please try again.');
                }
            } else {
                setError('An unexpected error occurred.');
            }
            console.error('Signup error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isGuest) {
            handleSignup([]);
        }
    }, [isGuest]);

    return {
        username,
        setUsername,
        password,
        setPassword,
        rememberMe,
        setRememberMe,
        setIsGuest,
        error,
        isLoading,
        handleSignup,
    };
};
