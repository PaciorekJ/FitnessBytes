
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';

dotenv.config();

import ResponseResult from './interfaces/ResponseResult';

import mongoose from 'mongoose';
import { IPost } from './models/Post';
import routerUser from './routes/user';
import { isLiked, toggleLike, validateIsOwner } from './services/LikeServices';
import { addPost, deletePost, editPost, findPosts, findUserPostCount, findUserPosts } from './services/PostServices';
import db from './services/db';

const PORT = process.env.PORT || 3000;

const app: Express = express();

db.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());



app.get('/posts/:username', async (req: Request, res: Response) => {

    const username: string = req.params.username;

    const posts = await findUserPosts(username);

    const response: ResponseResult = {
        message: "",
        result: posts,
    };

    return res.status(200).json(response);
})

app.get('/posts/count/:username', async (req: Request, res: Response) => {

    const username: string = req.params.username;

    const count = await findUserPostCount(username);

    const response: ResponseResult = {
        message: "",
        result: count,
    };

    return res.status(200).json(response);
})

app.get('/posts', async (req: Request, res: Response) => {

    const posts = await findPosts();

    const response: ResponseResult = {
        message: "",
        result: posts,
    }

    return res.status(200).json(response);
})

app.post("/post/like", async (req, res) => {

    const body = req.body || {};
    let userId;
    let postId;

    try {
        userId = new mongoose.Types.ObjectId(body.userId);
        postId = new mongoose.Types.ObjectId(body.postId);
    }
    catch (err) {
        const payload: ResponseResult = {
            message: `${err}`,
        }

        return res.status(400).json(payload);
    }

    if (!userId || !postId) {

        const response: ResponseResult = {
            message: "No postID or userID",
        }

        return res.status(400).json(response);
    }

    try {

        const response: ResponseResult = {
            message: "",
            result: await toggleLike(postId, userId)
        }

        res.status(200).json(response);
    } catch (error) {

        const response: ResponseResult = {
            message: "Internal Server Error",
        }

        console.error("Error in /api/likePost:", error);
        res.status(500).json(response);
    }
});

// authMiddleware
app.post("/post", async (req, res) => {

    const body = req.body || {};
    const userId = body.userId || "";
    const content = body.content || "";
    const username = body.username || "";

    if (!userId || content === "" || username === "") {

        const response: ResponseResult = {
            message: "No UserID or Content or Username",
        }

        return res.status(400).json(response);
    }

    try {

        const newPost: Partial<IPost> = {
            userId: userId,
            username: username,
            content: content,
        }

        const response: ResponseResult = {
            message: "",
            result: await addPost(newPost),
        }

        res.status(201).json(response);
        
    } catch (error) {

        const payload: ResponseResult = {
            message: "Internal Server Error",
        }

        console.error("Error in /api/addPost:", error);
        res.status(500).json(payload);
    }
});

app.delete("/post", async (req, res) => {

    const body = req.body || {};
    
    let postId;

    try {
        postId = new mongoose.Types.ObjectId(body.postId)
    }
    catch (err) {
        const payload: ResponseResult = {
            message: `${err}`,
        }

        return res.status(400).json(payload);
    }

    if (!postId) {

        const payload: ResponseResult = {
            message: "No postID",
        }

        return res.status(400).json(payload);
    }

    try {

        const payload: ResponseResult = {
            message: "",
            result: await deletePost(postId)
        }

        res.status(200).json(payload);
    } catch (error) {

        const payload: ResponseResult = {
            message: "Internal Server Error",
        }

        console.error("Error in /api/deletePost:", error);
        res.status(500).json(payload);
    }
});

app.patch("/post", async (req, res) => {

    const body = req.body || {};

    let postId;
    const content = body.content || "";

    try {
        postId = new mongoose.Types.ObjectId(body.postId)
    }
    catch (err) {
        const payload: ResponseResult = {
            message: `${err}`,
        }

        return res.status(400).json(payload);
    }

    if (!postId || content === "") {

        const payload: ResponseResult = {
            message: "No postId or Content",
        }

        return res.status(400).json(payload);
    }

    try {

        const payload: ResponseResult = {
            message: "",
            result: await editPost(postId, content)
        }

        res.status(200).json(payload);
    } catch (error) {

        const payload: ResponseResult = {
            message: "Internal Server Error",
        }

        console.error("Error in /api/editPost:", error);
        res.status(500).json(payload);
    }
});

app.post(`/user/post/owner`, async (req, res) => {

    const body = req.body || {};

    let userId;
    let postId;

    try {
        userId = new mongoose.Types.ObjectId(body.userId);
        postId = new mongoose.Types.ObjectId(body.postId);
    }
    catch (err) {
        const payload: ResponseResult = {
            message: `${err}`,
        }

        return res.status(400).json(payload);
    }

    if (!postId || !userId) {

        const payload: ResponseResult = {
            message: "No postId or UserId",
        }

        return res.status(400).json(payload);
    }

    try {

        const payload: ResponseResult = {
            message: "",
            result: await validateIsOwner(postId, userId)
        }

        res.status(200).json(payload);
    } catch (error) {

        const payload: ResponseResult = {
            message: "Internal Server Error",
        }

        console.error("Error in /api/postOwner:", error);
        res.status(500).json(payload);
    }
});

app.post('/user/post/liked', async (req, res) => {

    const body = req.body || {};

    let userId;
    let postId;

    try {
        userId = new mongoose.Types.ObjectId(body.userId);
        postId = new mongoose.Types.ObjectId(body.postId);
    }
    catch (err) {
        const payload: ResponseResult = {
            message: `${err}`,
        }

        return res.status(400).json(payload);
    }

    if (!postId || !userId) {

        const payload: ResponseResult = {
            message: "No postId or UserId",
        }

        return res.status(400).json(payload);
    }

    try {

        const payload: ResponseResult = {
            message: "",
            result: await isLiked(postId, userId)
        }

        res.status(200).json(payload);
    } catch (error) {

        const payload: ResponseResult = {
            message: "Internal Server Error",
            result: await isLiked(postId, userId)
        }

        console.error("Error in /api/isLiked:", error);
        res.status(500).json(payload);
    }
});

app.use('/user', routerUser);

app.use((req, res, next) => {
    const payload: ResponseResult = {
        message: "ERROR: Resource could not be found",
    }

    res.status(404).json(payload);
})

app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}...`);
});