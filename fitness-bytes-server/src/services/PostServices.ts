
import mongoose from 'mongoose';
import { IPost, default as PostModel } from '../models/Post';
import { default as PostLikeModel } from '../models/PostLike';

// *** Retrieves all posts ***
async function findPosts() {
    try {
        const result = await PostModel.find().sort({timeCreated: -1});
        return result;
    } catch (error) {
        throw error;
    }
}

// *** Retrieves all posts associated with the specified username ***
async function findUserPosts(username: string) {
    const result = await PostModel.find({username: username}).sort({timeCreated: -1});;
    return result;
}

// *** Retrieves all post count associated with the specified username ***
async function findUserPostCount(username: string): Promise<number> {
    const result = await PostModel.find({username: username}).countDocuments();
    return result;
}

// *** Returns the created post if addition was successful ***
async function getPost(postId: mongoose.Types.ObjectId): Promise<IPost> {
    try {
        const post = await PostModel.findOne({_id: postId});
        if (!post) throw new Error("No Post exists with the provided PostId");
        
        return post;
    } catch (error) {
        console.error("Error adding post:", error);
        return {} as IPost;
    }
}

// *** Returns the created post if addition was successful ***
async function addPost(newPost: Partial<IPost>): Promise<IPost> {
    try {
        const post = await PostModel.create(newPost);
        return post;
    } catch (error) {
        console.error("Error adding post:", error);
        return {} as IPost;
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

export { addPost, getPost, deletePost, editPost, findUserPosts, findPosts, findUserPostCount};

