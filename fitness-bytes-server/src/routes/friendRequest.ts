import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware";
import FriendModel from "../models/Friend";
import FriendRequestModel from "../models/FriendRequest";
import { IUser } from "../models/User";

const friendRequestRouter = Router();

friendRequestRouter.post('/', async (req, res) => {
    // const requesterId = (req.user as IUser)._id;

    if (!req.body.recipientId) {
        res.status(400).json({
            message: "Missing recipientId",
        })
    }

    try {
        const requesterId = new mongoose.Types.ObjectId(req.body.requesterId);
        const recipientId = new mongoose.Types.ObjectId(req.body.recipientId);

        const friendRequest = await FriendRequestModel.create({
            recipientId,
            requesterId
        })

        res.status(201).json({
            message: "",
            result: friendRequest
        });
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

friendRequestRouter.post('/accept', authMiddleware, async (req, res) => {
    if (!req.body.recipientId || !req.body.requesterId) {
        return res.status(400).json({
            message: "Missing recipientId or requesterId",
        })
    }

    try {
        const requesterId = new mongoose.Types.ObjectId(req.body.requesterId);
        const recipientId = new mongoose.Types.ObjectId(req.body.recipientId);

        // if (!requesterId.equals((req.user as IUser)._id) && 
        //     !recipientId.equals((req.user as IUser)._id)) {
        //     // Either ID is the actual user that is auth
        //     return res.status(403).json({
        //         message: "Forbidden: Attempting to access a resource that you don't have access to! Please verify your Id is present in the request",
        //     })
        // }

        const friendRequest = await FriendRequestModel.deleteOne({
            recipientId,
            requesterId
        });

        if (!friendRequest.deletedCount) {
            return res.status(404).json({
                message: "Action couldn't be carried out as the friend request doesn't exist"
            })
        }

        const friend = await FriendModel.create({
            userId1: recipientId,
            userId2: requesterId,
        });

        return res.status(201).json({
            message: "",
            result: friend
        });
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

friendRequestRouter.post('/decline', authMiddleware, async (req, res) => {
    if (!req.body.recipientId || !req.body.requesterId) {
        return res.status(400).json({
            message: "Missing recipientId or requesterId",
        })
    }

    try {
        const requesterId = new mongoose.Types.ObjectId(req.body.requesterId);
        const recipientId = new mongoose.Types.ObjectId(req.body.recipientId);

        if (!requesterId.equals((req.user as IUser)._id) && 
            !recipientId.equals((req.user as IUser)._id)) {
            return res.status(403).json({
                message: "Forbidden: Attempting to access a resource that you don't have access to! Please verify your Id is present in the request",
            })
        }

        const friendRequest = await FriendRequestModel.deleteOne({
            recipientId,
            requesterId
        })

        return res.status(201).json({
            message: "",
            result: friendRequest,
        });
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

export default friendRequestRouter;