
import bcrypt from 'bcrypt';
import { Router } from "express";
import passport from 'passport';
import UserModel, { IUser } from "../models/User";

const userRouter = Router();

userRouter.get("/auth", (req, res) => {
    if (req.isAuthenticated()){
        const user = req.user as IUser;
        return res.json({ result : user.username });
    }
    return res.status(401).json({
        message: "User needs authentication"
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

userRouter.post("/login", passport.authenticate('local'));

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