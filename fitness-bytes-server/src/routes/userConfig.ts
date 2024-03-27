
import { Router } from "express";
import { authMiddleware } from '../middleware/authMiddleware';
import { IUser } from "../models/User";
import UserConfigModel from '../models/UserConfig';

const userConfigRouter = Router();

userConfigRouter.get("/", authMiddleware, async (req, res) => {
    const username = (req.user as IUser).username;

    const config = await UserConfigModel.findOne({username: username}).select("-username");

    if (!config) {
        const createdConfig = await UserConfigModel.create({
            username: username
        });

        return res.status(201).json({
            message: "",
            result: createdConfig,
        });
    }

    return res.json({
        message: "",
        result: config,
    });
});

userConfigRouter.patch("/", authMiddleware, async (req, res) => {
    const username = (req.user as IUser).username;

    try {
        const configUpdates = req.body;

        const updated = await UserConfigModel.findOneAndUpdate({ username: username }, 
            { $set: configUpdates },
            { select: "-username" }
        );
    
        return res.json({
            message: "User config updated successfully",
            result: updated,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong while updating the user config",
            result: false,
        });
    }
});


export default userConfigRouter;