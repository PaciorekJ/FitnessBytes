

import { IConversation } from "./ConversationService";
import { ResponseResult } from "./HTTP-Services/ClientService";
import EndpointFactory from "./HTTP-Services/EndpointFactory";


interface IMessage {
    conversation: string;
    sender: string;
    senderUsername: string;
    content: string;
    timeCreated?: Date;
}

type MessageResponse = ResponseResult<IMessage[] | IMessage>;

class MessageServices {
    private static factMessage = new EndpointFactory<MessageResponse>("/message");
    
    static create = (_id: string, content: string) => this.factMessage.post<IMessage, IConversation & IMessage>()({
        conversation: _id,
        content: content
    });
    static getAll = (conversationId: string, pageNumber: number, pageLength: number) => this.factMessage.get<IMessage[]>("/", {
        params: {pageNumber, pageLength}
    })(conversationId);
}

export type { IMessage };
export default MessageServices;