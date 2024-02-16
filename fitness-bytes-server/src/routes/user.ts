
import bcrypt from 'bcrypt';
import { Request, Response, Router } from "express";
import jwt from 'jwt-simple';
import ResponseResult from '../interfaces/ResponseResult';
import { IUser } from "../models/User";
import { addUser, getPasswordFromUsername, getUserIDFromUsername } from "../services/UsersServices";

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
                message: "Error: Username already exists"
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

        const response: ResponseResult = { message: "" } 

        res.status(201).json(response);
    } catch (error) {
        console.error("Error while creating Account:", error);
        
        const response: ResponseResult = { 
            message: "Error: Internal Server Error" 
        }

        res.status(500).json(response);
    }
});

routerUser.post("/login", async (req: Request, res: Response) => {
    const body = req.body || {};
    
    const username = body.username || "";
    const password = body.password || "";

    if (!username || !password) {
        const response: ResponseResult = { 
            message: "Error: Username or password not present" 
        }

        return res.status(400).json(response);
    }

    try {
        // Retrieve the hashed password from the database
        const retrievedPassword = await getPasswordFromUsername(username);
    
        if (!retrievedPassword) {
            const response: ResponseResult = {
                message: "Error: Invalid username or password",
            }

            return res.status(401).json(response);
        }

        // Compare the entered password with the hashed password
        const passwordMatch = await bcrypt.compare(password, retrievedPassword);

        if (passwordMatch) {
            // Passwords match, create a JWT token
            const tokenPayload = { username: username };
            const token = jwt.encode(tokenPayload, SECREYKEY);

            const id = await getUserIDFromUsername(username);

            // Send the token in the response
            const response: ResponseResult = {
                message: "",
                result: {
                    _id: id,
                    token: token
                }
            }

            res.json(response);

        }
        else {
            const response: ResponseResult = {
                message: "Error: Passwords don't match",
            }
    
            // Passwords don't match
            res.status(401).json(response);
        }

    } catch (error) {

        const payload: ResponseResult = {
            message: "Internal Server Error",
        }

        console.error("Error during login:", error);
        res.status(500).json(payload);
    }
});

export default routerUser;