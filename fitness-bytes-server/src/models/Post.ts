import { ObjectId } from "mongodb";

interface Post {
    _id?: ObjectId;
    userId: ObjectId;
    username: string;
    content: string;
    likes?: number
    timeCreated?: Date;
}

export default Post;