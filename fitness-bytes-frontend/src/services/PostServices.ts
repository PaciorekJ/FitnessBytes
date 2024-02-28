import Post from "../interfaces/Post";
import ClientService, { ResponseResult } from "./ClientService";

type PostPostResponse = Post;
type PostPatchResponse = boolean;
type PostDeleteResponse = boolean;

type PostResponse = ResponseResult<PostPatchResponse | PostDeleteResponse | PostPostResponse>;

class PostServices {
    private client: ClientService<PostResponse> | undefined;
    private res: ResponseResult<PostResponse> | undefined;
    private endpoint = "/post";

    async post(post: Partial<Post>): Promise<Post | undefined> {
        this.client = new ClientService<PostResponse>(this.endpoint);

        try {
            this.res = await this.client.post({
                content: post.content,
            });
        } catch {
            return undefined;
        }

        return this.client.checkResponse(this.res) as PostPostResponse;
    }

    async patch(post: Partial<Post>): Promise<boolean | undefined> {
        this.client = new ClientService<PostResponse>(this.endpoint);

        try {
            this.res = await this.client.patch({
                postId: post._id,
                content: post.content,
            });
        } catch {
            return undefined;
        }

        return this.client.checkResponse(this.res) as PostPatchResponse;
    }

    async delete(_id: string): Promise<boolean | undefined> {
        this.client = new ClientService<PostResponse>(`${this.endpoint}/${_id}`);

        try {
            this.res = await this.client.delete();
        } catch {
            return undefined;
        }

        return this.client.checkResponse(this.res) as PostDeleteResponse;
    }
}

export default PostServices;