import * as userService from '../services/userService.js';

export const getAll = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const user = await userService.getUserByUsername(req.params.username);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

export const isLiked = async (req, res, next) => {
    try {
        const { username } = req.params;
        const { ideaId } = req.body;
        const result = await userService.getInteractionStatus(username, ideaId, 'likedIdeas');
        res.json({ isLiked: result.status });
    } catch (err) {
        next(err);
    }
};

export const likeIdea = async (req, res, next) => {
    try {
        const { username } = req.params;
        const { ideaId } = req.body;
        const user = await userService.toggleIdeaInteraction(username, ideaId, 'likedIdeas', 'add');
        res.status(200).json({ message: 'Idea liked successfully', likedIdeas: user.likedIdeas });
    } catch (err) {
        next(err);
    }
};

export const unlikeIdea = async (req, res, next) => {
    try {
        const { username } = req.params;
        const { ideaId } = req.body;
        const user = await userService.toggleIdeaInteraction(username, ideaId, 'likedIdeas', 'pull');
        res.status(200).json({ message: 'Idea unliked successfully', likedIdeas: user.likedIdeas });
    } catch (err) {
        next(err);
    }
};

export const isDisliked = async (req, res, next) => {
    try {
        const { username } = req.params;
        const { ideaId } = req.body;
        const result = await userService.getInteractionStatus(username, ideaId, 'dislikedIdeas');
        res.json({ isDisliked: result.status });
    } catch (err) {
        next(err);
    }
};

export const dislikeIdea = async (req, res, next) => {
    try {
        const { username } = req.params;
        const { ideaId } = req.body;
        const user = await userService.toggleIdeaInteraction(username, ideaId, 'dislikedIdeas', 'add');
        res.status(200).json({ message: 'Idea disliked successfully', dislikedIdeas: user.dislikedIdeas });
    } catch (err) {
        next(err);
    }
};

export const undislikeIdea = async (req, res, next) => {
    try {
        const { username } = req.params;
        const { ideaId } = req.body;
        const user = await userService.toggleIdeaInteraction(username, ideaId, 'dislikedIdeas', 'pull');
        res.status(200).json({ message: 'Idea undisliked successfully', dislikedIdeas: user.dislikedIdeas });
    } catch (err) {
        next(err);
    }
};

export const follow = async (req, res, next) => {
    try {
        const { currentUser, followedUser } = req.body;
        const user = await userService.toggleFollow(currentUser, followedUser, 'add');
        res.status(200).json({ message: 'Following successful', following: user.following });
    } catch (err) {
        next(err);
    }
};

export const unfollow = async (req, res, next) => {
    try {
        const { currentUser, followedUser } = req.body;
        const user = await userService.toggleFollow(currentUser, followedUser, 'pull');
        res.status(200).json({ message: 'Unfollow successful', following: user.following });
    } catch (err) {
        next(err);
    }
};

export const addPostedIdea = async (req, res, next) => {
    try {
        const { username } = req.params;
        const { ideaId } = req.body;
        await userService.togglePostedIdea(username, ideaId, 'add');
        res.status(200).json({ message: 'Posted content updated' });
    } catch (err) {
        next(err);
    }
};

export const removePostedIdea = async (req, res, next) => {
    try {
        const { username } = req.params;
        const { ideaId } = req.body;
        await userService.togglePostedIdea(username, ideaId, 'pull');
        res.status(200).json({ message: 'Posted content updated' });
    } catch (err) {
        next(err);
    }
};

export const updateDesc = async (req, res, next) => {
    try {
        const { username } = req.params;
        const { description } = req.body;
        if (req.user.username !== username) return res.status(403).json({ message: 'Not authorized' });
        await userService.updateUserDescription(username, description);
        res.status(200).json({ message: 'Description updated successfully' });
    } catch (err) {
        next(err);
    }
};

export const updatePref = async (req, res, next) => {
    try {
        const { username } = req.params;
        const { preferences } = req.body;
        if (req.user.username !== username) return res.status(403).json({ message: 'Not authorized' });
        await userService.updateUserPreferences(username, preferences);
        res.status(200).json({ message: 'Preferences updated successfully' });
    } catch (err) {
        next(err);
    }
};

export const updatePassword = async (req, res, next) => {
    try {
        const { username } = req.params;
        const { password, newPassword } = req.body;
        if (req.user.username !== username) return res.status(403).json({ message: 'Not authorized' });
        const result = await userService.updateUserPassword(username, password, newPassword);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const deleteUserByUsername = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await userService.deleteUserAndCleanup(username, password);
        res.json(result);
    } catch (err) {
        next(err);
    }
};