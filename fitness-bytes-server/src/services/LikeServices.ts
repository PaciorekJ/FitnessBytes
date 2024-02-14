
import { ObjectId } from "mongoose";
import PostModel from '../models/Post';
import PostLikeModel from '../models/PostLike';

// Toggle the like status of a post for a given user
async function toggleLike(postID: ObjectId, userID: ObjectId): Promise<number> {
    const existingLike = await PostLikeModel.findOne({ postID, userID });

    if (!existingLike) {
        await PostLikeModel.create({ postID, userID });
        await PostModel.findByIdAndUpdate(postID, { $inc: { likes: 1 } });
        return 1; // Indicates a like was added
    } else {
        await PostLikeModel.deleteOne({ postID, userID });
        await PostModel.findByIdAndUpdate(postID, { $inc: { likes: -1 } });
        return 0; // Indicates a like was removed
    }
}

// Example utility functions for the PostLikes context

// Check if a post is liked by a user
async function isLiked(postID: ObjectId, userID: ObjectId): Promise<boolean> {
    const count = await PostLikeModel.countDocuments({ postID, userID });
    return count > 0;
}

// Validate if the user is the owner of the post
async function validateIsOwner(postID: ObjectId, userID: ObjectId): Promise<boolean> {
    const post = await PostModel.findOne({ _id: postID, userId: userID });
    return !!post;
}

// Get the number of posts created by a user
async function getPostCountByUserId(userID: ObjectId): Promise<number> {
    return PostModel.countDocuments({ userId: userID });
}

// Get the total number of likes for a user's posts
async function getPostLikesByUserId(userID: ObjectId): Promise<number> {
    const aggregate = await PostModel.aggregate([
        { $match: { userId: userID } },
        { $group: { _id: null, totalLikes: { $sum: "$likes" } } }
    ]);

    if (aggregate.length > 0) {
        return aggregate[0].totalLikes;
    }
    return 0;
}

export { getPostCountByUserId, getPostLikesByUserId, isLiked, toggleLike, validateIsOwner };

