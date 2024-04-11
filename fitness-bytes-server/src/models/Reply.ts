
import mongoose, { Document, Schema } from 'mongoose';

interface IReply extends Document {
  userId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId; // Reference to the root post
  parentReplyId: mongoose.Types.ObjectId | null;
  content: string;
  likes: number;
  timeCreated: Date;
}

const ReplySchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' },
  postId: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'Post' },
  content: { type: String, required: true },
  parentReplyId: { type: Schema.Types.ObjectId, index: true, ref: 'Reply', default: null }, // Optional, for replies to replies
  likes: { type: Number, default: 0 },
  timeCreated: { type: Date, default: Date.now },
});

const ReplyModel = mongoose.model<IReply>('Reply', ReplySchema);

export type { IReply };
export default ReplyModel;
