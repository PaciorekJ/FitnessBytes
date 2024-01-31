
import { Router } from "express";
import { toggleLike, addPost, deletePost, editPost, validateIsOwner, isLiked } from "../controllers/postsController";
import { ObjectId } from "mongodb";
import Payload from "../interfaces/Payload";
import authMiddleware from "../middleware/authMiddleware";

export interface APIResponse {
    message: string;
    result?: boolean | number; 
}

const router = Router()

// *** API Routes ***
//authMiddleware
router.post("/api/likePost", async (req, res) => {
    if (req.get("Content-Type") !== "application/json") {
        return res.status(400).send("Error: Expect Content-Type application/json");
    }

    const body = req.body || {};
    const userID = body.userID || "";
    const postID = body.postID || "";

    if (postID === "" || userID === "") {
        return res.status(400).send("No postID or userID");
    }

    try {
        const result = await toggleLike(postID, userID);
        res.status(200).json(result); // Send JSON response
    } catch (error) {
        console.error("Error in /api/likePost:", error);
        res.status(500).send("Internal Server Error");
    }
});

// authMiddleware
router.post("/api/addPost", async (req, res) => {
    if (req.get("Content-Type") !== "application/json") {
        return res.status(400).send("Error: Expect Content-Type application/json");
    }

    const body = req.body || {};
    const userID = parseInt(body.userID) || "";
    const content = body.content || "";
    const username = body.username || "";

    if (userID === "" || content === "" || username === "") {
        return res.status(400).send("No UserID or Content or Username");
    }

    try {
        const result = await addPost(userID, username, content);
        res.status(201).json(result); // Send JSON response
    } catch (error) {
        console.error("Error in /api/addPost:", error);
        res.status(500).send("Internal Server Error");
    }
});

//authMiddleware
router.delete("/api/deletePost", async (req, res) => {
    if (req.get("Content-Type") !== "application/json") {
        
        const payload: APIResponse = {
            message: "Error: Expect Content-Type application/json",
        }

        return res.status(400).json(payload);
    }

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
router.patch("/api/editPost", async (req, res) => {
    if (req.get("Content-Type") !== "application/json") {

        const payload: APIResponse = {
            message: "Error: Expect Content-Type application/json",
        }

        return res.status(400).json(payload);
    }

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
router.post(`/api/postOwner`, async (req, res) => {
    if (req.get("Content-Type") !== "application/json") {

        const payload: APIResponse = {
            message: "Error: Expect Content-Type application/json",
        }

        return res.status(400).json(payload);
    }

    const body = req.body || {};

    const postID = body.postID;
    const userID = body.userID;

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

router.post('/api/isLiked', async (req, res) => {
    if (req.get("Content-Type") !== "application/json") {
        
        const payload: APIResponse = {
            message: "Error: Expect Content-Type application/json",
        }

        return res.status(400).json(payload);
    }

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
