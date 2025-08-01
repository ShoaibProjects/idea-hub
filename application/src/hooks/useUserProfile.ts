import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userProfileService } from '../api/userProfileService';
import { Idea } from '../types/ideaTypes';
import { UserProfileData } from '../types/authTypes';

export const useUserProfile = () => {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { lookedUpUsername } = useParams<{ lookedUpUsername: string }>();

    useEffect(() => {
        const fetchProfileAndIdeas = async (username: string) => {
            try {
                setLoading(true);
                setError(null);

                const profileData = await userProfileService.fetchUserProfileData(username);
                setUserProfile(profileData);

                if (profileData.postedIdeas && profileData.postedIdeas.length > 0) {
                    const fetchedIdeas = await userProfileService.fetchIdeas(profileData.postedIdeas);
                    setIdeas(fetchedIdeas);
                } else {
                    setIdeas([]);
                }

            } catch (err) {
                console.error('Error fetching user profile or ideas:', err);
                setError('Failed to load profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (lookedUpUsername) {
            fetchProfileAndIdeas(lookedUpUsername);
        }
    }, [lookedUpUsername]);

    return { userProfile, ideas, loading, error, lookedUpUsername };
};
