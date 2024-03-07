import Post from "../interfaces/Post";
import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";

type PostPostResponse = Post;
type PostPatchResponse = boolean;
type PostDeleteResponse = boolean;

type PostResponse = ResponseResult<PostPatchResponse | PostDeleteResponse | PostPostResponse>;

class PostServices {
    private static fact = new EndpointFactory<PostResponse>("/post");

    static create = PostServices.fact.post<PostPostResponse, Post>();
    static update = PostServices.fact.patch<PostPatchResponse, Post>();
    static delete = PostServices.fact.delete<PostDeleteResponse>();
}

export default PostServices;