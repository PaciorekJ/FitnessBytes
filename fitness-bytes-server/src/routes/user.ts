
import bcrypt from 'bcrypt';
import { Request, Response, Router } from "express";
import jwt from 'jwt-simple';
import ResponseResult from '../interfaces/ResponseResult';
import { validatePassword } from '../libs/Auth';
import { IUser } from "../models/user";
import { addUser, getUserIDFromUsername } from "../services/UsersServices";
import passport from 'passport';

const SECREYKEY = process.env.SECRETKEY!;

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

routerUser.post("/login", passport.authenticate('local'), async (req: Request, res: Response) => {
    const body = req.body || {};
    
    const username = body.username || "";
    const password = body.password || "";

    if (!username || !password) {
        const response: ResponseResult = { 
            message: "Error: Username or password not present" 
        }

        return res.status(400).json(response);
    }

    const response: ResponseResult = { 
        message: "",
        result: true
    }

    return res.status(200).json(response);
    
});

export default routerUser;