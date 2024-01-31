
import { Router } from "express";
import { toggleLike, addPost, deletePost, editPost, validateIsOwner, isLiked } from "../controllers/postsController";
import { ObjectId } from "mongodb";
// import authMiddleware from "../middleware/authMiddleware";
import jsonMiddleware from "../middleware/jsonMiddleware";
import Post from "../models/Post";

export interface APIResponse {
    message: string;
    result?: boolean | number; 
}

const routerAPI = Router()

routerAPI.use(jsonMiddleware<APIResponse>); // Ensures all route have json/application headers properly set returns a APIResponse if fails

// *** API Routes ***
//authMiddleware
routerAPI.post("/likePost", async (req, res) => {

    const body = req.body || {};
    const userID: ObjectId = body.userID || "";
    const postID: ObjectId = body.postID || "";

    if (!postID || !userID) {

        const payload: APIResponse = {
            message: "No postID or userID",
        }

        return res.status(400).json(payload);
    }

    try {

        const payload: APIResponse = {
            message: "",
            result: await toggleLike(postID, userID)
        }

        res.status(200).json(payload);
    } catch (error) {

        const payload: APIResponse = {
            message: "Internal Server Error",
        }

        console.error("Error in /api/likePost:", error);
        res.status(500).json(payload);
    }
});

// authMiddleware
routerAPI.post("/addPost", async (req, res) => {

    const body = req.body || {};
    const userID: ObjectId = body.userID;
    const content = body.content || "";
    const username = body.username || "";

    if (!userID || content === "" || username === "") {

        const payload: APIResponse = {
            message: "No UserID or Content or Username",
        }

        return res.status(400).json(payload);
    }

    try {

        const newPost: Post = {
            userId: userID,
            username: username,
            content: content,
        }

        const result = await addPost(newPost);
        res.status(201).json(result);
    } catch (error) {

        const payload: APIResponse = {
            message: "Internal Server Error",
        }

        console.error("Error in /api/addPost:", error);
        res.status(500).json(payload);
    }
});

//authMiddleware
routerAPI.delete("/deletePost", async (req, res) => {

    const body = req.body || {};
    
    const postID: ObjectId = body.postID;

    if (!postID) {

        const payload: APIResponse = {
            message: "No postID",
        }

        return res.status(400).json(payload);
    }

    try {

        const payload: APIResponse = {
            message: "",
            result: await deletePost(postID)
        }

        res.status(200).json(payload);
    } catch (error) {

        const payload: APIResponse = {
            message: "Internal Server Error",
        }

        console.error("Error in /api/deletePost:", error);
        res.status(500).json(payload);
    }
});

//authMiddleware
routerAPI.patch("/editPost", async (req, res) => {

    const body = req.body || {};

    const postID: ObjectId = body.postID;
    const content = body.content || "";

    if (!postID || content === "") {

        const payload: APIResponse = {
            message: "No postID or Content",
        }

        return res.status(400).json(payload);
    }

    try {

        const payload: APIResponse = {
            message: "",
            result: await editPost(postID, content)
        }

        res.status(200).json(payload);
    } catch (error) {

        const payload: APIResponse = {
            message: "Internal Server Error",
        }

        console.error("Error in /api/editPost:", error);
        res.status(500).json(payload);
    }
});

// *** Verifys that someone is the owner of a post ***
routerAPI.post(`/postOwner`, async (req, res) => {

    const body = req.body || {};

    const postID: ObjectId = body.postID;
    const userID: ObjectId = body.userID;

    if (!postID || !userID) {

        const payload: APIResponse = {
            message: "No postID or UserID",
        }

        return res.status(400).json(payload);
    }

    try {

        const payload: APIResponse = {
            message: "",
            result: await validateIsOwner(postID, userID)
        }

        res.status(200).json(payload);
    } catch (error) {

        const payload: APIResponse = {
            message: "Internal Server Error",
        }

        console.error("Error in /api/postOwner:", error);
        res.status(500).json(payload);
    }
});

routerAPI.post('/isLiked', async (req, res) => {

    const body = req.body || {};

    const postID: ObjectId = body.postID;
    const userID: ObjectId = body.userID;

    if (!postID || !userID) {

        const payload: APIResponse = {
            message: "No postID or UserID",
        }

        return res.status(400).json(payload);
    }

    try {

        const payload: APIResponse = {
            message: "",
            result: await isLiked(postID, userID)
        }

        res.status(200).json(payload);
    } catch (error) {

        const payload: APIResponse = {
            message: "Internal Server Error",
            result: await isLiked(postID, userID)
        }

        console.error("Error in /api/isLiked:", error);
        res.status(500).json(payload);
    }
});

export default routerAPI;
