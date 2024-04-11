import mongoose, { Document, Schema } from 'mongoose';

interface IReplyLike extends Document {
  replyId: mongoose.ObjectId;
  userID: mongoose.ObjectId;
}

const ReplyLikeSchema: Schema = new Schema({
    replyId: { type: Schema.Types.ObjectId, required: true, index: true,  ref: 'Reply' },
    userID: { type: Schema.Types.ObjectId, required: true, index: true, ref: 'User' }
});

const ReplyLikeModel = mongoose.model<IReplyLike>('ReplyLike', ReplyLikeSchema);

export type { IReplyLike as IPostLike };
export default ReplyLikeModel;
