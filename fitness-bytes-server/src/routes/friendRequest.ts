import { Router } from "express";
import FriendRequestModel from "../models/FriendRequest";
import { IUser } from "../models/User";

const friendRequestRouter = Router();

friendRequestRouter.post('/', async (req, res) => {
    const recipientId = req.body.recipientId;
    const requesterId = (req.user as IUser)._id;

    if (!recipientId) {
        res.status(400).json({
            message: "Missing recipientId",
        })
    }

    try {
        const friendRequest = await FriendRequestModel.create({
            recipientId,
            requesterId
        })

        res.json({
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

export default friendRequestRouter;