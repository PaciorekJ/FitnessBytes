import { Router } from "express";
import ResponseResult from "../interfaces/ResponseResult";
import { findPosts, findUserPostCount, findUserPosts } from "../services/PostServices";

const postsRouter = Router();

postsRouter.get('/', async (req, res) => {

    const posts = await findPosts();

    const response: ResponseResult = {
        message: "",
        result: posts,
    }

    return res.status(200).json(response);
})

postsRouter.get('/:username', async (req, res) => {

    const username = req.params.username;

    const posts = await findUserPosts(username);

    const response: ResponseResult = {
        message: "",
        result: posts,
    };

    return res.status(200).json(response);
})

postsRouter.get('/count/:username', async (req, res) => {

    const username = req.params.username;

    const count = await findUserPostCount(username);

    const response: ResponseResult = {
        message: "",
        result: count,
    };

    return res.status(200).json(response);
})


export default postsRouter;