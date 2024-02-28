
import bcrypt from 'bcrypt';
import { Router } from "express";
import passport from 'passport';
import ResponseResult from '../interfaces/ResponseResult';
import { IUser } from "../models/user";
import { addUser, getUserIDFromUsername } from "../services/UsersServices";

const routerUser = Router();

routerUser.post("/signup", async (req, res) => {
    const body = req.body || {};

    const username: string = body.username || "";
    const password: string = body.password || "";

    if (!username || !password) {
        const response: ResponseResult = {
            message: "Error: Username or password not present"
        }

        return res.status(400).json(response);
    }

    if (username.indexOf(' ') !== -1 || password.indexOf(' ') !== -1) {
        const response: ResponseResult = {
            message: "Error: Username or password contains space"
        }

        return res.status(400).json(response);
    }

    try {
        // Check if the username already exists
        const userId = await getUserIDFromUsername(username);

        if (userId) {
            const response: ResponseResult = {
                message: "Error: Username already exists",
                result: false
            }

            return res.status(409).json(response);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: Partial<IUser> = {
            username: username,
            password: hashedPassword,
        }

        // Add the user with the hashed password
        await addUser(newUser);

        const response: ResponseResult = { message: "", result: true } 

        res.status(201).json(response);
    } catch (error) {
        console.error("Error while creating Account:", error);
        
        const response: ResponseResult = { 
            message: "Error: Internal Server Error" 
        }

        res.status(500).json(response);
    }
});

routerUser.post("/login", passport.authenticate('local'));

routerUser.post("/logout", (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        
        const response: ResponseResult = { 
            message: "",
            result: true,
        }
        
        res.status(200).json(response);
      });
})

routerUser.get("/auth", (req, res) => {
    if (req.isAuthenticated()){
        const user = req.user as IUser;
        return res.json({ result : user.username });
    }
    return res.status(401).json({result: ""})
});

export default routerUser;