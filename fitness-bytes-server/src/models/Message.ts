import mongoose, { Schema } from "mongoose";

interface IMessage extends Document {
    conversation: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    content: string;
    timeCreated?: Date;
}

const messageSchema: Schema = new Schema({
    conversation: {type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: {type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timeCreated: { type: Date, default: Date.now },
});

const MessageModel = mongoose.model<IMessage>('Message', messageSchema);

export type { IMessage };
export default MessageModel;