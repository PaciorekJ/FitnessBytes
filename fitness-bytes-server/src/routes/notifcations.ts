import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware";
import { MessageNotificationModel, NotificationModel, NotificationTypes } from "../models/Notification";
import { IUser } from "../models/User";

const notificationRouter = Router();

notificationRouter.get("/", authMiddleware, async (req, res) => {
    const userId = (req.user as IUser)._id;

    const {pageLength: pageLengthRaw, pageNumber: pageNumberRaw} = req.query as {pageLength: string, pageNumber: string};
    const pageLength = parseInt(pageLengthRaw) || 10;
    const pageNumber = parseInt(pageNumberRaw) || 0;

    try {
        const userNotifcations = await NotificationModel.aggregate([
            {
                $match: {
                    recipientId: userId,
                }
            },
            {
                $lookup: {
                    from: "users", // This should match the collection name MongoDB uses for your users
                    localField: "dispatcherId", // The field from the posts collection
                    foreignField: "_id", // The matching field from the users collection
                    as: "userData" // The array to put the matched user data into (temporarily)
                }
            },
            {
                $unwind: "$userData"
            },
            {
                $addFields: {
                    "profilePicture": "$userData.profilePicture",
                    "profilePictureType": "$userData.profilePictureType"
                }
            },
            {
                $project: {
                    "userData": 0
                }
            },
            {
                $sort: { "timeCreated": -1 }
            },
            {
                $skip: pageLength * pageNumber,
            },
            {
                $limit: pageLength
            },
        ]);

        return res.json({
            message: "",
            result: userNotifcations,
        })
    } catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

notificationRouter.get("/count", authMiddleware, async (req, res) => {
    const userId = (req.user as IUser)._id;

    try {
        const count = await NotificationModel.countDocuments({
            recipientId: userId,
        })

        return res.json({
            message: "",
            result: count,
        })
    } catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

notificationRouter.get("/message/count", authMiddleware, async (req, res) => {
    const userId = (req.user as IUser)._id;

    try {
        const notificationMessageCount = await NotificationModel.countDocuments({
            type: NotificationTypes.MessageReceived,
            recipientId: userId,
        })

        return res.json({
            message: "",
            result: notificationMessageCount,
        })
    } catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

notificationRouter.delete("/one/:id", authMiddleware, async (req, res) => {
    const userId = (req.user as IUser)._id;
    const id = req.params.id;

    try {
        const _id = new mongoose.Types.ObjectId(id);

        const { deletedCount } = await NotificationModel.deleteOne({
            _id,
            recipientId: userId,
        })

        return res.json({
            message: "",
            result: deletedCount,
        });
    } catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
})

notificationRouter.delete("/conversation/:id", authMiddleware, async (req, res) => {
    const userId = (req.user as IUser)._id;
    
    const id = req.params.id;

    try {

        const conversationId = new mongoose.Types.ObjectId(id);

        const { deletedCount } = await MessageNotificationModel.deleteMany({
            conversationId,
            recipientId: userId,
        })

        return res.json({
            message: "",
            result: deletedCount,
        });
    }
    catch(e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

notificationRouter.delete("/all", authMiddleware, async (req, res) => {
    const id = (req.user as IUser)._id;
    
    try {
        const { deletedCount } = await NotificationModel.deleteMany({
            recipientId: id,
        })

        return res.json({
            message: "",
            result: deletedCount,
        });
    }
    catch(e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

export default notificationRouter;