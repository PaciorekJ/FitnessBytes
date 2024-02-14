
import { Request, Response, Router } from "express";
import PageQuery from "../interfaces/PageQuery";
import Payload from "../interfaces/Payload";
import { getPostCountByUserId, getPostLikesByUserId } from "../services/LikeServices";
import { getUserIDFromUsername } from "../services/UsersServices";

const routerPost = Router();

routerPost.get("/feed/:username", async (req: Request & {query: PageQuery}, res: Response) => {
    try {
        const username = req.params.username || "No-Username";
        const userID = await getUserIDFromUsername(username)

        if (!userID) {
            const payload: Payload = {
                message: "Invalid Username",
            }

            return res.status(400).json(payload);
        }
        
        let posts;

        const payload: Payload = {
            message: "",
            posts: posts || [],
            username: username || "",
            userID: userID,
            pagenumber: parseInt(req.query.pageNumber || "0")
        }

        res.json(payload);

    } catch (error) {
        const payload: Payload = {
            message: "Internal Server Error"
        }
        
        console.error("Error in /feed route:", error);
        res.status(500).send(payload);
    }
});

routerPost.get("/accountPage/:username", async (req: Request & {query: PageQuery}, res: Response) => {
    try {
        const username = req.params.username || "No-Username";
        const userID = await getUserIDFromUsername(username)

        if (!userID) {
            const payload: Payload = {
                message: "Invalid Username",
            }

            return res.status(400).json(payload);
        }

        const pageNumber = parseInt(req.query.pageNumber || "0");
        const sortBy = req.query.sortBy || 'newest';

        const postCount = await getPostCountByUserId(userID);
        const likeCount = await getPostLikesByUserId(userID);

        let posts;

        const payload: Payload = {
            message: "",
            posts: posts || [],
            username: username,
            userID: userID,
            pagenumber: pageNumber,
            postNumber: postCount,
            likesNumber: likeCount
        }

        res.json(payload);
    } catch (error) {

        const payload: Payload = {
            message: "Internal Server Error",
        }

        console.error("Error in /accountPage route:", error);
        res.status(500).send(payload);
    }
});

export default routerPost;