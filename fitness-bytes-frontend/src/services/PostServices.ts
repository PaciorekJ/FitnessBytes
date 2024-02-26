import Post from "../interfaces/Post";
import ClientService, { ResponseResult } from "./ClientService";

type PostPostResponse = Post;
type PostPatchResponse = boolean;
type PostDeleteResponse = boolean;

type PostResponse = ResponseResult<PostPatchResponse | PostDeleteResponse | PostPostResponse>;

class PostServices {
    private client: ClientService<PostResponse> | undefined;
    private res: ResponseResult<PostResponse> | undefined;

    private checkResponse(res: ResponseResult<PostResponse>): unknown {
        if (!res.result || res.message) {
            return undefined;
        }

        return res.result as unknown
    }

    async post(post: Post): Promise<Post | undefined> {
        this.client = new ClientService<PostResponse>('/post');

        try {
            this.res = await this.client.post({
                userId: post._id,
                username: post.username,
                content: post.content,
            });
        } catch {
            return undefined;
        }

        if (this.res.message) {
            return undefined;
        }

        return this.checkResponse(this.res) as PostPostResponse;
    }

    async patch(post: Partial<Post>): Promise<boolean | undefined> {
        this.client = new ClientService<PostResponse>('/post');

        try {
            this.res = await this.client.patch({
                postId: post._id,
                content: post.content,
            });
        } catch {
            return undefined;
        }

        return this.checkResponse(this.res) as PostPatchResponse;
    }

    async delete(_id: string): Promise<boolean | undefined> {
        const client = new ClientService<PostResponse>(`/post/${_id}`);

        try {
            this.res = await client.delete();
        } catch {
            return undefined;
        }

        return this.checkResponse(this.res) as PostDeleteResponse;
    }
}

export default PostServices;