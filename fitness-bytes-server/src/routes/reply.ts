import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware";
import socketMiddleware, { RequestWithSocket } from "../middleware/socketMiddleware";
import userConfigMiddleware from "../middleware/userConfigMiddleware";
import { NotificationTypes } from "../models/Notification";
import ReplyModel, { IReply } from "../models/Reply";
import ReplyLikeModel from "../models/ReplyLike";
import { IUser } from "../models/User";
import NotificationStrategyFactory from "../services/NotificationStrategyFactory";

const replyRouter = Router();


replyRouter.get('/liked/:_id', authMiddleware, async (req, res) => {

    const userId = (req.user as IUser)._id;

    try {
        const _id = new mongoose.Types.ObjectId(req.params._id);

        const count = await ReplyLikeModel.countDocuments({ replyId: _id, userID: userId });

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


replyRouter.post("/like", authMiddleware, socketMiddleware, userConfigMiddleware, async (req, res) => {

    const userId = (req.user as IUser)._id;

    try {
        const _id = new mongoose.Types.ObjectId(req.body._id);
        
        if (!_id) {
            return res.status(400).json({
                message: "No postID",
            });
        }

        const existingLike = await ReplyLikeModel.findOne({ replyId: _id, userID: userId });

        
        if (!existingLike) {
            // *** Reply is liked ***
            const reply = await ReplyModel.findById(_id) || {} as IReply;
            
            NotificationStrategyFactory.create(NotificationTypes.ReplyLiked).handle(reply, req as RequestWithSocket);
            
            await ReplyLikeModel.create({ replyId: _id, userID: userId });
            await ReplyModel.findByIdAndUpdate(_id, { $inc: { likes: 1 } });
            return res.status(200).json({
                message: "",
                result: true,
            });
        } 
        
        // *** Reply is unliked ***
        await ReplyLikeModel.deleteOne({ replyId: _id, userID: userId });
        await ReplyModel.findByIdAndUpdate(_id, { $inc: { likes: -1 } });
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

replyRouter.get("/:id", async (req, res) => {
    const idRaw = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(idRaw)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    try {
        const _id = new mongoose.Types.ObjectId(idRaw);

        const reply = await ReplyModel.findById(_id);

        return res.json({ 
            message: "",
            result: reply
        });

    } catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
})

replyRouter.get("/postRepliesCount/:postId", authMiddleware, async (req, res) => {
    const postIdRaw = req.params.postId;

    if (!mongoose.Types.ObjectId.isValid(postIdRaw)) {
        return res.status(400).json({ message: "Invalid Post ID" });
    }

    try {
        const postId = new mongoose.Types.ObjectId(postIdRaw);
    
        const replyCount = await ReplyModel.countDocuments({postId, parentReplyId: null});
    
        return res.json({ 
            message: "",
            result: replyCount
        });
        
    } catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

replyRouter.get("/replyRepliesCount/:replyId", authMiddleware, async (req, res) => {
    const replyIdRaw = req.params.replyId;

    if (!mongoose.Types.ObjectId.isValid(replyIdRaw)) {
        return res.status(400).json({ message: "Invalid Reply ID" });
    }

    try {
        const replyId = new mongoose.Types.ObjectId(replyIdRaw);

        const replyCount = await ReplyModel.countDocuments({parentReplyId: replyId});

        return res.json({ 
            message: "",
            result: replyCount
        });

    } catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

replyRouter.get("/postReplies/:postId", authMiddleware, async (req, res) => {
    const postIdRaw = req.params.postId;

    if (!mongoose.Types.ObjectId.isValid(postIdRaw)) {
        return res.status(400).json({ message: "Invalid Post ID" });
    }

    try {
        const postId = new mongoose.Types.ObjectId(postIdRaw);
    
        const replies = await ReplyModel.find({postId, parentReplyId: null});
    
        return res.json({ 
            message: "",
            result: replies
        });

    } catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

replyRouter.get("/replyReplies/:replyId", authMiddleware, async (req, res) => {
    const replyIdRaw = req.params.replyId;

    if (!mongoose.Types.ObjectId.isValid(replyIdRaw)) {
        return res.status(400).json({ message: "Invalid Reply ID" });
    }

    try {
        const replyId = new mongoose.Types.ObjectId(replyIdRaw);

        const replies = await ReplyModel.find({parentReplyId: replyId});

        return res.json({ 
            message: "",
            result: replies
        });

    } catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

replyRouter.patch("/", authMiddleware, async (req, res) => {
    const userId = (req.user as IUser)._id;
    const { content, _id } = req.body as IReply;

    
    if (!content) {
        return res.status(400).json({
            message: "No Content Provided",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    
    try {
        const reply = await ReplyModel.findOneAndUpdate({_id, userId}, { content }, {new: true});
    
        return res.json({
            message: "",
            result: reply
        })
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
})

const deleteReplies = async (replyId: mongoose.Types.ObjectId) => {
    const replyToDelete = await ReplyModel.findById(replyId);
    if (!replyToDelete) {
      return false;
    }
  
    if (replyToDelete.parentReplyId === null) {

        const repliesToDelete = await ReplyModel.find({ postId: replyToDelete.postId }, '_id');
        const replyIdsToDelete = repliesToDelete.map(reply => reply._id);

        // It's a root reply. Delete all replies associated with the post.
        const { deletedCount } = await ReplyModel.deleteMany({ _id: { $in: replyIdsToDelete } });

        if (deletedCount) {
            await ReplyLikeModel.deleteMany({ replyId: { $in: replyIdsToDelete } });
        }
        else {
            return false;
        }
    } else { 
    
        // It's a non-root reply. Delete this reply and all its descendants.
        const success = await deleteReplyAndDescendants(replyId);
        return success;
    }
    return true;
};
  
const deleteReplyAndDescendants = async (initialReplyId: mongoose.Types.ObjectId) => {
    let queue = [initialReplyId];

    while (queue.length > 0) {
        let currentReplyId = queue.shift();
        
        // Find direct child replies
        const childReplies = await ReplyModel.find({ parentReplyId: currentReplyId });
        queue.push(...childReplies.map(reply => reply._id));

        // Delete the current reply and its likes
        const { deletedCount } = await ReplyModel.deleteOne({ _id: currentReplyId });
        if (deletedCount) {
            await ReplyLikeModel.deleteMany({ _id: currentReplyId });
        }

    }
};
  

replyRouter.delete("/:replyId", authMiddleware, async (req, res) => {
    const userId = (req.user as IUser)._id;
    const replyIdRaw = req.params.replyId;

    if (!mongoose.Types.ObjectId.isValid(replyIdRaw)) {
        return res.status(400).json({ message: "Invalid Reply ID" });
    }

    try {
        const replyId = new mongoose.Types.ObjectId(replyIdRaw);

        const success = await deleteReplies(replyId);

        return res.json({ 
            message: "",
            result: success
        });

    } catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

replyRouter.post("/", authMiddleware, socketMiddleware, async (req, res) => {
    const userId = (req.user as IUser)._id;

    const { postId: postIdRaw, parentReplyId: parentReplyIdRaw, content } = req.body as IReply;

    if (!postIdRaw || !content) {
        return res.status(400).json({
            message: "No Content or postId Provided",
        });
    }

    if (!mongoose.Types.ObjectId.isValid(postIdRaw)) {
        return res.status(400).json({ message: "Invalid Post ID" });
    }

    try {
        const postId = new mongoose.Types.ObjectId(postIdRaw);

        let replyPayload: Partial<IReply> = {
            userId,
            postId,
            content,
        }
        if (parentReplyIdRaw){
            if (!mongoose.Types.ObjectId.isValid(parentReplyIdRaw)) {
                return res.status(400).json({ message: "Invalid Post ID" });
            }

            const parentReplyId = new mongoose.Types.ObjectId(parentReplyIdRaw);

            replyPayload = {
                ...replyPayload,
                parentReplyId,
            }
        }

        const reply = await ReplyModel.create(replyPayload);

        NotificationStrategyFactory.create(NotificationTypes.Replied).handle(reply, req as RequestWithSocket);        

        return res.status(201).json({
            message: "",
            result: reply,
        });

    } catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

export default replyRouter;