
interface Conversation {
    _id: string;
    participants: string[];
    timeCreated?: Date;
    title?: string;
}

export default Conversation;