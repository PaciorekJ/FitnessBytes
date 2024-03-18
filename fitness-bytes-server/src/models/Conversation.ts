import mongoose, { Document, Schema } from "mongoose";

interface IConversation extends Document {
    participantUsernames: string[];
    participantIds: string[];
    timeCreated?: Date;
    title?: string;
}

const conversationSchema: Schema = new Schema({
    participantUsernames: [{ type: String, required: true }],
    participantIds: [{ type: String, required: true }],
    timeCreated: { type: Date, default: Date.now },
    title: { type: String, default: null },
})

conversationSchema.index({ participantIds: 1 });

const ConversationModel = mongoose.model<IConversation>('Conversation', conversationSchema);

export type { IConversation };
export default ConversationModel;