
import bcrypt from 'bcrypt';
import { Router } from "express";
import passport from 'passport';
import escapeRegExp from '../libs/RegExp';
import { authMiddleware } from '../middleware/authMiddleware';
import UserModel, { IUser } from "../models/User";
import UserConfigModel from '../models/UserConfig';

const userRouter = Router();

userRouter.delete("/", authMiddleware, async (req, res) => {
    const _id = (req.user as IUser)._id;

    try {
        const { deletedCount } = await UserModel.deleteOne({_id});

        return res.status(200).json({ 
            message: "",
            result: deletedCount,
        });
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

userRouter.patch("/username", authMiddleware, async (req, res) => {
    const _id = (req.user as IUser)._id;
    const username: string = req.body.username;

    if (!username) {
        return res.status(400).json({
            message: "New username field missing from request body"
        });
    }

    const existingUser = await UserModel.findOne({ username: username });
    if (existingUser) {
        return res.status(400).json({
            message: "Username is already taken"
        });
    }

    try {
        const updatedUser = await UserModel.findOneAndUpdate({_id}, {$set: {username: username}});

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.json({
            message: "",
            result: updatedUser,
        });
    } catch (e) {
        console.error(e); // It's good practice to log the error
        return res.status(500).json({ 
            message: "Error: Internal Server Error"
        });
    }
});

userRouter.get("/user/:username", authMiddleware, async (req, res) => {
    const username = req.params.username;

    try {
        const user = await UserModel.findOne({username}).select("-password");

        return res.json({
            message: "",
            result: user,
        })
    }
    catch (e) {
        return res.status(500).json({
            message: "Username may not exist or a internal server error has occurred",
        });
    }
})

userRouter.get("/search", async (req, res) => {
    const { query } = req.query as {query: string};

    try {
        const regex = new RegExp(escapeRegExp(query || ".*"), 'i');

        const users = await UserModel.find({
            $or: [
              { username: regex }
            ]
        }).select("-password");

        res.json({
            message: "",
            result: users
        })
    } 
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

userRouter.get("/auth", (req, res) => {
    if (req.isAuthenticated()){
        const user = req.user as IUser;
        return res.json({ result : user.username });
    }
    return res.status(401).json({
        message: "User needs authentication",
        result: undefined
    })
});

userRouter.post("/signup", async (req, res) => {
    const body = req.body || {};

    const username: string = body.username || "";
    const password: string = body.password || "";

    if (!username || !password) {
        return res.status(400).json({
            message: "Error: Username or password not present"
        });
    }

    if (username.indexOf(' ') !== -1 || password.indexOf(' ') !== -1) {

        return res.status(400).json({
            message: "Error: Username or password contains space"
        });
    }

    try {
        // Check if the username already exists
        const userId = await UserModel.findOne({ username: username }).select('_id');

        if (userId) {
            return res.status(409).json({
                message: "Error: Username already exists",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: Partial<IUser> = {
            username: username,
            password: hashedPassword,
        }

        const user = await UserModel.create(newUser);

        UserConfigModel.create({
            username,
        });

        return res.status(201).json({ 
            message: "", 
            result: user
        });
    } catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
});

userRouter.post("/login", passport.authenticate('local'), (req, res) => {
    return res.json({
        message: "",
        result: (req.user as IUser).username,
    });
});

userRouter.patch("/bio", authMiddleware, async (req, res) => {
    const bio = req.body.bio;
    const _id = (req.user as IUser)._id;

    if (!bio) return res.status(400).json({
        message: "Bio is missing from request",
        result: false,
    });

    await UserModel.findByIdAndUpdate(_id, { bio });

    return res.status(200).json({
        message: "",
        result: true,
    });
});

userRouter.patch("/profilePicture", authMiddleware, async (req, res) => {
    const profilePicture = req.body.profilePicture;
    const profilePictureType = req.body.profilePictureType;
    const _id = (req.user as IUser)._id;

    console.log(`
    Content: 
    ${profilePicture.toString()}
    
    Type:
    ${profilePictureType}`);

    if (!profilePicture || !profilePictureType) return res.status(400).json({
        message: "profilePicture or profilePictureType is missing from request",
        result: false,
    });

    await UserModel.findByIdAndUpdate(_id, { profilePicture, profilePictureType });

    return res.status(200).json({
        message: "",
        result: true,
    });
});

userRouter.post("/logout", (req, res, next) => {
    req.logout((e) => {
        if (e) { 
            return next(e); 
        }
        
        return res.status(200).json({ 
            message: "",
            result: true,
        });
      });
})

export default userRouter;