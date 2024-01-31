import { ObjectId } from "mongodb";

interface PostLikes {
    postID: ObjectId,
    userID: ObjectId,
}

export default PostLikes;