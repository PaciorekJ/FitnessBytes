import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware";
import PostModel from "../models/Post";
import PostLikeModel from "../models/PostLike";
import { IUser } from "../models/User";
import NotificationStrategyFactory from "../services/NotificationStrategyFactory";
import { NotificationTypes } from "../models/Notification";

const postRouter = Router();

postRouter.get('/liked/:postId', authMiddleware, async (req, res) => {

    const userId = (req.user as IUser)._id;

    try {
        const postId = new mongoose.Types.ObjectId(req.params.postId);

        const count = await PostLikeModel.countDocuments({ postID: postId, userID: userId });

        res.status(200).json({
            message: "",
            result: (count ? true: false)
        });

    } 
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}`, 
            result: 0,
        });
    }
});


postRouter.post("/like", authMiddleware, async (req, res) => {

    const userId = (req.user as IUser)._id;

    try {
        const postId = new mongoose.Types.ObjectId(req.body.postId);
        
        if (!postId) {
            return res.status(400).json({
                message: "No postID",
            });
        }

        const existingLike = await PostLikeModel.findOne({ postID: postId, userID: userId });

        
        if (!existingLike) {
            // *** Post is liked ***
            const post = await PostModel.findById(postId);
            NotificationStrategyFactory.create(NotificationTypes.PostLiked)(post, req);
            await PostLikeModel.create({ postID: postId, userID: userId });
            await PostModel.findByIdAndUpdate(postId, { $inc: { likes: 1 } });
            return res.status(200).json({
                message: "",
                result: true,
            });
        } 
        
        // *** Post is unliked ***
        await PostLikeModel.deleteOne({ postID: postId, userID: userId });
        await PostModel.findByIdAndUpdate(postId, { $inc: { likes: -1 } });
        return res.status(200).json({
            message: "",
            result: false,
        });
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

postRouter.post("/", authMiddleware, async (req, res) => {

    const userId = (req.user as IUser)._id;
    const username = (req.user as IUser).username;
    const content = req.body.content;
    
    if (!content) {
        return res.status(400).json({
            message: "No Content Provided",
        });
    }

    try {

        const post = await PostModel.create({
            userId: userId,
            username: username,
            content: content,
        });

        return res.status(201).json({
            message: "",
            result: post,
        });
        
    } catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

postRouter.get("/:postId", async (req, res) => {

    try {
        const postId = new mongoose.Types.ObjectId(req.params.postId);

        if (!postId) {
            return res.status(400).json({
                message: "Invalid PostId",
            });
        }

        const post = await PostModel.findOne({_id: postId});

        return res.status(200).json({
            message: "",
            result: post,
        });
            
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});


postRouter.delete("/:postId", async (req, res) => {

    try {
        const postId = new mongoose.Types.ObjectId(req.params.postId)

        if (!postId) {
            return res.status(400).json({
                message: "Invalid postID",
            });
        }

        // *** Remove all Likes ***
        await PostLikeModel.deleteMany({ postID: postId });

        const deletedPost = await PostModel.deleteOne({ _id: postId });

        return res.status(200).json({
            message: "",
            result: deletedPost
        });
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

postRouter.patch("/", authMiddleware, async (req, res) => {

    try {
        const _id = new mongoose.Types.ObjectId(req.body._id);
        const content = req.body.content;

        if (!_id || !content) {
            return res.status(400).json({
                message: "Invalid postId or Empty Content",
            });
        }

        const result = await PostModel.updateOne({ _id }, { $set: { content } });

        res.status(200).json({
            message: "",
            result: result.modifiedCount
        });
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

export default postRouter;