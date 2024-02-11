
interface Post {
    username: string;
    content: string;
    likes?: number
    timeCreated?: Date;
}

export default Post;