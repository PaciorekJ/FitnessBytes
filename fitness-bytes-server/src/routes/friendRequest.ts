import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware";
import socketMiddleware, { RequestWithSocket } from "../middleware/socketMiddleware";
import FriendModel from "../models/Friend";
import FriendRequestModel from "../models/FriendRequest";
import { NotificationTypes } from "../models/Notification";
import { IUser } from "../models/User";
import NotificationStrategyFactory from "../services/NotificationStrategyFactory";

const friendRequestRouter = Router();

friendRequestRouter.post('/', authMiddleware, socketMiddleware, async (req, res) => {
    const requesterId = (req.user as IUser)._id;

    if (!req.body.recipientId) {
        res.status(400).json({
            message: "Missing recipientId",
        })
    }

    try {
        const recipientId = new mongoose.Types.ObjectId(req.body.recipientId);

        const friendRequestExists = await FriendRequestModel.findOne({
            recipientId,
            requesterId
        })

        const friendshipExists = await FriendModel.findOne({
            $or: [
                {
                    userId1: requesterId,
                    userId2: recipientId
                },
                {
                    userId1: recipientId,
                    userId2: requesterId
                },
            ]
        })

        if (friendRequestExists) {
            return res.status(409).json({
                message: "Friendship is already Pending",
            })
        }

        if (friendshipExists) {
            return res.status(409).json({
                message: "Friendship is already exists",
            })
        }

        const friendRequest = await FriendRequestModel.create({
            recipientId,
            requesterId
        })

        NotificationStrategyFactory.create(NotificationTypes.FriendRequest).handle(friendRequest, req as RequestWithSocket);

        return res.status(201).json({
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

friendRequestRouter.post('/accept', authMiddleware, socketMiddleware, async (req, res) => {
    const recipientId = new mongoose.Types.ObjectId((req.user as IUser)._id);
    
    if (!req.body.requesterId) {
        return res.status(400).json({
            message: "Missing requesterId",
        })
    }
    try {
        const requesterId = new mongoose.Types.ObjectId(req.body.requesterId);

        const friendRequest = await FriendRequestModel.findOneAndDelete({
            recipientId,
            requesterId
        });

        if (!friendRequest) {
            return res.status(404).json({
                message: "Action couldn't be carried out as the friend request doesn't exist"
            })
        }
        NotificationStrategyFactory.create(NotificationTypes.NewFriend).handle(friendRequest, req as RequestWithSocket);

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
    const recipientId = new mongoose.Types.ObjectId((req.user as IUser)._id);
    
    if (!req.body.requesterId) {
        return res.status(400).json({
            message: "Missing requesterId",
        })
    }
    try {
        const requesterId = new mongoose.Types.ObjectId(req.body.requesterId);

        const friendRequest = await FriendRequestModel.deleteOne({
            recipientId,
            requesterId
        })

        if (!friendRequest.deletedCount) {
            return res.status(404).json({
                message: "Action couldn't be carried out as the friend request doesn't exist"
            })
        }

        return res.status(200).json({
            message: "",
            result: friendRequest.deletedCount,
        });
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

export default friendRequestRouter;