import { Router } from "express";
import mongoose from "mongoose";
import ResponseResult from "../interfaces/ResponseResult";
import { authMiddleware } from "../middleware/authMiddleware";
import { IUser } from "../models/user";
import report from "../services/ReportServices";
import { getUserIDFromUsername } from "../services/UsersServices";

const reportRouter = Router();

reportRouter.post('/', authMiddleware, async (req, res) => {

    const body = req.body || {};

    const ownerUsername = body.ownerUsername;

    let ownerId;
    let postId;
    let userId = (req.user as IUser)._id; // Retrieved from the session
    
    try {
        ownerId = await getUserIDFromUsername(ownerUsername)
        userId = new mongoose.Types.ObjectId(userId);
        postId = new mongoose.Types.ObjectId(body.postId);
        if (!ownerId) throw new Error("Username was not valid");
    }
    catch (err) {
        const payload: ResponseResult = {
            message: `${err}`,
        }

        return res.status(400).json(payload);
    }

    if (!postId) {

        const response: ResponseResult = {
            message: "No postID or userID or postOwnerId",
        }

        return res.status(400).json(response);
    }    

    try {

        const response: ResponseResult = {
            message: "",
            result: await report({
                userId: userId,
                ownerId: ownerId,
                postId: postId
            })
        }

        res.status(200).json(response);
    } catch (error) {

        const response: ResponseResult = {
            message: "Internal Server Error",
        }

        console.error("Error in /report:", error);
        res.status(500).json(response);
    }

})

export default reportRouter;