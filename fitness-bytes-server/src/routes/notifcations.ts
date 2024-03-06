import { Router } from "express";
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
})

export default notificationRouter;