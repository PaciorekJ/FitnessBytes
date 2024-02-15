
import mongoose from 'mongoose';
import { IPost, default as PostModel } from '../models/Post';
import { default as PostLikeModel } from '../models/PostLike';

// *** Retrieves all posts associated with the specified userId ***
async function findUserPosts(userId: mongoose.Types.ObjectId) {
    const result = await PostModel.find({userId: userId});
    return result;
}

// *** Returns true if addition was successful ***
async function addPost(newPost: Partial<IPost>): Promise<boolean> {
    try {
        await PostModel.create(newPost);
        return true;
    } catch (error) {
        console.error("Error adding post:", error);
        return false;
    }
}

// *** Returns true if updated successfully ***
async function editPost(postID: mongoose.Types.ObjectId, content: string): Promise<boolean> {
    const result = await PostModel.updateOne({ _id: postID }, { $set: { content } });
    return result.modifiedCount > 0;
}

// *** Returns true if it successfully removes all likes for a post and the post itself ***
async function deletePost(postID: mongoose.Types.ObjectId): Promise<boolean> {
    await PostLikeModel.deleteMany({ postID: postID });
    const result = await PostModel.deleteOne({ _id: postID });
    return result.deletedCount > 0;
}

export { addPost, deletePost, editPost, findUserPosts };

