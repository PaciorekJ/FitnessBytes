import { ObjectId } from 'mongodb';
import Post from '../models/Post';

interface Payload {
    message: string;
    posts?: Post[],
    username?: string;
    userID?: ObjectId;
    pagenumber?: number;
    postNumber?: number;
    likesNumber?: number;
    token?: string;
}

export default Payload