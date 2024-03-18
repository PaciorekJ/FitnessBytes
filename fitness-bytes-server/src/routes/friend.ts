import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import FriendModel from "../models/Friend";
import { IUser } from "../models/User";

const friendRouter = Router();

friendRouter.get('/', authMiddleware, async (req, res) => {
    const userId = (req.user as IUser)._id;
    const { query } = req.query as {query: string};

    const regex = new RegExp((query || ".*"), 'i');

    try {
        const friendships = await FriendModel.aggregate([
            {
                $match: {
                    $or: [{ userId1: userId }, { userId2: userId }],
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
                        username: 1
                    }
                }
            },
            {
                $unwind: "$friendDetails"
            },
            {
                $replaceRoot: { newRoot: "$friendDetails" }
            }
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