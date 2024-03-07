
import Conversation from "../interfaces/Conversation";
import Message from "../interfaces/Message";
import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";

type GetConversationsResponse = Conversation[];
type GetConversationResponse = Conversation;
type DeleteConversationResponse = boolean;

type PostConversationResponse = {
    conversation: Conversation,
    message: Message,
}

type ConversationResponse = ResponseResult<GetConversationsResponse | 
                                    GetConversationResponse | 
                                    DeleteConversationResponse | 
                                    PostConversationResponse>;

class ConversationService {
    private static fact = new EndpointFactory<ConversationResponse>("/conversation");

    static post = this.fact.post<PostConversationResponse, Conversation>();
    static delete = this.fact.delete<DeleteConversationResponse>();
    static getAll = () => this.fact.get<GetConversationsResponse>()("");
    static getOne = (_id: string) => this.fact.get<GetConversationResponse>()(_id);

}

export default ConversationService;