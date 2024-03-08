import { Router } from "express";
import mongoose from "mongoose";
import { authMiddleware } from "../middleware/authMiddleware";
import { NotificationModel } from "../models/Notification";
import { IUser } from "../models/User";

const notificationRouter = Router();

notificationRouter.get("/", authMiddleware, async (req, res) => {
    const userId = (req.user as IUser)._id;

    try {
        const userNotifcations = await NotificationModel.find({
            recipientId: userId,
        })

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

notificationRouter.delete("/:id", authMiddleware, async (req, res) => {
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

export default notificationRouter;