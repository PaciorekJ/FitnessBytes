import { Router } from "express";
import escapeRegExp from "../libs/RegExp";
import { authMiddleware } from "../middleware/authMiddleware";
import FriendModel from "../models/Friend";
import FriendRequestModel from "../models/FriendRequest";
import UserModel, { IUser } from "../models/User";

const friendRouter = Router();

enum FriendStatus {
    None = "None",
    Pending = "Pending",
    Friend = "Friend"
}

friendRouter.get('/isFriend/:friendUsername', authMiddleware, async (req, res) => {
    const userId = (req.user as IUser)._id;
    const friendUsername = req.params.friendUsername;

    try {
        const friend = await UserModel.findOne({ username: friendUsername }).select("_id");
        
        if (!friend) {
            return res.status(404).json({ message: "Invalid username, no user with the provided username found." });
        }

        const friendId = friend._id;

        const exists = await FriendModel.aggregate([
            {
                $match: {
                    $or: [
                        { userId1: userId, userId2: friendId },
                        { userId1: friendId, userId2: userId }
                    ]
                }
            }
        ]).exec();

        const pending = await FriendRequestModel.aggregate([
            {
                $match: {
                    $or: [
                        { requesterId: userId, recipientId: friendId },
                        { recipientId: friendId, requesterId: userId }   
                    ]
                }
            }
        ]).exec();

        const isFriend = exists.length > 0;
        const isPending = pending.length > 0;

        const friendStatus = isPending ? FriendStatus.Pending : isFriend ? FriendStatus.Friend : FriendStatus.None;

        return res.json({
            message: "",
            result: friendStatus
        });
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}`
        });
    }
});

friendRouter.get('/', authMiddleware, async (req, res) => {
    const userId = (req.user as IUser)._id;
    const { query } = req.query as {query: string};

    const {pageLength: pageLengthRaw, pageNumber: pageNumberRaw} = req.query as {pageLength: string, pageNumber: string};
    const pageLength = parseInt(pageLengthRaw) || 10;
    const pageNumber = parseInt(pageNumberRaw) || 0;

    const regex = new RegExp(escapeRegExp(query || "*"), 'i');

    try {
        const friendships = await FriendModel.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            {
                                $or: [
                                    { $eq: ["$userId1", userId] },
                                    { $eq: ["$userId2", userId] }
                                ]
                            },
                            {
                                $not: { $eq: ["$userId1", "$userId2"] }
                            }
                        ]
                    }
                }
            },
            {
                $addFields: {
                    friendId: {
                        $cond: {
                            if: { $eq: ["$userId1", userId] },
                            then: "$userId2",
                            else: "$userId1"
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "friendId",
                    foreignField: "_id",
                    as: "friendDetails"
                }
            },
            {
                $match: {
                    "friendDetails.username": {
                        $regex: regex,
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    friendDetails: {
                        _id: 1,
                        username: 1,
                        profilePicture: 1,
                        profilePictureType: 1
                    }
                }
            },
            {
                $unwind: "$friendDetails"
            },
            {
                $replaceRoot: { newRoot: "$friendDetails" }
            },
            {
                $skip: pageLength * pageNumber,
            },
            {
                $limit: pageLength
            },
        ]).exec();

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