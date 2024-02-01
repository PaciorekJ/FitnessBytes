
import bcrypt from 'bcrypt';
import { Request, Response, Router } from "express";
import jwt from 'jwt-simple';
import { addUser, getPasswordFromUsername, getUserIDFromUsername } from "../database/users";
import Payload from "../interfaces/Payload";
import User from "../models/user";

const SECREYKEY = process.env.SECRETKEY || "";

const routerUser = Router();

routerUser.post("/signup", async (req, res) => {
    const body = req.body || {};

    const username: string = body.username || "";
    const password: string = body.password || "";

    if (!username || !password) {
        const payload: Payload = {
            message: "Error: Username or password not present"
        }

        return res.status(400).json(payload);
    }

    if (username.indexOf(' ') !== -1 || password.indexOf(' ') !== -1) {
        const payload: Payload = {
            message: "Error: Username or password contains space"
        }

        return res.status(400).json(payload);
    }

    try {
        // Check if the username already exists
        const userId = await getUserIDFromUsername(username);

        if (userId) {
            const payload: Payload = {
                message: "Error: Username already exists"
            }

            return res.status(409).json(payload);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: User = {
            username: username,
            password: hashedPassword,
        }

        // Add the user with the hashed password
        await addUser(newUser);

        const payload: Payload = { message: "" } 

        res.status(201).json(payload);
    } catch (error) {
        console.error("Error while creating Account:", error);
        
        const payload: Payload = { message: "Error: Internal Server Error" }
        res.status(500).json(payload);
    }
});

routerUser.post("/login", async (req: Request, res: Response) => {
    const body = req.body || {};
    
    const username = body.username || "";
    const password = body.password || "";

    if (!username || !password) {
        const payload: Payload = { message: "Error: Username or password not present" }

        console.log(payload);

        return res.status(400).json(payload);
    }

    try {
        // Retrieve the hashed password from the database
        const retrievedPassword = await getPasswordFromUsername(username);
    
        if (!retrievedPassword) {
            const payload: Payload = {
                message: "Error: Invalid username or password"
            }

            console.log("Invalid username or password");
            return res.status(401).json(payload);
        }

        // Compare the entered password with the hashed password
        const passwordMatch = await bcrypt.compare(password, retrievedPassword);

        if (passwordMatch) {
            // Passwords match, create a JWT token
            const tokenPayload = { username: username };
            const token = jwt.encode(tokenPayload, SECREYKEY);

            // Send the token in the response
            const payload: Payload = {
                message: "",
                token: token
            }

            res.json(payload);

        }
        else {
            const payload: Payload = {
                message: "Error: Passwords don't match",
            }
    
            // Passwords don't match
            res.status(401).json(payload);
        }

    } catch (error) {

        const payload: Payload = {
            message: "Internal Server Error",
        }

        console.error("Error during login:", error);
        res.status(500).json(payload);
    }
});

export default routerUser;