
import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";
import { IMessage } from "./MessageServices";

interface IConversation {
    _id: string;
    participants: string[];
    timeCreated?: Date;
    title?: string;
}

type ConversationResponse = ResponseResult< IConversation[] | IConversation | boolean >;

class ConversationServices {
    private static factConvo = new EndpointFactory<ConversationResponse>("/conversation");

    static create = this.factConvo.post<IConversation, IConversation>();
    static delete = this.factConvo.delete<boolean>();
    static getAll = () => this.factConvo.get<IConversation[]>()("");
    static getOne = (_id: string) => this.factConvo.get<IConversation>()(_id);
}

export type {IConversation};
export default ConversationServices;