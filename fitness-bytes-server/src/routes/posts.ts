import { Router } from "express";
import PostModel from "../models/Post";

const postsRouter = Router();

postsRouter.get('/', async (req, res) => {

    try {
        const posts = await PostModel.aggregate([
            {
                $lookup: {
                    from: "users", // This should match the collection name MongoDB uses for your users
                    localField: "username", // The field from the posts collection
                    foreignField: "username", // The matching field from the users collection
                    as: "userData" // The array to put the matched user data into (temporarily)
                }
            },
            {
                $unwind: "$userData" // Convert the userData array to an object
            },
            {
                $addFields: {
                    "profilePicture": "$userData.profilePicture", // Add the profilePicture field to the post
                    "profilePictureType": "$userData.profilePictureType"
                }
            },
            {
                $project: {
                    "userData": 0 // Optionally remove the userData object from the final output
                }
            },
            {
                $sort: { "timeCreated": -1 } // Sort the posts by creation time
            }
        ]);
        
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