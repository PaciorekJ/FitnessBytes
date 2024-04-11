import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware";
import ReplyModel, { IReply } from "../models/Reply";
import { IUser } from "../models/User";

const replyRouter = Router();

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

replyRouter.delete("/:replyId", authMiddleware, async (req, res) => {
    const userId = (req.user as IUser)._id;
    const replyIdRaw = req.params.replyId;

    if (!mongoose.Types.ObjectId.isValid(replyIdRaw)) {
        return res.status(400).json({ message: "Invalid Reply ID" });
    }

    try {
        const replyId = new mongoose.Types.ObjectId(replyIdRaw);

        const reply = await ReplyModel.deleteOne({_id: replyId, userId});

        return res.json({ 
            message: "",
            result: reply.deletedCount ? true: false
        });

    } catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

replyRouter.post("/", authMiddleware, async (req, res) => {
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