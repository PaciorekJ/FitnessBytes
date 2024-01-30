import Post from '../models/Post';

interface Payload {
    message: string;
    posts?: Post[],
    username?: string;
    userID?: number;
    pagenumber?: number;
    token?: string;
}

export default Payload