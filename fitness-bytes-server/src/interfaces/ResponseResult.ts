import mongoose from "mongoose";
import { IPost } from "../models/Post";
import { IReport } from "../models/Report";
import { IUser } from "../models/user";

type userPayload = IUser;

interface loginPayload {
    _id?: mongoose.Types.ObjectId;
}

interface ResponseResult {
    message: string;
    result?: boolean | loginPayload | userPayload | IPost[] | IPost | IReport | number; 
}

export default ResponseResult