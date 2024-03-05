import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import FriendModel from "../models/Friend";
import { IUser } from "../models/User";
import mongoose from "mongoose";

const friendRouter = Router();

friendRouter.get('/', authMiddleware, async (req, res) => {
    // const userId = (req.user as IUser)._id;

    try {
        const userId = new mongoose.Types.ObjectId(req.body.userId);
        const friendships = await FriendModel.find({
            $or: [
                { userId1: userId },
                { userId2: userId },
            ]
        })

        return res.json({
            message: "",
            result: friendships
        })
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
})

export default friendRouter;