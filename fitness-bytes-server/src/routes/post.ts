import { Router } from "express";
import mongoose from "mongoose";
import ResponseResult from "../interfaces/ResponseResult";
import { authMiddleware } from "../middleware/authMiddleware";
import { IPost } from "../models/Post";
import { IUser } from "../models/user";
import { isLiked, toggleLike } from "../services/LikeServices";
import { addPost, deletePost, editPost, getPost } from "../services/PostServices";

const postRouter = Router();

postRouter.get('/liked/:postId', authMiddleware, async (req, res) => {

    let userId = (req.user as IUser)._id; // Retrieved from the user's current session
    let postId;

    try {
        userId = new mongoose.Types.ObjectId(userId);
        postId = new mongoose.Types.ObjectId(req.params.postId);
    }
    catch (err) {
        const payload: ResponseResult = {
            message: `${err}`,
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
        }
        res.status(500).json(payload);
    }
});


postRouter.post("/like", authMiddleware, async (req, res) => {

    let userId = (req.user as IUser)._id;
    let postId;

    try {
        userId = new mongoose.Types.ObjectId(userId);
        postId = new mongoose.Types.ObjectId(req.body.postId);
    }
    catch (err) {
        const payload: ResponseResult = {
            message: `${err}`,
        }

        return res.status(400).json(payload);
    }

    if (!postId) {

        const response: ResponseResult = {
            message: "No postID",
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

postRouter.post("/", authMiddleware, async (req, res) => {

    const content = req.body.content || "";
    
    const user = req.user as IUser;
    const userId = user._id || "";
    const username = user.username || "";
    
    if (content === "") {

        const response: ResponseResult = {
            message: "No Content Provided",
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

postRouter.get("/:postId", async (req, res) => {
    
    let postId;

    try {
        postId = new mongoose.Types.ObjectId(req.params.postId)
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
            result: await getPost(postId),
        }

        res.status(200).json(payload);
    } catch (error) {

        const payload: ResponseResult = {
            message: "Internal Server Error",
        }

        console.error("Error in get /post/:postId:", error);
        res.status(500).json(payload);
    }
});


postRouter.delete("/:postId", async (req, res) => {
    
    let postId;

    try {
        postId = new mongoose.Types.ObjectId(req.params.postId)
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

postRouter.patch("/", authMiddleware, async (req, res) => {

    let postId;
    const content = req.body.content || "";

    try {
        postId = new mongoose.Types.ObjectId(req.body.postId)
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

export default postRouter;