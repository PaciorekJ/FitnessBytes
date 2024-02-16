import mongoose from "mongoose";
import { IPost } from "../models/Post";
import { IUser } from "../models/User";

type userPayload = IUser;

interface loginPayload {
    _id?: mongoose.Types.ObjectId;
    token: string;
}

interface ResponseResult {
    message: string;
    result?: boolean | loginPayload | userPayload | IPost[]; 
}

export default ResponseResult