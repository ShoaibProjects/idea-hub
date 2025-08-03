import Idea from "../models/Idea.js";
import User from "../models/User.js";

export const performSearch = async (query, page = 1, limit = 10) => {
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    const skip = (page - 1) * limit;

    const ideaSearchPromise = Idea.aggregate([
        {
            $search: {
                index: "default",
                compound: {
                    should: [
                        {
                            text: {
                                query,
                                path: "title",
                                score: { boost: { value: 3 } },
                                fuzzy: {
                                    maxEdits: 1,
                                    prefixLength: 2,
                                },
                            },
                        },
                        {
                            text: {
                                query,
                                path: "description",
                                fuzzy: {
                                    maxEdits: 1,
                                    prefixLength: 2,
                                },
                            },
                        },
                    ],
                    minimumShouldMatch: 1,
                },
            },
        },
        { $skip: skip },
        { $limit: limit },
    ]);

    const userSearchPromise = User.aggregate([
        {
            $search: {
                index: "default",
                text: {
                    query,
                    path: "username",
                    fuzzy: { maxEdits: 1 },
                },
            },
        },
        { $skip: skip },
        { $limit: limit },
        {
            $project: {
                username: 1,
            },
        },
    ]);

    const [ideas, users] = await Promise.all([
        ideaSearchPromise,
        userSearchPromise,
    ]);

    return { ideas, users };
};