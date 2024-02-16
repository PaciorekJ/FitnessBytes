
interface Post {
    _id: string;
    username: string;
    content: string;
    likes?: number;
    timeCreated?: Date;
}

export default Post;