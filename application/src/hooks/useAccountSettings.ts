import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { selectUser } from './auth/userSlice';
import { AppDispatch } from '../store';
import userService from '../api/userService';
import { useLogout } from '../utils/useLogout';

export const useAccountSettings = () => {
    const user = useSelector(selectUser);
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const logout = useLogout;

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handlePasswordChange = useCallback(async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('Please fill all password fields.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('New password and confirmation do not match.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            if (!user?.username) {
                throw new Error("User not found");
            }
            await userService.updatePassword({
                username: user.username,
                password: currentPassword,
                newPassword,
            });
            setSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: unknown) {
            if (err instanceof AxiosError && err.response) {
                const status = err.response.status;
                if (status === 401 || status === 403 || status === 440) {
                    setError("Your session is invalid. Please log in again.");
                    await logout(dispatch, navigate);
                } else {
                    setError(err.response.data.message || 'Failed to change password. Please check your current password.');
                }
            } else {
                setError('An unexpected network error occurred.');
            }
        } finally {
            setLoading(false);
        }
    }, [currentPassword, newPassword, confirmPassword, user?.username, logout, dispatch, navigate]);

    return {
        currentPassword, setCurrentPassword,
        newPassword, setNewPassword,
        confirmPassword, setConfirmPassword,
        loading, error, success,
        handlePasswordChange,
    };
};
