import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware";
import socketMiddleware, { RequestWithSocket } from "../middleware/socketMiddleware";
import userConfigMiddleware from "../middleware/userConfigMiddleware";
import { NotificationTypes } from "../models/Notification";
import PostModel, { IPost } from "../models/Post";
import PostImageModel, { IPostImage } from "../models/PostImages";
import PostLikeModel from "../models/PostLike";
import ReplyModel from "../models/Reply";
import ReplyLikeModel from "../models/ReplyLike";
import { IUser } from "../models/User";
import NotificationStrategyFactory from "../services/NotificationStrategyFactory";

const postRouter = Router();

postRouter.get('/image/:imageId', async (req, res) => {
    try {
        const imageIdString = req.params.imageId;

        if (!imageIdString) return res.status(400).json({
            message: "",
            result: false
        })

        const imageId = new mongoose.Types.ObjectId(req.params.imageId);

        const image = await PostImageModel.findById(imageId);

        return res.json({
            message: "",
            result: image
        })
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}`, 
            result: 0,
        });
    }
})

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


postRouter.post("/like", authMiddleware, socketMiddleware, userConfigMiddleware, async (req, res) => {

    const userId = (req.user as IUser)._id;

    try {
        const _id = new mongoose.Types.ObjectId(req.body._id);
        
        if (!_id) {
            return res.status(400).json({
                message: "No postID",
            });
        }

        const existingLike = await PostLikeModel.findOne({ postID: _id, userID: userId });

        
        if (!existingLike) {
            // *** Post is liked ***
            const post = await PostModel.findById(_id) || {} as IPost;

            
            NotificationStrategyFactory.create(NotificationTypes.PostLiked).handle(post, req as RequestWithSocket);
            
            await PostLikeModel.create({ postID: _id, userID: userId });
            await PostModel.findByIdAndUpdate(_id, { $inc: { likes: 1 } });
            return res.status(200).json({
                message: "",
                result: true,
            });
        } 
        
        // *** Post is unliked ***
        await PostLikeModel.deleteOne({ postID: _id, userID: userId });
        await PostModel.findByIdAndUpdate(_id, { $inc: { likes: -1 } });
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

postRouter.post("/uploadImage", authMiddleware, async (req, res) => {
    const post: Partial<IPost> & IPostImage = req.body;

    if (!post._id || !post.image || !post.imageType) {
        return res.status(400).json({
            message: "No postId or Image Provided",
        });
    }


    try {
        const postId = new mongoose.Types.ObjectId(post._id);
        const image = post.image;
        const imageType = post.imageType;

        const imageDocument = await PostImageModel.create({
            image,
            imageType
        });
    
        await PostModel.findByIdAndUpdate(postId, {
            imageId: imageDocument._id
        });

        return res.status(201).json({
            message: "",
            result: imageDocument,
        });
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }    
})


postRouter.patch("/uploadImage", authMiddleware, async (req, res) => {
    const imagePayload: IPostImage = req.body;

    if (!imagePayload || !imagePayload._id || !imagePayload.image || !imagePayload.imageType) {
        return res.status(400).json({
            message: "No imageId or Image Provided",
        });
    }

    try {
        const {_id, image, imageType} = imagePayload;
        const imageId = new mongoose.Types.ObjectId(_id);
        
        const newImage = await PostImageModel.findByIdAndUpdate(imageId, {
            $set: {
                image,
                imageType
            }
        }, {new: true});

        return res.status(200).json({
            message: "",
            result: newImage,
        });
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }    
})

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
        const rawPostId = req.params.postId;

        if (!mongoose.Types.ObjectId.isValid(rawPostId)) {
            return res.status(400).json({
                message: "Invalid postID",
            });
        }

        const postId = new mongoose.Types.ObjectId(rawPostId);
        const { deletedCount } = await PostModel.deleteOne({ _id: postId });

        if (deletedCount) {
            await PostLikeModel.deleteMany({ postId }); // Assuming the field is `postId` in your schema
            const replies = await ReplyModel.find({ postId }).select("_id");
            const replyIds = replies.map((r) => r._id);

            await ReplyModel.deleteMany({ postId });
            if (replyIds.length) {
                await ReplyLikeModel.deleteMany({ replyId: { $in: replyIds } });
            }
        }

        return res.status(200).json({
            message: "",
            result: deletedCount > 0
        });
    } catch (e) {
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

        const { modifiedCount } = await PostModel.updateOne({ _id }, { $set: { content } });

        res.status(200).json({
            message: "",
            result: modifiedCount
        });
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

export default postRouter;