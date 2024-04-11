import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";

interface IReply {
    _id: string;
    userId: string;
    postId: string;
    parentReplyId: string | null;
    content: string;
    likes?: number;
    timeCreated?: Date;
}

export interface IReplyNode {
    rootId: string;
    parentId: string | null;
}

type ReplyResponse = ResponseResult<boolean | IReply | IReply[] | number>;

class ReplyServices {
    private static fact = new EndpointFactory<ReplyResponse>("/reply");

    static getReplyToPostCount = (postId: string) => this.fact.get<number>("/postRepliesCount/")(postId);
    static getReplyToReplyCount = (replyId: string) => this.fact.get<number>("/replyRepliesCount/")(replyId);
    
    static get = this.fact.get<IReply>("/");
    static create = this.fact.post<IReply, IReply>();
    static update = this.fact.patch<IReply, IReply>("/");
    static getFromPost = (postId: string) => this.fact.get<IReply[]>("/postReplies/")(postId);
    static getFromReply = (replyId: string) => this.fact.get<IReply[]>("/replyReplies/")(replyId);
    static delete = this.fact.delete<boolean>();

    static like = (_id: string) => this.fact.post<boolean, IReply>("/like")({ _id });
    static isLiked = this.fact.get<boolean>("/liked/");
}

export type { IReply };
export default ReplyServices;