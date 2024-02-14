
import mongoose, { ObjectId, SchemaTypes } from 'mongoose';
import PageQuery from "../interfaces/PageQuery";
import { IPost, default as Post, default as PostModel } from '../models/Post';
import { default as PostLike, default as PostLikeModel } from '../models/PostLike';

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
async function editPost(postID: ObjectId, content: string): Promise<boolean> {
    const result = await PostModel.updateOne({ _id: postID }, { $set: { content } });
    return result.modifiedCount > 0;
}

// *** Returns true if it successfully removes all likes for a post and the post itself ***
async function deletePost(postID: ObjectId): Promise<boolean> {
    await PostLikeModel.deleteMany({ postID: postID });
    const result = await PostModel.deleteOne({ _id: postID });
    return result.deletedCount > 0;
}

export { addPost, deletePost, editPost };

