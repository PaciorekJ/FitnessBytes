
import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";
import { IMessage } from "./MessageServices";

interface IConversation {
    _id: string;
    participants: string[];
    timeCreated?: Date;
    title?: string;
}

type PostConversationResponse = {
    conversation: IConversation,
    message: IMessage,
}

type ConversationResponse = ResponseResult< IConversation[] | IConversation | boolean | PostConversationResponse >;

class ConversationServices {
    private static factConvo = new EndpointFactory<ConversationResponse>("/conversation");

    static create = this.factConvo.post<PostConversationResponse, IConversation & {messageContent: string}>();
    static delete = this.factConvo.delete<boolean>();
    static getAll = () => this.factConvo.get<IConversation[]>()("");
    static getOne = (_id: string) => this.factConvo.get<IConversation>()(_id);
}

export type { IConversation };
export default ConversationServices;