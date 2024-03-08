import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";


interface IPost {
    _id: string;
    username: string;
    content: string;
    likes?: number;
    timeCreated?: Date;
}

type PostResponse = ResponseResult<boolean | IPost | IPost[]>;

class PostServices {
    private static factPost = new EndpointFactory<PostResponse>("/post");
    private static factPosts = new EndpointFactory<PostResponse>("/posts");

    static create = PostServices.factPost.post<IPost, IPost>();
    static update = PostServices.factPost.patch<boolean, IPost>();
    static delete = PostServices.factPost.delete<boolean>();
    static getAll = (username: string = "") => PostServices.factPosts.get<IPost[]>()(username);
    static getOne = PostServices.factPost.get<IPost>();

    static like = (_id: string) => PostServices.factPost.post<boolean, { postId: string }>("/like")({ postId: _id });
    static isLiked = PostServices.factPost.get<boolean>("/liked/");
    static getCount = (username: string) => PostServices.factPosts.get<number>("/count")(username);
}

export type { IPost };
export default PostServices;