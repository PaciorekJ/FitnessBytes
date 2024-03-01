
interface IMessage {
    conversation: string;
    sender: string;
    senderUsername: string;
    content: string;
    timeCreated?: Date;
}

export default IMessage