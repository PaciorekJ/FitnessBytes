import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware";
import ReportModel from "../models/Report";
import UserModel, { IUser } from "../models/User";

const reportRouter = Router();

reportRouter.post('/', authMiddleware, async (req, res) => {

    const userId = (req.user as IUser)._id;

    try {
        const ownerId = (await UserModel.findOne({ 
            username: req.body.ownerUsername 
        }).select('_id'))?._id;
        const postId = new mongoose.Types.ObjectId(req.body.postId);

        if (!ownerId) {
            return res.status(400).json({
                message: "Username was not valid",
            });
        }
        if (!postId) {
            return res.status(400).json({
                message: "No postID or userID or postOwnerId",
            });
        }    
        
        const report = await ReportModel.create({
            userId: userId,
            ownerId: ownerId,
            postId: postId
        });

        res.status(201).json({
            message: "",
            result: report
        });
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
})

export default reportRouter;