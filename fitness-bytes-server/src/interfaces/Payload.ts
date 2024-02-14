import { ObjectId } from 'mongoose';
import { IPost } from '../models/Post';

interface Payload {
    message: string;
    posts?: IPost[],
    username?: string;
    userID?: ObjectId;
    pagenumber?: number;
    postNumber?: number;
    likesNumber?: number;
    token?: string;
}

export default Payload