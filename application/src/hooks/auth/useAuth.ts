import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { selectUser, setUser } from './userSlice';
import { AppDispatch } from '../../store';
import authService from '../../api/authService';
import { logoutUser } from '../../api/deleteService';

export const useAuth = () => {
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector(selectUser);
    const rememberMeCookie = Cookies.get('rememberMe');

    const fetchUserData = async () => {
        try {
            const result = await authService.fetchUserData();
            dispatch(setUser({
                username: result.username || "NA",
                description: result.description || "NA",
                preferences: result.preferences,
                postedContent: result.postedContent,
                followers: result.followers,
                following: result.following,
                likedIdeas: result.likedIdeas,
                dislikedIdeas: result.dislikedIdeas,
            }));
        }
        catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    useEffect(() => {
        if (rememberMeCookie) {
            fetchUserData();
        }
    }, [dispatch, rememberMeCookie]);

    useEffect(() => {
        if (!user.username && !rememberMeCookie) {
            logout();
        }
    }, [user.username, rememberMeCookie]);
};
