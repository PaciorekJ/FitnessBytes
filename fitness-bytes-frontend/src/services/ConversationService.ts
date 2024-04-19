
import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";

interface IConversation {
    _id: string;
    participantUsernames: string[];
    participantIds: string [];
    timeCreated?: Date;
    title?: string;
}

type ConversationResponse = ResponseResult< IConversation[] | IConversation | boolean >;

class ConversationServices {
    private static factConvo = new EndpointFactory<ConversationResponse>("/conversation");
    
    static updateParticipants = this.factConvo.patch<IConversation, IConversation>('/participants/');
    static update = this.factConvo.patch<IConversation, IConversation>('/');
    static create = this.factConvo.post<IConversation, IConversation>();
    static delete = this.factConvo.delete<boolean>();
    static getAll = () => this.factConvo.get<IConversation[]>()("");
    static getOne = (_id: string) => this.factConvo.get<IConversation>()(_id);
}

export type { IConversation };
export default ConversationServices;