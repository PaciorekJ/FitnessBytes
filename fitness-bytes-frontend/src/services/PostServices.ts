import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";

interface IPost {
    _id: string;
    userId: string;
    username: string;
    content: string;
    imageId?: string;
    likes?: number;
    timeCreated?: Date;
}

interface IPostImage {
    _id: string;
    image: string, 
    imageType: string;
}

type PostResponse = ResponseResult<boolean | IPost | IPost[]>;

class PostServices {
    private static factPost = new EndpointFactory<PostResponse>("/post");
    private static factPosts = new EndpointFactory<PostResponse>("/posts");

    static create = PostServices.factPost.post<IPost, IPost>();
    static update = PostServices.factPost.patch<boolean, IPost>();
    static addImage = (_id: string, image: string, imageType: string) => PostServices.factPost.post<IPostImage, IPost & IPostImage>("/uploadImage/")({
        _id,
        image,
        imageType,
    })
    static updateImage = (_id: string, image: string, imageType: string) => PostServices.factPost.patch<IPostImage, IPost & IPostImage>("/uploadImage/")({
        _id,
        image,
        imageType,
    })
    static getImage = PostServices.factPost.get<IPostImage>("/image/")
    static delete = PostServices.factPost.delete<boolean>();
    static getAll = (username: string = "") => PostServices.factPosts.get<IPost[]>()(username);
    static getOne = PostServices.factPost.get<IPost>();

    static like = (_id: string) => PostServices.factPost.post<boolean, { postId: string }>("/like")({ postId: _id });
    static isLiked = PostServices.factPost.get<boolean>("/liked/");
    static getCount = (username: string) => PostServices.factPosts.get<number>("/count/")(username);
}

export type { IPost, IPostImage };
export default PostServices;