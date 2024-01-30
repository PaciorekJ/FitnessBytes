
interface Post {
    _id?: number;
    userId: number;
    username: string;
    content: string;
    likes?: number
    timeCreated?: Date;
}

export default Post;