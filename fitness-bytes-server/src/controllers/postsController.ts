import { ObjectId } from "mongodb";
import Database from "../db";
import PageQuery from "../interfaces/PageQuery";
import Post from "../models/Post";
import PostLikes from "../models/PostLike";

const client = Database.getInstance();
const db = client.db('Fitness-Bytes-DB');
const postsCollection = db.collection<Post>('posts');
const postLikesCollection = db.collection<PostLikes>('postLikes');

// *** Returns a promise that contains the paginated newest post ***
async function getNewestPosts(query: PageQuery, ownerID?: ObjectId): Promise<Post[]> {
    const { numberPerPage, pageNumber } = query;
    const limit = parseInt(numberPerPage || "5");
    const curPageNumber = parseInt(pageNumber || "0");
    const offset = limit * curPageNumber;

    let filter: any = {};
    if (!ownerID) {
        filter.userId = ownerID;
    }

    const pipeline: any[] = [
        { $match: filter },
        { $sort: { TimeCreated: -1 } },
        { $skip: offset },
        { $limit: limit }
    ];

    return postsCollection.aggregate(pipeline).toArray() as Promise<Post[]>;
}

// *** Returns a promise that contains the paginated liked post ***
async function getLikedPosts(userID: ObjectId, query: PageQuery, ownerID?: ObjectId): Promise<Post[]> {
    const { numberPerPage, pageNumber } = query;
    const limit = parseInt(numberPerPage || "5");
    const curPageNumber = parseInt(pageNumber || "0");
    const offset = limit * curPageNumber;

    let filter: any = { "PL.userID": userID };
    if (ownerID) {
        filter["P.userID"] = ownerID;
    }

    const pipeline: any[] = [
        { $match: filter },
        { $sort: { "P.timeCreated": -1 } },
        { $skip: offset },
        { $limit: limit }
    ];

    return postsCollection.aggregate(pipeline).toArray() as Promise<Post[]>;;
}

// *** Returns a promise that contains the paginated most liked post ***
async function getMostLikedPosts(query: PageQuery, ownerID?: ObjectId): Promise<Post[]> {
    const { numberPerPage, pageNumber } = query;
    const limit = parseInt(numberPerPage || "5");
    const curPageNumber = parseInt(pageNumber || "0");
    const offset = limit * curPageNumber;

    let pipeline: any[] = [];

    if (ownerID) {
        pipeline = [
            { $match: { "PL.userID": ownerID, "P.userID": ownerID } },
            { $sort: { "P.timeCreated": -1 } },
            { $skip: offset },
            { $limit: limit }
        ];
    } else {
        pipeline = [
            { $lookup: { from: "postLikes", localField: "postID", foreignField: "postID", as: "PL" } },
            { $group: { _id: "$postID", LikeCount: { $sum: 1 }, post: { $first: "$$ROOT" } } },
            { $sort: { LikeCount: -1, "post.timeCreated": -1 } },
            { $skip: offset },
            { $limit: limit }
        ];
    }

    return postsCollection.aggregate(pipeline).toArray() as Promise<Post[]>;
}

// *** Returns true if added successfully ***
async function addPost(newPost: Post){

    return (await postsCollection.insertOne({
        ...newPost, 
        timeCreated: new Date(),
        likes: 0,
    })).acknowledged;

}

// *** Returns true if updated successfully ***
async function editPost(postID: ObjectId, content: string) {

    return (await postsCollection.updateOne(
        {_id: postID}, 
        {content: content}
    )).acknowledged

}

// *** Returns true if it successfully removes all likes for a post and the post itself ***
async function deletePost(postID: ObjectId) {

    const removedLikes = (await postLikesCollection.deleteMany({PostID: postID}));

    const removedPost = (await postsCollection.deleteOne({_id: postID}));

    return removedLikes.acknowledged && removedPost.acknowledged
}

// *** Returns true if the likePost was performed successfully ***
async function likePost(postID: ObjectId, UserID: ObjectId) {

    const postLikes = await postLikesCollection.insertOne({
        postID: postID,
        userID: UserID
    });

    const posts = await postsCollection.updateOne(
        {_id: postID, userId: UserID}, 
        {$inc: {Likes: 1}}
    );

    return postLikes.acknowledged && posts.acknowledged
}

// *** Returns true if the unliking of the Post was performed successfully ***
async function unlikePost(postID: ObjectId, UserID: ObjectId) {
    const postLikes = await postLikesCollection.deleteOne({
        postID: postID,
        userID: UserID
    });

    const posts = await postsCollection.updateOne(
        {_id: postID, userId: UserID}, 
        {$inc: {Likes: -1}}
    );

    return postLikes.acknowledged && posts.acknowledged
}

// *** Returns 1 if the post was liked and 0 if the post was unlike ***
async function toggleLike(postID: ObjectId, UserID: ObjectId) {

    const postLikesCount = await postLikesCollection.countDocuments({
        PostID: postID,
        UserID: UserID
    });

    if (postLikesCount === 0) {
        await likePost(postID, UserID);
    } else {
        await unlikePost(postID, UserID);
    }

    return postLikesCount
}

// *** Returns 0 if the post is liked and anything else if not liked ***
async function isLiked(postID: ObjectId, UserID: ObjectId) {
    const postLikesCount = await postLikesCollection.countDocuments({
        PostID: postID,
        UserID: UserID
    });

    return postLikesCount || 0;
}


// *** Returns true if isOwner else false ***
async function validateIsOwner(postID: ObjectId, userID: ObjectId) {
    const post = await postsCollection.findOne({
        PostID: postID,
        UserID: userID
    });

    return post !== null; // If post is found, return true indicating the user is the owner
}

// *** Returns the number of post associated with the given ID ***
async function getPostCountByUserId(userID: ObjectId) {
    const postCount = postsCollection.countDocuments({
        userID: userID
    });

    return postCount;
}

async function getPostLikesByUserId(userID: ObjectId) {
    const likesAggregate = await postsCollection.aggregate([
        {
            $match: { UserID: userID }
        },
        {
            $group: {
                _id: null,
                likes: { $sum: "$Likes" }
            }
        }
    ]).toArray();

    return likesAggregate.length > 0? likesAggregate[0].likes: 0;
}

export {getLikedPosts, getMostLikedPosts, getNewestPosts, addPost, deletePost, editPost, isLiked, toggleLike, validateIsOwner, getPostCountByUserId, getPostLikesByUserId}