import mongoose, { Document, Schema } from "mongoose";

interface IConversation extends Document {
    participants: mongoose.Types.ObjectId[];
    timeCreated?: Date;
    title?: string;
}

const conversationSchema: Schema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    timeCreated: { type: Date, default: Date.now },
    title: { type: String, default: null },
})

conversationSchema.index({ participants: 1 });

const ConversationModel = mongoose.model<IConversation>('Conversation', conversationSchema);

export type { IConversation };
export default ConversationModel;