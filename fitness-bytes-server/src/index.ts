
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jwt-simple';

import { addPost, addUser, deletePost, editPost, getLikedPosts, getMostLikedPosts, 
    getNewestPosts, getPasswordFromUsername, getPostCountByUserId, getPostLikesByUserId, 
    getUserIDFromUsername, isLiked, toggleLike, validateIsOwner } from './db';

dotenv.config();
const PORT = process.env.PORT || 3000;
const SECREYKEY = process.env.SECRETKEY || "";
interface Payload {
    message: string;
    token?: string;
}

const app: Express = express();
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    const payload: Payload = {
        message: "Welcome",
    }

    res.json(payload);
});

app.post("/createAccount", async (req, res) => {
    const body = req.body || {};  // Use an empty object as default

    const username: string = body.username || "";
    const password: string = body.password || "";

    if (!username || !password) {
        const payload: Payload = {
            message: "Error: Username or password not present"
        }

        return res.status(400).json(payload);
    }

    try {
        // Check if the username already exists
        const existingUser: number = await getUserIDFromUsername(username);

        if (!existingUser) {
            const payload: Payload = {
                message: "Error: Username already exists"
            }

            return res.status(409).json(payload);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Add the user with the hashed password
        await addUser(username, hashedPassword);

        const payload: Payload = { message: "" } 

        res.status(201).json(payload);
    } catch (error) {
        console.error("Error while creating Account:", error);
        
        const payload: Payload = { message: "Error: Internal Server Error" }
        res.status(500).json(payload);
    }
});

app.post("/login", async (req, res) => {
    const body = req.body || {};

    const username = body.username || "";
    const password = body.password || "";

    if (!username || !password) {
        const payload: Payload = { message: "Error: Username or password not present" }

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

app.use((req, res, next) => {
    const payload: Payload = {
        message: "ERROR: Resource could not be found",
    }

    res.status(404).json(payload);
})

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}...`);
});