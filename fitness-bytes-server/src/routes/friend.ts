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

        const exists = await FriendModel.findOne(
            {
                $or: [
                    { userId1: userId, userId2: friendId },
                    { userId1: friendId, userId2: userId }
                ]
            }
        );

        const pending = await FriendRequestModel.find({
            $or: [
                { requesterId: userId, recipientId: friendId },
                { requesterId: friendId, recipientId: userId }
            ]
        });

        let friendStatus = FriendStatus.None;

        if (pending.length > 0) {
            friendStatus = FriendStatus.Pending;
        } else if (exists) {
            friendStatus = FriendStatus.Friend;
        }

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