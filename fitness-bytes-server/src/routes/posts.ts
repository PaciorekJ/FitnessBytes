import { Router } from "express";
import PostModel from "../models/Post";

const postsRouter = Router();

postsRouter.get('/', async (req, res) => {

    try {
        const posts = await PostModel.find().sort({timeCreated: -1});
        
        return res.json({
            message: "",
            result: posts,
        });

    } catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
})

postsRouter.get('/:username', async (req, res) => {

    const username = req.params.username;

    try {
        const posts = await PostModel.find({username: username}).sort({timeCreated: -1});

        return res.status(200).json({
            message: "",
            result: posts,
        });
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }

})

postsRouter.get('/count/:username', async (req, res) => {

    const username = req.params.username;

    try {
        const count = await PostModel.find({username: username}).countDocuments();
    
        return res.status(200).json({
            message: "",
            result: count,
        });
    }
    catch (e) {
        return res.status(500).json({ 
            message: `Error: Internal Server Error: ${e}` 
        });
    }
})


export default postsRouter;